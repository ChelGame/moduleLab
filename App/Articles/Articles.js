import HTMLEditor from "/App/utils/HTMLEditor.js";
import AddArticles from "./addArticles/addArticles.js";
import Message from "/App/utils/Message.js";

class Articles {
    constructor(App) {
        this.app = App;
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
                <a class="AddArticle" href="/addArticles" type="button" name="addArticles">Добавить статью</a>
                <div class="emptyLab">Статей пока нет.</div>
            </ul>
        </section>
        `;
        this.card = `
        <li class="item_article">
            <a href="/viewArticle" class="articleLink">
                <h2 class="article_name">Квантование лазерных пучков и их синергетика с квантами нагретой плазмы</h2>
                <p class="article_description">В статье разобраны базовые принципы квантования лазерных пучков в разных конфигурациях а также их синергии с нагретой плазмой</p>
            </a>
        </li>
        `;
        this.selfEditor = new HTMLEditor(this.html);
        this.cardEditor = new HTMLEditor(this.card);
        this.message = new Message();
        this.articles = null;

        this.ComponentStart();
    }

    ComponentStart() {
        this.setState(this.getState());
        this.checkAuth();

        this.selfEditor.HTMLParser();
        this.cardEditor.HTMLParser();

        this.checkURL();

        // В HTMLEditor лучше не лезть без особой необходимости. Писал я его давно.
        // Причем так, чтобы не пришлось лезть.
        // В начале файла есть комент с алгоритмом использование
    }

    checkURL() {

        let url = '/' + this.state.url.split('/')[1].split('?')[0];
        let id = this.state.url.split('/')[1].split('?')[1];
        if (id) {
            id = id.split("=")[1] || null;
        }
        switch (url) {
            case "/addArticles":
                if (!this.state.auth) break;
                if (this.state.auth.role !== "Администратор"
                 && this.state.auth.role !== "Сотрудник") break;
                let addArticles = new AddArticles(this, id);
                this.render(addArticles.getContent());
                return;
            case "/articles":
                this.selfEditor.HTMLPrinter(this.self);
                this.setArticleEvents();

                return;
            case "/viewArticle":
                let viewArticle = new ViewArticle(this, id);
                this.render(viewArticle.getContent());

                return;
            default:
                break;
        }
        this.app.setState({url: "/main"});
    }

    async getArticles() {
        const data = {
            task: "getArticles",
        };
        const url = './App/php/articles.php';

        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });

        let result = await response.json();
        if (result.status) {
            this.articles = result.articles;
            this.printArticles();
            return result.articles;
        }
        return false;
    }
    printArticles() {
        this.selfEditor.findElementByParameter(".emptyLab").self.hidden = true;

        this.articles.forEach((item, i) => {
            this.cardEditor.reset(this.card);
            this.cardEditor.HTMLParser();

            this.cardEditor.findElementByParameter('h2').self.textContent = `
                ${item.name}
            `;
            this.cardEditor.findElementByParameter('.article_description').self.textContent = `
                ${item.description}
            `;

            this.cardEditor.findElementByParameter('.articleLink').params.href +=`?id=${item.article_id}`;
            this.cardEditor.findElementByParameter('.articleLink').self.addEventListener("click", (event) => {
                event.preventDefault();
                for (let i = 0; i < event.path.length; i++) {
                    if (event.path[i].tagName === "A") {
                        console.log(event.path[i].href);
                        return;
                    }
                }

            });

            this.cardEditor.HTMLPrinter(this.selfEditor.findElementByParameter(".list_article").self);
        });
    }

    setArticleEvents() {
        if (this.state.auth.role === "Администратор"
        ||  this.state.auth.role === "Сотрудник") {
            this.selfEditor.findElementByParameter('[name=addArticles]').self.addEventListener("click", () => {
                event.preventDefault();
                this.app.setState({url: event.target.attributes[1].nodeValue});
            });
        } else {
            this.selfEditor.findElementByParameter('[name=add]').self.hidden = true;
        }

        this.getArticles();
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

export default Articles;
