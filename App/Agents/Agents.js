import HTMLEditor from "/App/utils/HTMLEditor.js";

class Agents {
    constructor() {
        this.self = document.createElement("div");
        this.self.classList.add("Agents_component");
        this.html = `
        <section class="agents_container">
            <ul>
                <li>
                    Сотрудник1
                </li>
                <li>
                    Сотрудник2
                </li>
                <li>
                    Сотрудник3
                </li>
                <li>
                    Сотрудник4
                </li>
                <li>
                    Сотрудник5
                </li>
            </ul>
        </section>
        `;
        this.editor = new HTMLEditor(this.html);

        this.ComponentStart();
    }

    ComponentStart() {
        // В HTMLEditor лучше не лезть без особой необходимости. Писал я его давно.
        // Причем так, чтобы не пришлось лезть.
        // В начале файла есть комент с алгоритмом использование
        this.components = this.editor.HTMLParser();
        this.editor.HTMLPrinter(this.self);
    }

    getContent() {
        return this.self;
    }
}

export default Agents;
