/**
 * Preview Module
 * Manages preview panel functionality
 */

class PreviewPanel {
    constructor() {
        this.element = document.getElementById('preview');
        this.content = document.getElementById('preview-content');
        this.toggle = document.getElementById('preview-toggle');
        this.isVisible = false;
        this.init();
    }

    init() {
        if (this.toggle) {
            this.toggle.addEventListener('change', (e) => {
                this.setVisible(e.target.checked);
            });
        }
    }

    setVisible(visible) {
        this.isVisible = visible;
        if (visible) {
            this.element.classList.remove('hidden');
        } else {
            this.element.classList.add('hidden');
        }
    }

    updateContent(html) {
        this.content.innerHTML = html;
    }

    clear() {
        this.content.innerHTML = '';
    }

    scroll(position) {
        this.element.scrollTop = position;
    }

    getScrollPosition() {
        return this.element.scrollTop;
    }

    getVisible() {
        return this.isVisible;
    }

    addStylesheet(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }

    executeScript(code) {
        try {
            new Function(code)();
        } catch (e) {
            console.error('Script error:', e);
        }
    }
}

// Export for use
window.PreviewPanel = PreviewPanel;