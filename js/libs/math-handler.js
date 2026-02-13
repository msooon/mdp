/**
 * Math Handler
 * Processes and renders mathematical formulas using KaTeX
 */

class MathHandler {
    static processBlocks(html) {
        // Display math ($$...$$)
        html = html.replace(/\$\$([^$]+)\$\$/g, (match, content) => {
            return \`<div class=\"math-display\" data-math=\"\${this.escapeAttr(content)}\">$$\${content}$$</div>\`;
        });

        // Inline math ($...$) - be careful not to match single $
        html = html.replace(/([^$]|^)\$([^$\n]+)\$([^$]|$)/g, (match, before, content, after) => {
            return before + \`<span class=\"math-inline\" data-math=\"\${this.escapeAttr(content)}\">$\${content}$</span>\` + after;
        });

        return html;
    }

    static renderMath(container) {
        if (typeof katex === 'undefined') {
            console.warn('KaTeX not loaded. Math rendering disabled.');
            return;
        }

        // Render display math
        container.querySelectorAll('.math-display').forEach(el => {
            const math = el.getAttribute('data-math');
            if (math) {
                try {
                    el.innerHTML = '';
                    katex.render(math, el, { displayMode: true });
                } catch (e) {
                    el.textContent = 'Math Error: ' + e.message;
                }
            }
        });

        // Render inline math
        container.querySelectorAll('.math-inline').forEach(el => {
            const math = el.getAttribute('data-math');
            if (math) {
                try {
                    el.innerHTML = '';
                    katex.render(math, el, { displayMode: false });
                } catch (e) {
                    el.textContent = 'Error';
                }
            }
        });
    }

    static escapeAttr(str) {
        return str.replace(/\"/g, '&quot;').replace(/\'/g, '&#39;');
    }

    static getExamples() {
        return [
            { name: 'Inline Math', code: '\$E = mc^2\$' },
            { name: 'Fraction', code: '\$\frac{a}{b}\$' },
            { name: 'Square Root', code: '\$\sqrt{x^2 + y^2}\$' },
            { name: 'Sum', code: '\$\sum_{i=1}^{n} x_i\$' },
            { name: 'Integral', code: '\$\int_0^\infty e^{-x^2} dx\$' },
            { name: 'Matrix', code: '\$\begin{pmatrix} a & b \\ c & d \end{pmatrix}\$' },
        ];
    }
}

// Export for use
window.MathHandler = MathHandler;