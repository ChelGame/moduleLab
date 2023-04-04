import Auth from "./Auth/Auth.js";
import Main from "./Main/Main.js";

// временно
import tableHandler from "./tableHandler.js";
import authHandler from "./authHandler.js";

class Component {
    constructor() {
        this.self = this;
        this.elem = document.querySelector("main");
        this.Auth = new Auth();
        this.Main = new Main();

        this.settebleEvents = []; //
        this.start();
    }

    start() {
        this.setState(this.getStorageState()); // получаем последнее состояние приложения из хранилища
        this.changePage(); // подгружаем контент
        this.setLinkEvents();
        this.setUrlEvents();
    }

    setState(state) {
        this.state = state;
        this.setStoreageState();
    }

    setStoreageState() {
        localStorage.state = JSON.stringify(this.state);
    }

    getStorageState() {
        let state = this.state;
        if (localStorage.length && localStorage.state != "null") state = JSON.parse( localStorage.state );
        return state;
    }

    async changePage() {
        let url = this.state.target;
        let html;
        switch (url) {
            case "auth":
                html = this.Auth.elem;
                break;
            default:
                html = this.Main.elem;
        }

        this.elem.innerHTML = html;
        this.setEvents();
    }

    changeUrl() {
        window.history.pushState(this.state, "Module Laboratory", window.location.url);
    }

    setLinkEvents() {
        document.querySelectorAll('[data-link="true"]').forEach((item, i) => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                this.setState(
                    {
                        href: e.target.href.split("/").at(-1),
                        target: e.target.href.split("/").at(-1).split('.')[0],
                        auth: this.state.auth,
                    }
                );
                this.changePage();
                this.changeUrl();
            });
        });
    }

    setUrlEvents() {
        window.addEventListener("popstate", () => {
            this.setState(window.history.state);
            this.changePage();
        });
    }

    setEvents() {
        switch (this.state.target) {
            case "main":
                document.querySelector('table').addEventListener("click", tableHandler);
                break;
            case "auth":
                document.querySelector('form').addEventListener("submit", authHandler);
                document.querySelector('form').addEventListener("reset", authHandler);
                break;
            default:
                return ;
        }
    }
}

export default Component;
