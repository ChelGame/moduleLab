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
<<<<<<< HEAD

=======
>>>>>>> 9b948e8de7ba9e4fb710e6e6f2da2caf82a91f4d
        return this.getStateFromStorage() || this.getStateFromHistory() || initialState;
    }

    getStateFromStorage() {
        if (!localStorage.length) return null;
        return JSON.parse(localStorage.getItem("AppState"));
    }

    getStateFromHistory() {
<<<<<<< HEAD
=======
        if (!window.history || !window.history.state) return null;
>>>>>>> 9b948e8de7ba9e4fb710e6e6f2da2caf82a91f4d
        return window.history.state["AppState"];
    }

    // Подгружает контент страницы
    downloadPage() {
        switch (this.state.url) {
            case "/auth":
                let auth = new Auth();
                this.render(auth.getContent());
                break;
            case "/articles":
                let articles = new Articles();
                this.render(articles.getContent());
                break;
            case "/agents":
                let agents = new Agents();
                this.render(agents.getContent());
                break;
            case "/register":
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
        if (!this.state.auth) {
            let result = this.getAuthFromServer();

            this.setAuthToState(result);
        }
    }

    async getAuthFromServer() {
        const data = {task: "checkAuth",};
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
        if (result['result'] === true) {
            this.state.auth = result['auth'];
            this.leadToRoleMatching();
        } else {
            this.state.auth = false;
        }
        this.setState(this.state);
    }

    leadToRoleMatching() {
        switch (auth['role']) {
            case 'guest':

                break;
            default:

        }
    }

    // Работа с состояниями
    setState(state) {
        if (this.state != this.pastState) {
            this.pastState = this.state;
        }
        this.state = state;

        this.handlerState();
    }

    setStateWithoutHistoryChange(state) {
        if (this.state != this.pastState) {
            this.pastState = this.state;
        }
        this.state = state;

        this.handlerStateWithoutHistoryChange();
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


    listenToHistory(event) {

        this.setStateWithoutHistoryChange(event.target.history.state["AppState"]);
    }

    // "реагирует" на изменение состояния и делает что-то на основе этого изменения
    handlerState() {
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
            historyLink.addEventListener("click", (event) => {
                event.preventDefault();
                const state = {
                    url: event.target.attributes[1].nodeValue,
                }
                this.setState(state);
            });
        });

        window.addEventListener("popstate", (event) => {
            this.listenToHistory(event);
        })
    }

    // Метод под вопросом
    render(content) {
<<<<<<< HEAD
=======
        this.self.innerHTML = "";
>>>>>>> 9b948e8de7ba9e4fb710e6e6f2da2caf82a91f4d
        this.self.append(content);
    }
}

/*
План на день:
    1) Продумать авторизацию

*/

const app = new App();
