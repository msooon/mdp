/**
 * Editor module
 * Handles core editor functionality and document management
 */

class Editor {
    constructor(textareaElement) {
        this.element = textareaElement;
        this.history = [];
        this.historyIndex = -1;
        this.init();
    }

    init() {
        this.setupEditor();
    }

    setupEditor() {
        // Add line numbers (optional enhancement)
        this.element.addEventListener('scroll', () => {
            this.syncScroll();
        });
    }

    syncScroll() {
        // For future: sync scroll with preview
    }

    getText() {
        return this.element.value;
    }

    setText(text) {
        this.element.value = text;
        this.addToHistory(text);
    }

    insertText(text, position = null) {
        if (position === null) {
            position = this.element.selectionStart;
        }
        const before = this.element.value.substring(0, position);
        const after = this.element.value.substring(position);
        this.element.value = before + text + after;
    }

    addToHistory(text) {
        this.historyIndex++;
        this.history = this.history.slice(0, this.historyIndex);
        this.history.push(text);
        
        // Limit history size
        if (this.history.length > 50) {
            this.history.shift();
        }
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.element.value = this.history[this.historyIndex];
            return true;
        }
        return false;
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.element.value = this.history[this.historyIndex];
            return true;
        }
        return false;
    }

    getSelectedText() {
        return this.element.value.substring(
            this.element.selectionStart,
            this.element.selectionEnd
        );
    }

    getLineNumber() {
        return this.element.value.substring(0, this.element.selectionStart).split('\n').length;
    }

    getColumnNumber() {
        const lastNewline = this.element.value.lastIndexOf('\n', this.element.selectionStart);
        return this.element.selectionStart - (lastNewline === -1 ? 0 : lastNewline + 1);
    }

    getCurrentLine() {
        const text = this.element.value;
        const start = text.lastIndexOf('\n', this.element.selectionStart) + 1;
        const end = text.indexOf('\n', this.element.selectionStart);
        return text.substring(start, end === -1 ? text.length : end);
    }

    replaceLine(lineNumber, newContent) {
        const lines = this.element.value.split('\n');
        if (lineNumber >= 0 && lineNumber < lines.length) {
            lines[lineNumber] = newContent;
            this.setText(lines.join('\n'));
        }
    }

    clear() {
        this.element.value = '';
        this.history = [];
        this.historyIndex = -1;
    }

    focus() {
        this.element.focus();
    }

    getCursorPosition() {
        return {
            start: this.element.selectionStart,
            end: this.element.selectionEnd,
            line: this.getLineNumber(),
            column: this.getColumnNumber()
        };
    }

    setCursorPosition(start, end = null) {
        this.element.selectionStart = start;
        this.element.selectionEnd = end || start;
        this.element.focus();
    }
}

// Export for use in main.js
window.EditorInstance = Editor;