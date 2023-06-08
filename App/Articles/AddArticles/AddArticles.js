import HTMLEditor from "/App/utils/HTMLEditor.js";
import Message from "/App/utils/Message.js";

    //

class AddArticles {
    constructor(parent, id = null) {
        this.articles = parent;
        this.id = id;
        this.self = document.createElement("div");
        this.self.classList.add("AddArticles_component");
        this.html = `
        <section class="add_container">
            <label>
                Название статьи: <input name="name" type="text" placeholder="Как происходит распад квантов">
            </label>
            <label>
                Описание: <textarea name="description" rows="8" cols="80"></textarea>
            </label>
            <label>
                файл статьи:
                <input type="file" accept=".pdf">
            </label>
            <button type="submit" name="submit">Добавить статью</button>
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
        this.setAddEvent();
    }

    checkAccess() {
        // Мы должны быть авторизованы в роли администратора или сотрудника
        if (!this.state.auth) {
            this.message.printMessage("Вы не вошли в систему");
            return false;
        }
        if (this.state.auth.role !== "Администратор"
         && this.state.auth.role !== "Сотрудник") {
            this.message.printMessage("У вас нет доступа к этой странице. Пожалуйста, перестаньте копаться в коде и искать обходные пути");
            return false;
        }
        return true;
    }

    setAddEvent() {
        let submitBut = this.editor.findElementByParameter('[name="submit"]');
        submitBut.self.addEventListener("click", (event) => {
            event.preventDefault();
            this.addArticle();
        });
    }
    async addArticle() {
        const formData = new FormData();
        const fileField = this.self.querySelector('input[type="file"]');
        const name = this.self.querySelector('[name="name"]').value;
        const description = this.self.querySelector('[name="description"]').value;
        if (!name.trim()) {
            this.message.printMessage("Заполните все поля");
            return;
        }
        if (!description.trim()) {
            this.message.printMessage("Заполните все поля");
            return;
        }
        if (!fileField.files[0]) {
            this.message.printMessage("Заполните все поля");
            return;
        }
        if (fileField.files[0].size > 104857600) {
            this.message.printMessage("Файл слишком велик");
            return;
        }
        formData.append('name', name);
        formData.append('author_id', this.state.auth.id);
        formData.append('task', 'AddArticle');
        formData.append('description', description);
        formData.append('file', fileField.files[0], fileField.files[0].name);


        const url = './App/php/articles.php';
        let response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        let result = await response.json();
        if (result && result.status) {
            let message = result.message || "Статья добавлена";
            this.message.printMessage(message);
            return;
        } else {
            let message = result.message || "Статью не удалось добавить. Видимо произошла какая то ошибка";
            this.message.printMessage(message);
            return;
        }
    }

    getContent() {
        // Если не вошли (хз как, но на всякий) Продумать!
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
}

export default AddArticles;
