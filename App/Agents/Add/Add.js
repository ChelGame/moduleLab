import HTMLEditor from "/App/utils/HTMLEditor.js";
import Message from "/App/utils/Message.js";

    //

class Add {
    constructor(parent, id = null) {
        this.agents = parent;
        this.id = id;
        this.self = document.createElement("div");
        this.self.classList.add("Add_component");
        this.html = `
        <section class="add_container">
            <label>
                ФИО: <input name="full-name" type="text" placeholder="Иванов Иван Иванович">
                <div class="agint_desc">
                    <p class="help">Указывать в порядке Фамилия Имя Отчество</p>
                </div>
            </label>
            <label>
                Дата рождения: <input name="born" type="date">
            </label>
            <label>
                Пол:
                <select id="gender" name="gender">
                    <option value="М" selected>М</option>
                    <option value="Ж">Ж</option>
                </select>
            </label>
            <label>
                Семейное положение:
                <input name="family-status" type="text">
                <div class="agint_desc">
                    <p class="help">Ваш пол учтется. Выберите подходящее вам не обращая внимание на пол.</p>
                </div>
            </label>
            <label>
                Дети:
                <input min="0" name="childs" type="number" placeholder="4">
            </label>
            <label>
                Должность:
                <select name="post">
                </select>
            </label>
            <label>
                Академическая степень:
                <input type="text" name="academic_degree">
                <div class="agint_desc">
                    <p class="help">Если у вас несколько степеней, укажите все через запятую</p>
                </div>
            </label>
            <label>
                Направление:
                <select name="discipline">
                </select>
            </label>
            <label>
                Логин:
                <input name="login">
                <div class="agint_desc">
                    <p class="help">Если не нужно ничего менять, просто пропустите это поле</p>
                </div>
            </label>
            <label>
                Пароль:
                <input name="password">
                <div class="agint_desc">
                    <p class="help">Если не нужно ничего менять, просто пропустите это поле</p>
                </div>
            </label>
            <button type="submit" name="submit">Изменить данные</button>
        </section>
        `;
        this.editor = new HTMLEditor(this.html);
        this.message = new Message();

        this.ComponentStart();
    }

    ComponentStart() {
        this.setState(this.getState());
        this.checkAuth();
        this.getPostAndDisciplineData();

        this.components = this.editor.HTMLParser();
        this.editor.HTMLPrinter(this.self);
        this.setAddEvent();
    }

    async getAgent() {
        if (!this.id) return;
        const data = {
            task: "getAgentInform",
            id: this.id,
        };
        const url = './App/php/agents.php';

        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        });

        let result = await response.json();
        if (result.status) {
            this.agent = result.agent[0];
        }
        this.printAgent();

        return this.agent;
    }

    printAgent() {
        // ФИО
        let name = `${this.agent.first_name} ${this.agent.last_name} ${this.agent.surename}`;
        this.editor.findElementByParameter('[name="full-name"]').self.value = name;

        // Дата рождения
        let date = new Date(this.agent.born_date).toLocaleDateString("fr-CA");
        this.editor.findElementByParameter('[name="born"]').self.value = date;

        // Пол
        this.editor.findElementByParameter(`[value="${this.agent.gender}"]`).self.selected = true;

        // Семейный статус
        this.editor.findElementByParameter('[name="family-status"]').self.value = `${this.agent.family_status}`.trim();

        // Дети
        this.editor.findElementByParameter('[name="childs"]').self.value = this.agent.childs;

        // Должность
        let postCon = this.editor.findElementByParameter(`[name="post"]`).self;
        postCon.querySelector(`[value="${this.agent.post}"]`).selected = true;

        // Академическая степень
        this.editor.findElementByParameter('[name="academic_degree"]').self.value = `${this.agent.academic_degree}`.trim();

        // Направление
        let disCon = this.editor.findElementByParameter(`[name="discipline"]`).self;
        disCon.querySelector(`[value="${this.agent.discipline_id}"]`).selected = true;

    }
    addOrUpdateAgentData() {
        if (this.id) {
            this.updateAgent();
        } else {
            this.addAgent();
        }
    }

    checkData() {
        let data = {};

        // ФИО
        if (!this.editor.findElementByParameter('[name="full-name"]').self.value) return false;
        let nameCon = this.editor.findElementByParameter('[name="full-name"]').self
        data.first_name = nameCon.value.split(" ")[0];
        data.last_name  = nameCon.value.split(" ")[1];
        data.surename   = nameCon.value.split(" ")[2];
        if (!data.first_name || !data.last_name || !data.surename) return false;

        // Дата рождения
        if (!this.editor.findElementByParameter('[name="born"]').self.value) return false;
        data.born_date = this.editor.findElementByParameter('[name="born"]').self.value;

        // Пол
        let genderCon = this.editor.findElementByParameter(`[name="gender"]`).self;
        data.gender = genderCon.options[genderCon.selectedIndex].value;

        // Семейный статус
        if (!this.editor.findElementByParameter('[name="family-status"]').self.value) return false;
        data.family_status = this.editor.findElementByParameter('[name="family-status"]').self.value;

        // Дети
        if (!this.editor.findElementByParameter('[name="childs"]').self.value) return false;
        if (this.editor.findElementByParameter('[name="childs"]').self.value < 0) return false;
        data.childs = this.editor.findElementByParameter('[name="childs"]').self.value;

        // Должность
        let postCon = this.editor.findElementByParameter(`[name="post"]`).self;
        data.post = postCon.options[postCon.selectedIndex].value;

        // Академическая степень
        if (!this.editor.findElementByParameter('[name="academic_degree"]').self.value) return false;
        data.academic_degree = this.editor.findElementByParameter('[name="academic_degree"]').self.value;

        // Направление
        let disCon = this.editor.findElementByParameter(`[name="discipline"]`).self;
        data.discipline_id = disCon.options[disCon.selectedIndex].value;

        // Пароль и логин не менять, если они не указаны
        // Логин
        data.login = this.editor.findElementByParameter('[name="login"]').self.value;
        // Пароль
        data.password = this.editor.findElementByParameter('[name="password"]').self.value;

        return data;
    }

    async addAgent() {
        let result = this.checkData();
        if (!result || !result["login"].trim() || !result["password"].trim()) {
            this.message.printMessage("Заполните все поля");
            return false;
        }

        const data = {
            task: "addAgent",
            ...result,
        };
        const url = './App/php/Add.php';

        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        });

        result = await response.json();
        if (!result.status) {
            let message = result.message || "Добавить сотрудника не удалось";
            this.message.printMessage(message);
            return false;
        }
        this.message.printMessage("Добавление прошло успешно");
    }
    async updateAgent() {
        let result = this.checkData();

        if (!result) {
            this.message.printMessage("Заполните все поля");
            return false;
        }

        const data = {
            task: "updateAgent",
            ...result,
            user_id: this.id
        };
        const url = './App/php/Add.php';

        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        });

        result = await response.json();
        if (!result.status) {
            let message = result.message || "Обновить данные сотрудника не удалось";
            this.message.printMessage(message);
            return false;
        }
        this.message.printMessage("Обновление прошло успешно");
        // может, стоит перекидывать на страницу с сотрудниками, подумать
    }

    async getPostAndDisciplineData() {
        const data = {
            task: "getPostAndDisciplineData",
        };
        const url = './App/php/agents.php';

        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        });

        let result = await response.json();
        if (result.status) {
            this.posts = result.posts;
            this.disciplines = result.discipline;
            this.setFormData();
        } else {
            this.message.printMessage("Что-то пошло не так, попробуйте перезагрузить страницу");
        }
    }

    setAddEvent() {
        let submitBut = this.editor.findElementByParameter('[name="submit"]');
        if (this.id) {
            submitBut.self.textContent = "Изменить данные";
        } else {
            submitBut.self.textContent = "Добавить сотрудника";
        }
        submitBut.self.addEventListener("click", (event) => {
            event.preventDefault();
            this.addOrUpdateAgentData();
        });
    }

    setFormData() {
        let postCon = this.editor.findElementByParameter(`[name="post"]`).self;
        let disciplineCon = this.editor.findElementByParameter(`[name="discipline"]`).self;

        this.posts.forEach((post, i) => {
            let opt = document.createElement("option");
            opt.value = post.id;
            opt.textContent = post.name;
            postCon.append(opt);
        });
        this.disciplines.forEach((discipline, i) => {
            let opt = document.createElement("option");
            opt.value = discipline.id;
            opt.textContent = discipline.name;
            disciplineCon.append(opt);
        });
        this.getAgent();
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

export default Add;
