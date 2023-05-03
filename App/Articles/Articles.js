import HTMLEditor from "/App/utils/HTMLEditor.js";

class Articles {
    constructor() {
        this.self = document.createElement("div");
        this.self.classList.add("Articles_component");
        this.self.classList.add("fixed_container");
        this.html = `
        <section class="articles_container fixed_container">
            <nav>
                <div class="search_con">
                    <input class="search_input" type="text" name="searchArticles" value="" placeholder="Название или фраза">
                    <button class="search_button" type="button" name="searchArticlesButton"></button>
                </div>
                <div class="button_group">
                    <button class="prev" type="button" name="prevArticle"></button>
                    <button class="read" type="button" name="readArticle"></button>
                    <button class="next" type="button" name="nextArticle"></button>
                </div>
                <button type="button" name="showMenu">></button>
            </nav>
            <ul class="list_article">
                <li class="item_article">
                    <h2>Квантование лазерных пучков и их синергетика с квантами нагретой плазмы</h2>
                    <p>В статье разобраны базовые принципы квантования лазерных пучков в разных конфигурациях а также их синергии с нагретой плазмой</p>
                </li>
                <li class="item_article">
                    <h2>Квантование лазерных пучков и их синергетика с квантами нагретой плазмы</h2>
                    <p>В статье разобраны базовые принципы квантования лазерных пучков в разных конфигурациях а также их синергии с нагретой плазмой</p>
                </li>
                <li class="item_article">
                    <h2>Квантование лазерных пучков и их синергетика с квантами нагретой плазмы</h2>
                    <p>В статье разобраны базовые принципы квантования лазерных пучков в разных конфигурациях а также их синергии с нагретой плазмой</p>
                </li>
                <li class="item_article">
                    <h2>Квантование лазерных пучков и их синергетика с квантами нагретой плазмы</h2>
                    <p>В статье разобраны базовые принципы квантования лазерных пучков в разных конфигурациях а также их синергии с нагретой плазмой</p>
                </li>
                <li class="item_article">
                    <h2>Квантование лазерных пучков и их синергетика с квантами нагретой плазмы</h2>
                    <p>В статье разобраны базовые принципы квантования лазерных пучков в разных конфигурациях а также их синергии с нагретой плазмой</p>
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

export default Articles;
