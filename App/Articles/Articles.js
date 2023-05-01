import HTMLEditor from "/App/utils/HTMLEditor.js";

class Articles {
    constructor() {
        this.self = document.createElement("div");
        this.self.classList.add("Articles_component");
        this.html = `
        <section class="articles_container">
            <nav>
                <ul>
                    <li>Предыдущая статья</li>
                    <li>Следующая статья</li>
                    <li>Оценить статью</li>
                </ul>
            </nav>
            <ul>
                <li>Статья1</li>
                <li>Статья2</li>
                <li>Статья3</li>
                <li>Статья4</li>
                <li>Статья5</li>
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

export default Articles;
