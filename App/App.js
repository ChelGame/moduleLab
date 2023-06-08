import Articles from "./Articles/Articles.js";
import Register from "./Register/Register.js";
import Agents   from "./Agents/Agents.js";
import Main     from "./Main/Main.js";
import Auth     from "./Auth/Auth.js";

class App {
    constructor() {
        this.state = {} // Текущее состояние
        this.pastState = {} // Предыдущее состояние
        this.self = document.querySelector("main"); // Контейнер

        this.AppStart(); // Запуск приложения
    }

    /* МЕТОДЫ */

    /* Запуск приложения */
    AppStart() {
        this.setStateWithoutHistoryChange(this.getState());
        this.checkAuth();
        this.setAppEvents();
    }

    /* Содержание компонентов */
    downloadPage() {
        try {
            let url = this.state.url.split('?')[0];
            let component;

            switch (url) {
                case "/add":
                case "/agents":
                    component = new Agents(this);
                    if (!component.checkAccess()) break;
                    this.render(component.getContent());
                    return;

                case "/articles":
                case "/addArticles":
                    component = new Articles(this);
                    this.render(component.getContent());
                    return;

                case "/auth":
                    component = new Auth(this);
                    if (!component.checkAccess()) break;
                    this.render(component.getContent());
                    return;

                case "/register":
                    component = new Register(this);
                    if (!component.checkAccess()) break;
                    this.render(component.getContent());
                    return;

                default:
                    component = new Main();
                    this.render(component.getContent());
                    return;
            }
            this.setState({url: "/main"});
        } catch (e) {
            console.log(e);
            this.setState({url: "/main"});
        }
    }
    render(content) {
        this.self.innerHTML = "";
        this.self.append(content);
    }

    /* Контроль */
    getState() {
        // Обобщающий метод, возвращающий состояние из наиболее доверенного источника.
        let initialState = {
            url: "/main",
            auth: false,
        };
        return this.getStateFromStorage() || this.getStateFromHistory() || initialState;
    }
    getStateFromStorage() {
        // Возвращает состояние из локального хранилища
        if (!localStorage.length || !localStorage.AppState) return null;
        return JSON.parse(localStorage.getItem("AppState"));
    }
    getStateFromHistory() {
        // Возвращает состояние из истории
        if (!window.history || !window.history.state) return null;
        return window.history.state["AppState"];
    }
    setState(state) {
        if (this.state != this.pastState) {
            this.pastState = this.state;
        }
        this.state = {...this.state, ...state};

        this.handlerState();
        this.leadToRoleMatching();
    }
    setStateToHistory() {
        window.history.pushState({"AppState": this.state}, document.title, this.state.url);
    }
    setStateToStorage() {
        localStorage.setItem("AppState", JSON.stringify(this.state));
    }
    handlerState() {
        this.setStateToHistory();
        this.setStateToStorage();

        this.downloadPage();
        // if (this.state.url !== this.pastState.url) this.downloadPage();
    }
    /* Навигация */
    leadToRoleMatching() {
        // Скрытие ссылок
        document.querySelectorAll("[data-historyLink]").forEach((historyLink) => {
            switch (historyLink.attributes['href'].nodeValue) {

                case '/exit':
                    if (this.state.auth) historyLink.parentNode.hidden = false;
                    else historyLink.parentNode.hidden = true;
                    break;

                case '/auth':
                    if (this.state.auth) historyLink.parentNode.hidden = true;
                    else historyLink.parentNode.hidden = false;
                    break;

                case '/register':
                    if (this.state.auth) historyLink.parentNode.hidden = true;
                    else historyLink.parentNode.hidden = false;
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
    /* Задание начального состояния */
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
    setAuthToState(result) {
        let state;
        if (result.auth) {
            state = {...this.state, ...result};
        } else {
            state = {...this.state, auth: false};
        }
        this.setState(state);
    }
    setStateWithoutHistoryChange(state) {
        if (this.state != this.pastState) {
            this.pastState = this.state;
        }
        this.state = {...this.state, ...state};

        this.handlerStateWithoutHistoryChange();
        this.leadToRoleMatching();
    }
    setStateToHistoryWithoutHistoryChange() {
        window.history.replaceState({"AppState": this.state}, document.title, this.state.url);
    }
    handlerStateWithoutHistoryChange() {
        if (this.state == this.pastState) return;

        this.setStateToStorage();
        this.setStateToHistoryWithoutHistoryChange();

        if (this.state.url !== this.pastState.url) this.downloadPage();
    }
    listenToHistory(event) {
        this.setStateWithoutHistoryChange(event.target.history.state["AppState"]);
    }
    setAppEvents() {
        // Это происходит при клике на объект со свойством data-historyLink (аля ссылку в шапке или подвале)
        document.querySelectorAll("[data-historyLink]").forEach((historyLink) => {
            historyLink.addEventListener("click", (event) => {
                event.preventDefault();
                if (event.currentTarget.attributes[1].nodeValue !== "/exit") {
                    const state = {
                        url: event.currentTarget.attributes['href'].nodeValue,
                    }
                    this.setState(state);
                } else {
                    this.exit();
                }
            });
        });

        // Отслеживаем откаты истории
        window.addEventListener("popstate", (event) => {
            this.listenToHistory(event);
        })
    }
    /* Промежуточные функции */
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
}


const app = new App();
