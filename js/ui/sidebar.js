/**
 * Sidebar Module
 * Manages sidebar functionality and library button interactions
 */

class Sidebar {
    constructor() {
        this.libraries = {};
        this.init();
    }

    init() {
        this.setupLibraryButtons();
    }

    setupLibraryButtons() {
        const libButtons = {
            'btn-markdown': 'markdown',
            'btn-math': 'math',
            'btn-chem': 'chem',
            'btn-svg': 'svg',
            'btn-mermaid': 'mermaid',
            'btn-wiki': 'wiki'
        };

        Object.entries(libButtons).forEach(([buttonId, libName]) => {
            const btn = document.getElementById(buttonId);
            if (btn) {
                this.libraries[libName] = {
                    button: btn,
                    name: libName
                };
            }
        });
    }

    highlightLibrary(libName) {
        Object.values(this.libraries).forEach(lib => {
            lib.button.style.backgroundColor = '';
        });

        if (this.libraries[libName]) {
            this.libraries[libName].button.style.backgroundColor = 'var(--accent-color)';
            this.libraries[libName].button.style.color = 'white';
        }
    }

    resetHighlight() {
        Object.values(this.libraries).forEach(lib => {
            lib.button.style.backgroundColor = '';
            lib.button.style.color = '';
        });
    }

    getLibraryButton(libName) {
        return this.libraries[libName]?.button;
    }

    toggleLibrary(libName) {
        // Can be used to toggle library state
        if (this.libraries[libName]) {
            this.libraries[libName].button.classList.toggle('active');
        }
    }
}

// Export for use
window.Sidebar = Sidebar;