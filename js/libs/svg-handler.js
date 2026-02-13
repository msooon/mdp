/**
 * SVG Handler
 * Processes and renders SVG content safely
 */

class SVGHandler {
    static processBlocks(html) {
        // SVG code blocks: ```svg ... ```
        const svgBlockRegex = /\`\`\`svg\\n([\\s\\S]*?)\`\`\`/g;
        html = html.replace(svgBlockRegex, (match, content) => {
            return `<div class="svg-container">${content.trim()}</div>`;
        });

        return html;
    }

    static render(container) {
        // Sanitize and display SVG elements
        container.querySelectorAll('.svg-container').forEach(el => {
            try {
                const svgContent = el.innerHTML.trim();
                if (svgContent.startsWith('<svg')) {
                    // SVG is already in HTML format, just ensure it's safe
                    el.innerHTML = this.sanitizeSVG(svgContent);
                }
            } catch (e) {
                el.innerHTML = '<p style="color: red;">Invalid SVG</p>';
            }
        });
    }

    static sanitizeSVG(svgString) {
        // Create a temporary element to parse SVG
        const div = document.createElement('div');
        div.innerHTML = svgString;

        // Get the SVG element
        const svg = div.querySelector('svg');
        if (!svg) return '<p>Invalid SVG</p>';

        // Sanitize dangerous attributes
        const dangerous = ['onclick', 'onload', 'onerror', 'script'];
        const walk = (node) => {
            if (node.nodeType === 1) { // Element node
                // Remove dangerous attributes
                for (let attr of node.attributes) {
                    if (dangerous.some(d => attr.name.toLowerCase().includes(d))) {
                        node.removeAttribute(attr.name);
                    }
                }

                // Walk children
                for (let child of node.children) {
                    walk(child);
                }
            }
        };

        walk(svg);

        // Add styling
        svg.style.maxWidth = '100%';
        svg.style.height = 'auto';
        svg.style.border = '1px solid #e0e0e0';
        svg.style.borderRadius = '4px';

        return svg.outerHTML;
    }

    static getExamples() {
        return [
            {
                name: 'Circle',
                code: `\`\`\`svg
<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" fill="blue" stroke="black" stroke-width="2"/>
</svg>
\`\`\``
            },
            {
                name: 'Rectangle',
                code: `\`\`\`svg
<svg width="200" height="100">
  <rect x="10" y="10" width="180" height="80" fill="red" stroke="black" stroke-width="2"/>
</svg>
\`\`\``
            },
            {
                name: 'Triangle',
                code: `\`\`\`svg
<svg width="100" height="100">
  <polygon points="50,10 90,90 10,90" fill="green" stroke="black"/>
</svg>
\`\`\``
            },
            {
                name: 'Line Graph',
                code: `\`\`\`svg
<svg width="200" height="100">
  <polyline points="0,50 50,30 100,60 150,20 200,40" 
            stroke="blue" stroke-width="2" fill="none"/>
</svg>
\`\`\``
            }
        ];
    }
}

// Export for use
window.SVGHandler = SVGHandler;