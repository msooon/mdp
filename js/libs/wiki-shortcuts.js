/**
 * Wiki Shortcuts
 * Processes Gollum wiki-style shortcuts
 */

class WikiShortcuts {
    static processWikiLinks(text) {
        // [[Page Name]] - Internal wiki link
        text = text.replace(/\[\[(\[^\]\]+)\]\]/g, (match, content) => {
            const parts = content.split('|');
            const pageName = parts[0].trim();
            const displayText = parts[1] ? parts[1].trim() : pageName;
            const slug = this.slugify(pageName);
            return `[[${displayText}]](${slug})`;
        });

        return text;
    }

    static processWikiSyntax(text) {
        // Wiki-style bold/italic emphasis
        text = text.replace(/\\*\\*_(.*?)_\\*\\*/g, '<strong><em>$1</em></strong>');
        text = text.replace(/\\*\\*_(.+?)_\\*\\*/g, '<strong><em>$1</em></strong>');

        return text;
    }

    static slugify(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^[\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }

    static isWikiLink(text) {
        return /\\[\\[[^\\]]+\\]\]/.test(text);
    }

    static extractWikiLinks(text) {
        const links = [];
        const regex = /\[\[([^\]]+)\]\]/g;
        let match;

        while ((match = regex.exec(text)) !== null) {
            const content = match[1];
            const parts = content.split('|');
            links.push({
                original: match[0],
                page: parts[0].trim(),
                display: parts[1] ? parts[1].trim() : parts[0].trim(),
                slug: this.slugify(parts[0].trim())
            });
        }

        return links;
    }

    static getExamples() {
        return [
            {
                name: 'Internal Link',
                code: '[[Home]]'
            },
            {
                name: 'Link with Display Text',
                code: '[[API Documentation|API]]'
            },
            {
                name: 'Multi-word Link',
                code: '[[Getting Started Guide]]'
            },
            {
                name: 'Link in Sentence',
                code: 'See the [[Configuration Guide|configuration]] for setup instructions.'
            },
            {
                name: 'Wiki Heading',
                code: '== Section Header =='
            },
            {
                name: 'Emphasis',
                code: '*italic* and **bold** text'
            }
        ];
    }
}

// Export for use
window.WikiShortcuts = WikiShortcuts;
