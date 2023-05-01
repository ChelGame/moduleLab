import HTMLEditor from "/App/utils/HTMLEditor.js";

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
            </form>
        </section>

        <section class="popUp_container disnone message">
            <aside class="popUp">
                <h2></h2>
            </aside>
        </section>

        `;
        this.editor = new HTMLEditor(this.html);

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
        return this.self;
    }

    setRegisterEvents() {
        this.self.querySelector(".auth").addEventListener("submit", (event) => {
            event.preventDefault();

            let login = this.self.querySelector("[name=login]").value;
            let password = this.self.querySelector("[name=password]").value;
            let repassword = this.self.querySelector("[name=repassword]").value;

            if (password !== repassword) {
                this.showMessage("Пароли не совпадают");
            }
        });
    }

    showMessage(message) {
        let messageCon = this.self.querySelector(".popUp h2");
        let popUp = this.self.querySelector(".popUp_container");

        messageCon.textContent = message;
        popUp.classList.remove("disnone");
    }
}



export default Register;
