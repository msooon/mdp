/**
 * Mermaid Handler
 * Processes and renders Mermaid diagrams
 */

class MermaidHandler {
    static processBlocks(html) {
        // Mermaid code blocks: ```mermaid ... ```
        const mermaidRegex = /\`\`\`mermaid\\n([\\s\\S]*?)\`\`\`/g;
        html = html.replace(mermaidRegex, (match, content) => {
            // Add unique ID for each diagram
            const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
            return `<div id="${id}" class="mermaid">${content.trim()}</div>`;
        });

        return html;
    }

    static async render(container) {
        if (typeof mermaid === 'undefined') {
            console.warn('Mermaid not loaded. Diagram rendering disabled.');
            return;
        }

        // Render all mermaid diagrams in container
        const diagrams = container.querySelectorAll('.mermaid');
        if (diagrams.length === 0) return;

        try {
            // Call mermaid contentLoaded to process diagrams
            await mermaid.contentLoaded();
        } catch (e) {
            console.error('Mermaid rendering error:', e);
            diagrams.forEach(diagram => {
                diagram.innerHTML = '<p style="color: red;">Diagram Error: ' + e.message + '</p>';
            });
        }
    }

    static getExamples() {
        return [
            {
                name: 'Flowchart',
                code: `\`\`\`mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[End]
    C --> D
\`\`\``
            },
            {
                name: 'Sequence Diagram',
                code: `\`\`\`mermaid
sequenceDiagram
    participant A as Client
    participant B as Server
    A->>B: Request
    B->>A: Response
\`\`\``
            },
            {
                name: 'Class Diagram',
                code: `\`\`\`mermaid
classDiagram
    class Animal {
        +String name
        +eat()
    }
    class Dog {
        +bark()
    }
    Dog --|> Animal
\`\`\``
            },
            {
                name: 'State Diagram',
                code: `\`\`\`mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Working
    Working --> Done
    Done --> [*]
\`\`\``
            },
            {
                name: 'Pie Chart',
                code: `\`\`\`mermaid
pie title Browser Market Share
    "Chrome" : 70
    "Firefox" : 15
    "Safari" : 10
    "Others" : 5
\`\`\``
            }
        ];
    }
}

// Export for use
window.MermaidHandler = MermaidHandler;