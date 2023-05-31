import HTMLEditor from "/App/utils/HTMLEditor.js";
import AddArticles from "./addArticles/addArticles.js";
import ViewArticle from "./ViewArticle/ViewArticle.js";
import Message from "/App/utils/Message.js";

// По улучшению. Можно сделать комбинаторы, чтоб искать по нескольким словам но не одновременно. Типа как или картошка, или огурец, или салат. (+ ~ > < - (sdsda));


class Articles {
    constructor(App) {
        this.app = App;
        this.self = document.createElement("div");
        this.self.classList.add("Articles_component");
        this.self.classList.add("fixed_container");
        this.html = `
        <section class="articles_container fixed_container">
            <nav>
                <form class="search_con">
                    <input class="search_input" type="text" name="searchArticles" value="" placeholder="Название или фраза">
                    <button class="search_button" type="submit" name="searchArticlesButton"></button>
                </form>
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
            <a href="/App/files/articles/" class="articleLink">
                <h2 class="article_name"></h2>
                <p class="article_description"></p>
            </a>
            <div class="grade_con">
                <button class="grade_but" type="Button" name="up">Понравилось</button>
                <span class="grade_count"></span>
                <button class="grade_but" type="Button" name="down">Не понравилось</button>
            </div>
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
        let query = this.state.url.split('/')[1].split('?')[1];
        // let id = this.state.url.split('/')[1].split('?')[1];
        // if (id) {
        //     id = id.split("=")[1] || null;
        // }
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
                if (!query) {
                    this.getArticles();
                } else {
                    this.getArticles(query);
                }

                return;
            // case "/viewArticle":
            //     let viewArticle = new ViewArticle(this, id);
            //     this.render(viewArticle.getContent());

                // return;
            default:
                break;
        }
        this.app.setState({url: "/main"});
    }

    async grade(id, grade, event) {
        if (!this.state.auth) {
            this.message.printMessage("Сначала авторизуйтесь");
            return;
        }
        const data = {
            task: "grade",
            id,
            grade,
        };
        const url = './App/php/articles.php';

        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });

        let result = await response.json();
        if (result.status) {
            let con = this.self.querySelector(`[data-key="${id}"]`);

            con.querySelector('.grade_count').textContent = result.score || 0;

            switch (result.selected) {
                case 'set':
                    event.target.classList.add("grade_selected");
                    break;
                case 'change':
                    con.querySelectorAll('.grade_but').forEach((item) => {
                        item.classList.remove('grade_selected')
                    });
                    event.target.classList.add("grade_selected");

                    break;
                case 'remove':
                    this.self.querySelector(`[data-key="${id}"]`).querySelectorAll('.grade_but').forEach((item) => {
                        item.classList.remove('grade_selected');
                    });
                    break;
                default:

            }
            return;
        }
        this.message.printMessage(result.message || "Что-то пошло не так");
        return false;
    }

    async getArticles(query = null) {
        if (query) {
            query = query.split("=")[1].trim();
        }
        const data = {
            task: "getArticles",
            query,
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
        this.message.printMessage(result.message || "Что-то пошло не так");
        return false;
    }

    printArticles() {
        this.selfEditor.findElementByParameter(".emptyLab").self.hidden = true;

        this.articles.forEach((item, i) => {
            this.cardEditor.reset(this.card);
            this.cardEditor.HTMLParser();
            this.cardEditor.findElementByParameter('h2').self.textContent = `${item.name}`;
            this.cardEditor.findElementByParameter('.item_article').self.dataset.key = `${item.article_id}`;
            this.cardEditor.findElementByParameter('.grade_count').self.textContent = `${item.rate || 0}`;
            if (item.user_rate) {
                switch (item.user_rate) {
                    case '-1':
                        this.cardEditor.findElementByParameter('[name="down"]').params.class += ' grade_selected';
                        break;
                    case '1':
                        this.cardEditor.findElementByParameter('[name="up"]').params.class += ' grade_selected';
                        break;
                    default:

                }
            }
            this.cardEditor.findElementByParameter('.article_description').self.textContent = `${item.description}`;

            this.cardEditor.findElementByParameter('.articleLink').params.href +=`${item.link}`;
            this.cardEditor.findElementByParameter('.articleLink').self.addEventListener("click", (event) => {
                event.preventDefault();
                for (let i = 0; i < event.path.length; i++) {
                    if (event.path[i].tagName === "A") {
                        window.location.assign(event.path[i].attributes["href"].nodeValue);
                        return;
                    }
                }

            });

            this.cardEditor.findElementByParameter('[name="up"]').self.addEventListener("click", (event) => {
                event.preventDefault();
                this.grade(item.article_id, 1, event);
            });
            this.cardEditor.findElementByParameter('[name="down"]').self.addEventListener("click", (event) => {
                event.preventDefault();
                this.grade(item.article_id, -1, event);
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
            this.selfEditor.findElementByParameter('[name=addArticles]').self.hidden = true;
        }

        this.selfEditor.findElementByParameter(".search_con").self.addEventListener("submit", () => {
            event.preventDefault();
            let keyWords = this.selfEditor.findElementByParameter(".search_input").self.value.toLowerCase();
            this.app.setState({url: this.state.url.split("?")[0] + "?search=" + keyWords});
        })
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
