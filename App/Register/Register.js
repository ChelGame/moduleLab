import HTMLEditor from "/App/utils/HTMLEditor.js";
import Message from "/App/utils/Message.js";
// добавить вывод
class Register {
    constructor(App) {
        this.app = App;
        this.self = document.createElement("div");
        this.self.classList.add("Register_component");
        this.html = `
        <section class="auth_container">
            <form class="auth" >
                <input class="auth_login" type="text" name="login" value="" placeholder="Логин">
                <input class="auth_password" type="password" name="password" value="" placeholder="Пароль">
                <input class="auth_password" type="password" name="repassword" value="" placeholder="Повторить пароль">
                <input class="auth_submit" type="submit" name="submit" value="Зарегистрироваться">
                <div id="recaptcha"></div>
            </form>
        </section>
        `;
        this.editor = new HTMLEditor(this.html);
        this.message = new Message();

        this.ComponentStart();
    }

    ComponentStart() {
        this.setState(this.getState());
        this.checkAuth();

        this.components = this.editor.HTMLParser();
        this.editor.HTMLPrinter(this.self);
        this.setRegisterEvents();
    }

    checkAccess() {
        // Мы должны быть не авторизованы
        if (this.state.auth) {
            this.message.printMessage("Вы уже вошли в систему");
            return false;
        }
        return true;
    }

    getContent() {
        this.renderCaptcha();
        return this.self;
    }

    async renderCaptcha() {
        let t = setInterval(() => {
            if (grecaptcha.render) {
                grecaptcha.render("recaptcha", {
                  'sitekey' : '6LfEDBEmAAAAAOYcCe0fmKhwnA6E7vpoSjdEkrnV'
                });
                clearInterval(t);
            }
        }, 10);
    }

    setRegisterEvents() {
        this.self.querySelector(".auth").addEventListener("submit", (event) => {
            event.preventDefault();
            this.registration();
        });
    }

    async registration() {

        const login = this.editor.findElementByParameter('[name="login"]').self.value;
        const password = this.editor.findElementByParameter('[name="password"]').self.value;
        const repassword = this.editor.findElementByParameter('[name="repassword"]').self.value;
        const captcha = (grecaptcha.getResponse()) ? true : false;

        if (!login || !password || !repassword) {
            const message = "Пропущен логин или пароли";
            this.message.printMessage(message, 10000);
            return false;
        }

        if (password !== repassword) {
            const message = "Пароли не совпадают";
            this.message.printMessage(message, 10000);
            return false;
        }

        if (!captcha) {
            const message = "Вы не прошли капчу";
            this.message.printMessage(message, 10000);
            return false;
        }

        const url = "/App/php/register.php";
        const body = {
            task: 'register',
            login,
            password,
            captcha,
        };
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body),
        });

        // let result = await response.text();
        let result = await response.json();
        if (!result.status) {
            this.message.printMessage(result.message || "Что-то пошло не так");
            return;
        }
        this.message.printMessage("Вы успешно зарегистрировались. Теперь вы можете авторизоваться", 10000);
        this.app.setState({url: '/auth'});
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

////////////////////////////////////////////////////////////////////
}



export default Register;
