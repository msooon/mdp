/**
 * Toolbar Module
 * Manages top toolbar functionality
 */

class Toolbar {
    constructor() {
        this.buttons = {};
        this.init();
    }

    init() {
        this.setupButtons();
    }

    setupButtons() {
        const buttonIds = ['btn-new', 'btn-open', 'btn-save', 'btn-help'];
        
        buttonIds.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                this.buttons[id] = btn;
            }
        });
    }

    disableButton(id) {
        if (this.buttons[id]) {
            this.buttons[id].disabled = true;
            this.buttons[id].style.opacity = '0.5';
        }
    }

    enableButton(id) {
        if (this.buttons[id]) {
            this.buttons[id].disabled = false;
            this.buttons[id].style.opacity = '1';
        }
    }

    updateStatus(message) {
        // Can be extended to show status messages
        console.log('Status:', message);
    }

    addButton(id, label, callback) {
        const btn = document.createElement('button');
        btn.id = id;
        btn.className = 'btn';
        btn.textContent = label;
        btn.addEventListener('click', callback);
        
        // Add to toolbar (first menu group)
        const menuGroup = document.querySelector('.menu-group');
        if (menuGroup) {
            menuGroup.appendChild(btn);
        }

        this.buttons[id] = btn;
    }

    getButton(id) {
        return this.buttons[id];
    }

    showNotification(message, type = 'info') {
        console.log(`[\${type.toUpperCase()}] \\${message}`);
        // Can be extended to show visual notifications
    }
}

// Export for use
window.Toolbar = Toolbar;