import HTMLEditor from "/App/utils/HTMLEditor.js";
import Message from "/App/utils/Message.js";

class Register {
    constructor() {
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
        // В HTMLEditor лучше не лезть без особой необходимости. Писал я его давно.
        // Причем так, чтобы не пришлось лезть.
        // В начале файла есть комент с алгоритмом использование
        this.components = this.editor.HTMLParser();
        this.editor.HTMLPrinter(this.self);
        this.setRegisterEvents();
    }

    getContent() {
        this.renderCaptcha();
        return this.self;
    }

    async renderCaptcha() {
        // Лютый костыль, но ничего умней я не придумал
        setTimeout(function () {
            grecaptcha.render("recaptcha", {
              'sitekey' : '6LfEDBEmAAAAAOYcCe0fmKhwnA6E7vpoSjdEkrnV'
            });
        }, 500);
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
        app.setState({url: '/auth'});
    }
}



export default Register;
