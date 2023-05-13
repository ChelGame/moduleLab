import HTMLEditor from "/App/utils/HTMLEditor.js";
import Message from "/App/utils/Message.js";

/* 2) Делаем Регистраию (Только до отправки данных и рекция на них)
    При отправке проверяем данные. Если все есть - "отправляем"
    "Проверяем" результат и если все плохо - говорим об этом.
    Если все хорошо - Перекидываем на авторизацию.
    (пока без капчи)
*/

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
        return this.self;
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

        const url = "Register.php";
        const body = {
            login,
            password,
        };
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body),
        });

        let result = await response.text();
        // let result = await response.json();
        if (!result.status) {
            console.log(app);
            this.message.printMessage("Похоже, пользователь с таким именем уже существует");
        }
    }
}



export default Register;
