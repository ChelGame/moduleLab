import Articles from "./Articles/Articles.js";
import Register from "./Register/Register.js";
import Agents   from "./Agents/Agents.js";
import Main     from "./Main/Main.js";
import Auth     from "./Auth/Auth.js";

class App {
    constructor() {
        this.state = {}
        this.pastState = {}
        this.self = document.querySelector("main");

        this.AppStart();
    }
    // Не забыть добавить блок кнопкам, пока не обработано обращение
    // Сегодня рефакторим код.
    // Нам нужно сделать методы обращений к бд статичными. Перевести приложение в сокрытый режим.

    AppStart() {
        this.setStateWithoutHistoryChange(this.getState());
        this.checkAuth();
        this.setAppEvents();
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

    // Подгружает контент страницы
    downloadPage() {
        try {
            let url = '/' + this.state.url.split('/')[1].split('?')[0];
            switch (url) {
                case "/add":
                    if (!this.state.auth) break;
                    if (this.state.auth.role === "Сотрудник") break;
                    if (this.state.auth.role === "Гость") break;
                    if (this.state.auth.role === "Профком") break;

                    let add = new Agents(this);
                    this.render(add.getContent());
                    return;
                case "/auth":
                    if (this.state.auth) break;

                    let auth = new Auth(this);
                    this.render(auth.getContent());
                    return;
                case "/articles":
                    let articles = new Articles();
                    this.render(articles.getContent());
                    return;
                case "/agents":
                    if (!this.state.auth) break;
                    if (this.state.auth.role === "Сотрудник") break;
                    if (this.state.auth.role === "Гость") break;

                    let agents = new Agents(this);
                    this.render(agents.getContent());
                    return;
                case "/register":
                    if (this.state.auth) break;

                    let register = new Register(this);
                    this.render(register.getContent());
                    return;
                default:
                    let main = new Main();
                    this.render(main.getContent());
                    return;
            }
            this.setState({url: "/main"});
        } catch (e) {
            console.log(e);
            this.setState({url: "/main"});
        }
    }

    // Работа со входом
    async checkAuth() {
        let result = await this.getAuthFromServer();
        this.setAuthToState(result);
    }
    async getAuthFromServer() {
        const data = {
            task: "checkAuth",
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

    // getAuth() {
    //     let result;
    //     if (this.state.auth) {
    //         result = this.getAuthFromServer();
    //     }
    //     return (result) ? true: false;
    // }


    setAuthToState(result) {
        let state;
        if (result.auth) {
            state = {...this.state, ...result};
        } else {
            state = {...this.state, auth: false};
        }
        this.setState(state);
    }

    leadToRoleMatching() {
        // Скрытие ссылок
        document.querySelectorAll("[data-historyLink]").forEach((historyLink) => {
            switch (historyLink.attributes[1].nodeValue) {
                case '/exit':
                    // Скрываем ссылку
                    if (this.state.auth) {
                        historyLink.parentNode.hidden = false;
                    } else {
                        historyLink.parentNode.hidden = true;
                    }
                    // Вешаем обработку выхода
                    historyLink.addEventListener("click", (event) => {
                        this.exit();
                    });

                    break;
                case '/auth':
                    if (this.state.auth) {
                        historyLink.parentNode.hidden = true;
                    } else {
                        historyLink.parentNode.hidden = false;
                    }
                    break;
                case '/register':
                    if (this.state.auth) {
                        historyLink.parentNode.hidden = true;
                    } else {
                        historyLink.parentNode.hidden = false;
                    }
                    break;
                case '/agents':
                    if (this.state.auth &&
                        this.state.auth.role !== "Сотрудник" &&
                        this.state.auth.role !== "Гость") {
                        historyLink.parentNode.hidden = false;
                    } else {
                        historyLink.parentNode.hidden = true;
                    }
                    break;
                default:
                    return;
            };
        });
    }

    // Работа с состояниями
    setState(state) {
        if (this.state != this.pastState) {
            this.pastState = this.state;
        }
        this.state = {...this.state, ...state};

        this.handlerState();
        this.leadToRoleMatching();
    }
    setStateWithoutHistoryChange(state) {
        if (this.state != this.pastState) {
            this.pastState = this.state;
        }
        this.state = {...this.state, ...state};

        this.handlerStateWithoutHistoryChange();
        this.leadToRoleMatching();
    }

    setStateToHistory() {

        window.history.pushState({"AppState": this.state}, document.title, this.state.url);
    }
    setStateToHistoryWithoutHistoryChange() {

        window.history.replaceState({"AppState": this.state}, document.title, this.state.url);
    }

    setStateToStorage() {
        localStorage.setItem("AppState", JSON.stringify(this.state));
    }

    // "реагирует" на изменение состояния и делает что-то на основе этого изменения
    handlerState() {
        // Чтобы лишний раз не рендерить.
        // Если что-то не отрисовалось - первым делом смотреть сюда.
        if (this.state == this.pastState) return;

        this.setStateToHistory();
        this.setStateToStorage();

        if (this.state.url !== this.pastState.url) this.downloadPage();
    }
    handlerStateWithoutHistoryChange() {
        if (this.state == this.pastState) return;

        this.setStateToStorage();
        this.setStateToHistoryWithoutHistoryChange();

        if (this.state.url !== this.pastState.url) this.downloadPage();
    }

    async exit() {
        const data = {
            task: "exit",
        };
        const url = './App/php/auth.php';

        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        });

        let result = await response.json();
        if (result.status) {
            this.setState({url: "/main"});
            this.checkAuth();
        }
    }
    listenToHistory(event) {

        this.setStateWithoutHistoryChange(event.target.history.state["AppState"]);
    }

    // Устанавливает события приложения
    setAppEvents() {
        // Это происходит при клике на объект со свойством data-historyLink (аля ссылку в шапке или подвале)
        document.querySelectorAll("[data-historyLink]").forEach((historyLink) => {
            // Подгрузка страниц
            historyLink.addEventListener("click", (event) => {
                event.preventDefault();
                if (event.target.attributes[1].nodeValue !== "/exit") {
                    const state = {
                        url: event.target.attributes[1].nodeValue,
                    }
                    this.setState(state);
                }
            });

        });

        window.addEventListener("popstate", (event) => {
            this.listenToHistory(event);
        })
    }

    // Метод под вопросом
    render(content) {
        this.self.innerHTML = "";
        this.self.append(content);
    }
}


const app = new App();
