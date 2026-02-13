/**
 * Markdown Renderer
 * Converts markdown to HTML with support for custom syntax extensions
 */

class Renderer {
    static async render(markdown) {
        let html = markdown;

        // Process wiki shortcuts first (before markdown parsing)
        html = WikiShortcuts.processWikiLinks(html);

        // Basic markdown conversion
        html = this.convertMarkdown(html);

        // Process mermaid blocks
        html = MermaidHandler.processBlocks(html);

        // Process math blocks
        html = MathHandler.processBlocks(html);

        // Process chemistry
        html = ChemHandler.processBlocks(html);

        // Process SVG blocks
        html = SVGHandler.processBlocks(html);

        // Wrap in preview container
        return `<div class="markdown-content">${html}</div>`;
    }

    static convertMarkdown(text) {
        // Escape HTML
        text = this.escapeHtml(text);

        // Code blocks (preserve content)
        const codeBlocks = [];
        text = text.replace(/```[\s\S]*?```/g, (match) => {
            codeBlocks.push(match);
            return `<!--CODE_BLOCK_${codeBlocks.length - 1}-->`;
        });

        // Headings
        text = text.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
        text = text.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
        text = text.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

        // Horizontal rules
        text = text.replace(/^---$/gm, '<hr>');

        // Bold and Italic
        text = text.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        text = text.replace(/_(.*?)_/g, '<em>$1</em>');

        // Inline code
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Links
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

        // Images
        text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

        // Blockquotes
        text = text.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');

        // Unordered lists
        text = this.convertLists(text);

        // Task lists (checkboxes)
        text = text.replace(/- \[ \] (.*?)$/gm, '<input type="checkbox"> <label>$1</label>');
        text = text.replace(/- \[x\] (.*?)$/gm, '<input type="checkbox" checked> <label>$1</label>');

        // Tables
        text = this.convertTables(text);

        // Paragraphs
        text = text.split('\n\n').map(para => {
            if (!para.startsWith('<')) {
                return `<p>${para.split('\n').join('<br>')}</p>`;
            }
            return para;
        }).join('\n');

        // Restore code blocks
        codeBlocks.forEach((block, i) => {
            const lang = block.match(/```([a-z]*)/)[1] || '';
            const content = block.replace(/```[a-z]*\n?/, '').replace(/```$/, '');
            const html = lang ? 
                `<pre><code class="language-${lang}">${content.trim()}</code></pre>` :
                `<pre><code>${content.trim()}</code></pre>`;
            text = text.replace(`<!--CODE_BLOCK_${i}-->`, html);
        });

        return text;
    }

    static convertLists(text) {
        // Unordered lists
        const lines = text.split('\n');
        let result = [];
        let inList = false;
        let listType = null;

        lines.forEach(line => {
            if (/^\s*[-*+]\s/.test(line)) {
                if (!inList) {
                    result.push('<ul>');
                    inList = true;
                    listType = 'ul';
                }
                const indent = line.match(/^\s*/)[0].length;
                const content = line.replace(/^\s*[-*+]\s/, '').trim();
                result.push(`<li>${content}</li>`);
            } else if (/^\s*\d+\.\s/.test(line)) {
                if (!inList || listType !== 'ol') {
                    if (inList) result.push(listType === 'ul' ? '</ul>' : '</ol>');
                    result.push('<ol>');
                    inList = true;
                    listType = 'ol';
                }
                const content = line.replace(/^\s*\d+\.\s/, '').trim();
                result.push(`<li>${content}</li>`);
            } else {
                if (inList) {
                    result.push(listType === 'ul' ? '</ul>' : '</ol>');
                    inList = false;
                }
                result.push(line);
            }
        });

        if (inList) {
            result.push(listType === 'ul' ? '</ul>' : '</ol>');
        }

        return result.join('\n');
    }

    static convertTables(text) {
        const tableRegex = /\|(.+)\|\n\|[-\s|:]+\|\n([\s\S]*?)(?=\n\n|$)/g;
        return text.replace(tableRegex, (match, header, body) => {
            const headers = header.split('|').map(h => h.trim()).filter(h => h);
            const rows = body.trim().split('\n').map(row => 
                row.split('|').map(cell => cell.trim()).filter(cell => cell)
            );

            let html = '<table>\n<thead><tr>';
            headers.forEach(h => html += `<th>${h}</th>`);
            html += '</tr></thead>\n<tbody>';
            rows.forEach(row => {
                html += '<tr>';
                row.forEach(cell => html += `<td>${cell}</td>`);
                html += '</tr>';
            });
            html += '</tbody>\n</table>';
            return html;
        });
    }

    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Export for use
window.Renderer = Renderer;
