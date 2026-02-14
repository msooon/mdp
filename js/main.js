/**
 * Main application entry point
 * Initializes all components and sets up event listeners
 */

class MDP {
    constructor() {
        this.editor = null;
        this.renderer = null;
        this.previewMode = false;
        this.currentFilename = 'untitled.md';
        this.init();
    }

    async init() {
        console.log('MDP: Initializing application...');
        
        // Initialize core components
        this.setupDOMElements();
        this.setupEventListeners();
        this.setupLibraries();
        
        console.log('MDP: Application initialized successfully');
    }

    setupDOMElements() {
        this.dom = {
            editor: document.getElementById('editor'),
            preview: document.getElementById('preview'),
            previewContent: document.getElementById('preview-content'),
            previewToggle: document.getElementById('preview-toggle'),
            sidebar: document.getElementById('sidebar'),
            syntaxModal: document.getElementById('syntax-modal'),
            modalTitle: document.getElementById('modal-title'),
            modalBody: document.getElementById('modal-body'),
            closeModal: document.querySelector('.close'),
            fileInput: document.getElementById('file-input'),
        };
    }

    setupEventListeners() {
        // Editor input
        this.dom.editor.addEventListener('input', () => this.onEditorChange());
        this.dom.editor.addEventListener('keydown', (e) => this.onEditorKeydown(e));

        // Preview toggle
        this.dom.previewToggle.addEventListener('change', (e) => this.togglePreview(e.target.checked));

        // Modal close
        this.dom.closeModal.addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === this.dom.syntaxModal) {
                this.closeModal();
            }
        });

        // File operations
        document.getElementById('btn-new').addEventListener('click', () => this.newDocument());
        document.getElementById('btn-open').addEventListener('click', () => this.openFile());
        document.getElementById('btn-save').addEventListener('click', () => this.saveFile());

        // Library buttons
        document.getElementById('btn-markdown').addEventListener('click', () => this.showSyntaxHelp('markdown'));
        document.getElementById('btn-math').addEventListener('click', () => this.showSyntaxHelp('math'));
        document.getElementById('btn-chem').addEventListener('click', () => this.showSyntaxHelp('chem'));
        document.getElementById('btn-svg').addEventListener('click', () => this.showSyntaxHelp('svg'));
        document.getElementById('btn-mermaid').addEventListener('click', () => this.showSyntaxHelp('mermaid'));
        document.getElementById('btn-wiki').addEventListener('click', () => this.showSyntaxHelp('wiki'));

        // Format buttons
        document.getElementById('btn-bold').addEventListener('click', () => this.insertMarkdown('**', '**', 'bold text'));
        document.getElementById('btn-italic').addEventListener('click', () => this.insertMarkdown('*', '*', 'italic text'));
        document.getElementById('btn-code').addEventListener('click', () => this.insertMarkdown('\`', '\`', 'code'));
        document.getElementById('btn-link').addEventListener('click', () => this.insertMarkdown('[', '](url)', 'link text'));

        // File input
        this.dom.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
    }

    setupLibraries() {
        // Initialize syntax highlighting
        if (typeof SyntaxHighlighter !== 'undefined') {
            SyntaxHighlighter.init();
        }

        // Initialize Mermaid
        if (typeof mermaid !== 'undefined') {
            mermaid.initialize({ startOnLoad: true, theme: 'default' });
        }

        console.log('Libraries initialized');
    }

    onEditorChange() {
        if (this.previewMode) {
            this.updatePreview();
        }
    }

    onEditorKeydown(e) {
        // Tab handling
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.dom.editor.selectionStart;
            const end = this.dom.editor.selectionEnd;
            this.dom.editor.value = this.dom.editor.value.substring(0, start) + '\t' + this.dom.editor.value.substring(end);
            this.dom.editor.selectionStart = this.dom.editor.selectionEnd = start + 1;
            this.onEditorChange();
        }
    }

    async updatePreview() {
        const markdown = this.dom.editor.value;
        
        if (typeof Renderer !== 'undefined') {
            const html = await Renderer.render(markdown);
            this.dom.previewContent.innerHTML = html;
            
            // Post-render processing
            this.processPreviewContent();
        }
    }

    processPreviewContent() {
        // Highlight code blocks
        if (typeof hljs !== 'undefined') {
            this.dom.previewContent.querySelectorAll('pre code').forEach(block => {
                hljs.highlightElement(block);
            });
        }

        // Render math
        if (typeof MathHandler !== 'undefined') {
            MathHandler.renderMath(this.dom.previewContent);
        }

        // Render chemistry
        if (typeof ChemHandler !== 'undefined') {
            ChemHandler.render(this.dom.previewContent);
        }

        // Render SVG
        if (typeof SVGHandler !== 'undefined') {
            SVGHandler.render(this.dom.previewContent);
        }

        // Render Mermaid diagrams
        if (typeof MermaidHandler !== 'undefined') {
            MermaidHandler.render(this.dom.previewContent);
        }

        // Make checkboxes interactive
        this.dom.previewContent.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                console.log('Checkbox changed:', e.target.checked);
            });
        });
    }

    togglePreview(show) {
        this.previewMode = show;
        if (show) {
            this.dom.preview.classList.remove('hidden');
            this.updatePreview();
        } else {
            this.dom.preview.classList.add('hidden');
        }
    }

    insertMarkdown(before, after, placeholder) {
        const start = this.dom.editor.selectionStart;
        const end = this.dom.editor.selectionEnd;
        const selectedText = this.dom.editor.value.substring(start, end);
        const text = selectedText || placeholder;
        
        this.dom.editor.value = 
            this.dom.editor.value.substring(0, start) + 
            before + text + after + 
            this.dom.editor.value.substring(end);
        
        this.dom.editor.selectionStart = start + before.length;
        this.dom.editor.selectionEnd = start + before.length + text.length;
        this.dom.editor.focus();
        this.onEditorChange();
    }

    newDocument() {
        if (this.dom.editor.value && !confirm('Discard current document?')) {
            return;
        }
        this.dom.editor.value = '';
        this.currentFilename = 'untitled.md';
        this.onEditorChange();
    }

    openFile() {
        this.dom.fileInput.click();
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        this.currentFilename = file.name;
        const reader = new FileReader();
        reader.onload = (event) => {
            this.dom.editor.value = event.target.result;
            this.onEditorChange();
        };
        reader.readAsText(file);
    }

    saveFile() {
        const content = this.dom.editor.value;
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.currentFilename;
        a.click();
        URL.revokeObjectURL(url);
    }

    showSyntaxHelp(type) {
        const helps = {
            markdown: {
                title: 'Markdown Syntax',
                content: `
# Headings
# H1, ## H2, ### H3, #### H4

**Bold**: **text** or __text__
*Italic*: *text* or _text_
***Bold Italic***: ***text***

\`Inline Code\`

[Link](url)
![Image](url)

- Bullet list
  - Nested

1. Numbered
2. List

> Blockquote

| Header | Col |
|--------|-----|
| Cell   | Data |

\`\`\`language
Code block
\`\`\`
                `
            },
            math: {
                title: 'Math Formulas (KaTeX)',
                content: `
Inline: \$E = mc^2\$\n
Display:
\$\$\nE = mc^2\n\$\$\n
Examples:
\$\sqrt{x^2 + y^2}\$\n\$\frac{a}{b}\$\n\$\sum_{i=1}^{n} x_i\$\n                `
            },
            chem: {
                title: 'Chemistry Formulas',
                content: `
Chemical equations:
H2O (Water)
NaCl (Sodium Chloride)
CH4 (Methane)

Use bracket notation:
[H2O] for water molecules
[reaction: H2 + O2 -> H2O]
                `
            },
            svg: {
                title: 'SVG Support',
                content: `
\`\`\`svg
<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" fill="blue"/>
</svg>
\`\`\`

Supported elements:
- circle, rect, line, polygon
- path, text, g
- Styling with fill, stroke, opacity
                `
            },
            mermaid: {
                title: 'Mermaid Diagrams',
                content: `
\`\`\`mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[End]
\`\`\`

Types: graph, sequence, class, state, pie, gantt
                `
            },
            wiki: {
                title: 'Wiki Shortcuts',
                content: `
[[Page Name]] - Link to page
[[Page Name|Display Text]] - Link with custom text

*emphasis* - Italic
**strong** - Bold
\`code\` - Code

== Heading 2 ==
=== Heading 3 ===
                `
            }
        };

        const help = helps[type] || helps.markdown;
        this.dom.modalTitle.textContent = help.title;
        this.dom.modalBody.innerHTML = `<pre>${help.content}</pre>`;
        this.dom.syntaxModal.classList.remove('hidden');
    }

    closeModal() {
        this.dom.syntaxModal.classList.add('hidden');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.mdp = new MDP();
});
