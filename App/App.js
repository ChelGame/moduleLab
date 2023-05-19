import Articles from "./Articles/Articles.js";
import Register from "./Register/Register.js";
import Agents   from "./Agents/Agents.js";
import Main     from "./Main/Main.js";
import Auth     from "./Auth/Auth.js";

class App {
    constructor() {
        window.app = this // для отладки
        this.state = {}
        this.pastState = {}
        this.self = document.querySelector("main");

        this.AppStart();
    }
    // Не забыть добавить блок кнопкам, пока не обработано обращение

    // По поводу входа, надо придумать, в какой момент делать проверку входа.
    /*
    Итак
    Проверку на вход делать в AppStart \|
    Отправлять запрос на сервер только если в состоянии указан вход.\|
    Если в состоянии указан вход, но на сервере он не указан - убирать вход в состоянии\|
    От входа убирать или добавлять ссылку на сотрудников (специфика задачи)
    За остальные активности со входом отвечает компонент Auth
    Когда происходит вход, необходимо поменять AppState в локальном хранилище.
    Также поменять вход на выход
    При выходе сделать запрос на выход и привести приложение в соответсвующий вид.
    Также переместить с запрещенной страницы, если надо.
    По поводу входа в Auth. Возможно, получится реализовать переход путем изменения истории (попробовать)
    Если не прокатит - попробовать создать синтетическое событие и прокинуть его

    */


    Сегодня рефакторим код.
    Нам нужно сделать методы обращений к бд статичными. Перевести приложение в сокрытый режим.

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
        let url = '/' + this.state.url.split('/')[1].split('?')[0];
        switch (url) {
            case "/add":
                if (!this.getAuth()) return;
                if (this.state.auth.role === "Сотрудник") return;

                let add = new Agents();
                this.render(add.getContent());
                break;
            case "/auth":
                if (this.getAuth()) return;
                let auth = new Auth();
                this.render(auth.getContent());
                break;
            case "/articles":
                let articles = new Articles();
                this.render(articles.getContent());
                break;
            case "/agents":
                if (!this.getAuth()) return;
                if (this.state.auth.role === "Сотрудник") return;

                let agents = new Agents();
                this.render(agents.getContent());
                break;
            case "/register":
                if (this.getAuth()) return;
                let register = new Register();
                this.render(register.getContent());
                break;
            default:
                let main = new Main();
                this.render(main.getContent());
        }
    }

    // Работа со входом
    async checkAuth() {

        if (this.state.auth) {
            let result = await this.getAuthFromServer();
            this.setAuthToState(result);
        }
    }

    getAuth() {
        let result;
        if (this.state.auth) {
            result = this.getAuthFromServer();
        }
        return (result) ? true: false;
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
                    if (this.getAuth()) {
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
                    if (this.getAuth()) {
                        historyLink.parentNode.hidden = true;
                    } else {
                        historyLink.parentNode.hidden = false;
                    }
                    break;
                case '/register':
                    if (this.getAuth()) {
                        historyLink.parentNode.hidden = true;
                    } else {
                        historyLink.parentNode.hidden = false;
                    }
                    break;
                case '/main':

                    break;
                case '/agents':
                    if (this.getAuth() &&
                        this.state.auth.role !== "Сотрудник" &&
                        this.state.auth.role !== "Гость") {
                        historyLink.parentNode.hidden = false;
                    } else {
                        historyLink.parentNode.hidden = true;
                    }
                    break;
                case '/articles':

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

    setStateToStorage() {
        localStorage.setItem("AppState", JSON.stringify(this.state));
    }

    setStateToHistory() {
        window.history.pushState({"AppState": this.state}, document.title, this.state.url);
    }

    setStateToHistoryWithoutHistoryChange() {
        window.history.replaceState({"AppState": this.state}, document.title, this.state.url);
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
            this.checkAuth();
        }
    }

    listenToHistory(event) {

        this.setStateWithoutHistoryChange(event.target.history.state["AppState"]);
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
