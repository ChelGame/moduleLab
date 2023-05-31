import HTMLEditor from "/App/utils/HTMLEditor.js";
import Message from "/App/utils/Message.js";

class ViewArticle {
    constructor(articles, id) {
        this.articles = articles;
        this.id = id;
        this.self = document.createElement("div");
        this.self.classList.add("ViewArticles_component");
        this.html = `
        <section class="article_container">
            <h2 class="article_header"></h2>
            <p class="article_description"></p>
            <div class="articleText_container">
                <a href="" class="article_author"></a>
            </div>
        </section>
        `;
        this.editor = new HTMLEditor(this.html);
        this.message = new Message();
        this.article = null;

        this.ComponentStart();
    }

    ComponentStart() {
        this.setState(this.getState());
        this.checkAuth();

        this.editor.HTMLParser();

        this.getArticle();

        // В HTMLEditor лучше не лезть без особой необходимости. Писал я его давно.
        // Причем так, чтобы не пришлось лезть.
        // В начале файла есть комент с алгоритмом использование
    }

    async getArticle() {
        const data = {
            task: "getArticle",
            id: this.id,
        };
        const url = './App/php/articles.php';

        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });

        let result = await response.json();
        if (result.status) {
            this.article = result.article;
            this.printArticle();
            return result.articles;
        }
        return false;
    }

    printArticle() {
        this.editor.findElementByParameter('.article_header').self.textContent = `${this.article.name}`;

        this.editor.findElementByParameter('.article_description').self.textContent = `${this.article.description}`;

        this.editor.findElementByParameter('.article_author').params.href =  `/articles?author=${this.article.author_id}`;
        this.editor.findElementByParameter('.article_author').self.textContent =  `${this.article.first_name} ${this.article.last_name} ${this.article.surename}`;

        this.editor.HTMLPrinter(this.self);
        console.log(this.article);
    }

    getContent() {
        return this.self;
    }

    render(content) {
        this.self.innerHTML = "";
        this.self.append(content);
    }


    // general state funcs
    async checkAuth() {
        let result = await this.getAuthFromServer();
        this.setAuthToState(result);
    }
    async getAuthFromServer() {
        const data = {
            task: "checkAuth",
            auth: this.state.auth,
        };
        const url = './App/php/auth.php';

        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    }
    // Обобщающий метод, возвращающий состояние из наиболее доверенного источника.
    getState() {
        let initialState = {
            url: "/main",
            auth: false,
        };
        return this.getStateFromStorage() || this.getStateFromHistory() || initialState;
    }
    getStateFromStorage() {
        if (!localStorage.length) return null;
        return JSON.parse(localStorage.getItem("AppState"));
    }
    getStateFromHistory() {
        if (!window.history || !window.history.state) return null;
        return window.history.state["AppState"];
    }

    setAuthToState(result) {
        let state;
        if (result.auth) {
            state = {...this.state, ...result};
        } else {
            state = {...this.state, auth: false};
        }
        this.setState(state);
    }
    setState(state) {
        this.state = {...this.state, ...state};
    }
}

// Если заняться будет нечем, можно будет добавить несколько добавления сотрудников без переброса. (типа как доп кнопкой "Добавить и продолжить добавление")

export default ViewArticle;
