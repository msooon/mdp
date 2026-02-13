/**
 * Chemistry Handler
 * Processes and renders chemical formulas and equations
 */

class ChemHandler {
    static processBlocks(html) {
        // Chemistry formulas in [CHEM]...[/CHEM]
        html = html.replace(/\\[CHEM\\](.*?)\\[\\/CHEM\\]/gi, (match, content) => {
            return ` <div class="chem-formula" data-formula="${this.escapeAttr(content)}"></div>`;
        });

        // Simple inline chemistry notation [H2O], [CO2], etc.
        html = html.replace(/\\[([A-Za-z0-9()]+)\\]/g, (match, content) => {
            if (this.isChemFormula(content)) {
                return `<span class="chem-inline" data-formula="${content}">${this.formatFormula(content)}</span>`;
            }
            return match;
        });

        return html;
    }

    static render(container) {
        // Render chemistry elements
        container.querySelectorAll('[data-formula]').forEach(el => {
            const formula = el.getAttribute('data-formula');
            el.innerHTML = this.renderFormula(formula);
        });
    }

    static isChemFormula(str) {
        // Check if string looks like a chemical formula
        return /^[A-Z][a-z]?([0-9]+[A-Z][a-z]?)*[0-9]*$/.test(str);
    }

    static formatFormula(formula) {
        // Convert H2O to H<sub>2</sub>O
        return formula.replace(/(\\d+)/g, '<sub>$1</sub>');
    }

    static renderFormula(formula) {
        // Enhanced rendering with proper subscripts and superscripts
        let result = '';
        let i = 0;

        while (i < formula.length) {
            const char = formula[i];

            if (/[A-Z]/.test(char)) {
                result += char;
                i++;

                // Check for lowercase letter (e.g., 'Cl')
                if (i < formula.length && /[a-z]/.test(formula[i])) {
                    result += formula[i];
                    i++;
                }

                // Check for numbers
                let num = '';
                while (i < formula.length && /[0-9]/.test(formula[i])) {
                    num += formula[i];
                    i++;
                }

                if (num) {
                    result += `<sub>${num}</sub>`;
                }
            } else {
                result += char;
                i++;
            }
        }

        return result;
    }

    static getExamples() {
        return [
            { name: 'Water', code: '[H2O]' },
            { name: 'Carbon Dioxide', code: '[CO2]' },
            { name: 'Sodium Chloride', code: '[NaCl]' },
            { name: 'Sulfuric Acid', code: '[H2SO4]' },
            { name: 'Methane', code: '[CH4]' },
            { name: 'Glucose', code: '[C6H12O6]' },
        ];
    }
}

// Export for use
window.ChemHandler = ChemHandler;