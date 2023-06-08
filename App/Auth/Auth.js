import HTMLEditor from "/App/utils/HTMLEditor.js";
import Message from "/App/utils/Message.js";

class Auth {
    constructor(App) {
        this.app = App;
        this.self = document.createElement("div");
        this.self.classList.add("Auth_component");
        this.html = `
        <section class="auth_container">
            <form class="auth" method="post" action="/App/php/register.php">
                <input class="auth_login" type="text" name="login" value="" placeholder="Логин">
                <input class="auth_password" type="password" name="password" value="" placeholder="Пароль">
                <input class="auth_submit" type="submit" name="submit" value="Войти">
                <input class="auth_reset" type="reset" name="reset_b" value="сбросить">
            </form>
        </section>
        `;
        this.editor = new HTMLEditor(this.html);
        this.message = new Message();
        this.submit = false;

        this.ComponentStart();
    }

    ComponentStart() {
        this.setState(this.getState());
        this.checkAuth();

        this.components = this.editor.HTMLParser();
        this.editor.HTMLPrinter(this.self);
        this.setAuthEvent();
    }
    checkAccess() {
        // Мы должны быть не авторизованы
        if (this.state.auth) {
            this.message.printMessage("Вы уже вошли в систему");
            return false;
        }
        return true;
    }

    setAuthEvent() {
        this.self.querySelector(".auth").addEventListener("submit", async (event) => {
            event.preventDefault();
            if (!this.submit) this.submit = true;
            else return false;

            await this.authentification();
            this.submit = false;
        });
    }

    async authentification() {
        const login = this.editor.findElementByParameter('[name="login"]').self.value;
        const password = this.editor.findElementByParameter('[name="password"]').self.value;

        if (!login || !password) {
            const message = "Пропущен логин или пароль";
            this.message.printMessage(message, 10000);
            return false;
        }

        const url = "/App/php/auth.php";
        const body = {
            login,
            password,
            task: "auth",
        };
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body),
        });

        let result = await response.json();
        if (result.auth) {
            this.authorization(result);
            return true;
        } else {
            this.message.printMessage("Проверьте правильность введенных данных");
            return false;
        }
    }

    authorization(data) {
        this.message.printMessage("Вы вошли в систему. Ваша роль - " +  data.auth.role);
        this.app.setAuthToState({url: "/main", ...data});
    }
    getContent() {
        return this.self;
    }

    // general state funcs
    async checkAuth() {
        if (this.state.auth) {
            let result = await this.getAuthFromServer();
            this.setAuthToState(result);
        }
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



export default Auth;
