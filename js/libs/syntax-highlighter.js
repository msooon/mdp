/**
 * Syntax Highlighter
 * Handles code block syntax highlighting using Highlight.js
 */

class SyntaxHighlighter {
    static init() {
        if (typeof hljs === 'undefined') {
            console.warn('Highlight.js not loaded. Syntax highlighting disabled.');
            return;
        }

        // Register custom language aliases if needed
        this.registerAliases();
    }

    static registerAliases() {
        // Custom aliases for common languages
        const aliases = {
            'js': 'javascript',
            'py': 'python',
            'cpp': 'c++',
            'cs': 'csharp',
            'rb': 'ruby',
            'go': 'golang',
            'sh': 'bash',
            'sql': 'sql',
        };

        Object.entries(aliases).forEach(([alias, lang]) => {
            if (hljs.getLanguage(lang)) {
                hljs.registerLanguage(alias, hljs.getLanguage(lang));
            }
        });
    }

    static highlightCode(code, language) {
        if (typeof hljs === 'undefined') {
            return code;
        }

        try {
            if (language && hljs.getLanguage(language)) {
                return hljs.highlight(code, { language, ignoreIllegals: true }).value;
            } else {
                // Auto-detect language
                return hljs.highlightAuto(code).value;
            }
        } catch (e) {
            console.error('Highlighting error:', e);
            return code;
        }
    }

    static highlightElement(element) {
        if (typeof hljs === 'undefined') {
            return;
        }

        try {
            hljs.highlightElement(element);
        } catch (e) {
            console.error('Error highlighting element:', e);
        }
    }

    static getLanguages() {
        if (typeof hljs === 'undefined') {
            return [];
        }

        const common = [
            'javascript',
            'python',
            'java',
            'cpp',
            'csharp',
            'php',
            'ruby',
            'go',
            'rust',
            'sql',
            'html',
            'css',
            'json',
            'xml',
            'yaml',
            'bash',
            'markdown',
        ];

        return common;
    }

    static getExamples() {
        return [
            {
                name: 'JavaScript',
                code: `\
function hello(name) {
  console.log(\\`Hello, ${name}!\\`);
}

hello('World');
`            },
            {
                name: 'Python',
                code: `\
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))
`            },
            {
                name: 'HTML',
                code: `\
<!DOCTYPE html>
<html>
  <head>
    <title>Hello World</title>
  </head>
  <body>
    <h1>Welcome</h1>
  </body>
</html>
`            },
            {
                name: 'CSS',
                code: `\
.container {
  display: flex;
  justify-content: center;
  background-color: #f0f0f0;
}
`            },
            {
                name: 'SQL',
                code: `\
SELECT id, name, email 
FROM users 
WHERE created_at > '2024-01-01'
ORDER BY name;
`            }
        ];
    }
}

// Export for use
window.SyntaxHighlighter = SyntaxHighlighter;