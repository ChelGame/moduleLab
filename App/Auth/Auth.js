import HTMLEditor from "/App/utils/HTMLEditor.js";
import Message from "/App/utils/Message.js";

// Сегодня
/* 1) Делаем вход
*/

class Auth {
    constructor() {
        this.self = document.createElement("div");
        this.self.classList.add("Auth_component");
        this.html = `
        <section class="auth_container">
            <form class="auth" >
                <input class="auth_login" type="text" name="login" value="" placeholder="Логин">
                <input class="auth_password" type="password" name="password" value="" placeholder="Пароль">
                <input class="auth_submit" type="submit" name="submit" value="Войти">
                <input class="auth_reset" type="reset" name="reset_b" value="сбросить">
            </form>
        </section>

        <section class="popUp_container disnone confirm">
            <aside class="popUp">
                <p>Уверены, что хотите сбросить введенные данные?</p>
                <div class="button_wrap">
                    <button type="button" name="yes">Да</button>
                    <button type="button" name="no">Нет</button>
                </div>
            </aside>
        </section>

        <section class="popUp_container disnone accept">
            <aside class="popUp">
                <h2>Вход выполнен</h2>
            </aside>
        </section>
        <section class="popUp_container disnone no_accept">
            <aside class="popUp" auth="yes">
                <h2 id="auth">Вход не выполнен</h2>
            </aside>
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
        this.setAuthEvent();
    }

    async setAuthEvent() {
        this.self.querySelector(".auth").addEventListener("submit", (event) => {
            event.preventDefault();
            this.authentification();
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
        } else {
            this.message.printMessage("Проверьте правильность введенных данных");
        }
    }

    authorization(data) {
        app.setAuthToState({url: "/main", ...data});
    }

    getContent() {
        return this.self;
    }
}



export default Auth;
