import HTMLEditor from "/App/utils/HTMLEditor.js";
import Add from "./Add/Add.js";
import Message from "/App/utils/Message.js";

/*

    1) Сделать 2 эдитора. 1 с самой страницей. 1 с карточкой.
        1.1) При рендере страницы делать запрос о сотрудниках.
            1.1.1) Если сотрудников нет - писать что нет сотрудников.
            1.1.2) Если сотрудники есть
                1.1.2.1) Создаем карточку.
                1.1.2.2) Запоняем ее данными.
                1.1.2.3) Добавляем ее в список, что лежит в другом эдите.
                1.1.2.4) Повторяем для всех сотрудников.

    2) При клике на кнопку добавления создавать объект добавления без параметров.
    3) При клике на изменение создавать объект добавления с параметром id сотрудника
    4) При рендере добавления создавать кнопку назад, которая рендерит сам компонент
        (Думаю, лишний запрос сотрудников делать не стоит)
    5) При после добавления/изменения перебрасывать на страницу с сотрудниками и обновлять данные. (setState)
    6) Возможно понадобится модификация метода рендера страниц т.к. изменение будет происходить в другом компоненте.
        6.1) Если страница не будет рендериться как надо, то заменить полное совпадение на частичное. (через регулярку наверное)


    (Если успеем, добавить сортировку)
*/

class Agents {
    constructor(App) {
        this.app = App;
        this.self = document.createElement("div");
        this.self.classList.add("Agents_component");
        this.html = `
        <section class="agents_container">
            <ul class="list_agents">
                <a class="item_agents" href="/add" type="button" name="add">Добавить сотрудника</a>
                <div class="emptyLab">Лаборатория пуста.</div>
            </ul>
        </section>
        `;
        this.card = `
        <li class="item_agents">
            <p>ФИО: <span class="agent_name"></span></p>
            <p>Дата рождения: <span class="agent_born-date"></span></p>
            <p>Пол: <span class="agent_gender"></span></p>
            <p>Семейное положение: <span class="agent_family-status"></span></p>
            <p>Дети: <span class="agent_childs"></span></p>
            <p>Должность: <span class="agent_post"></span></p>
            <p>Академическая степень: <span class="agent_academic-degree"></span></p>
            <p>Направление: <span class="discipline"></span></p>
            <a href="/add" type="button" name="change">Изменить данные</a>
            <a href="/remove" type="button" name="remove">Удалить сотрудника</a>
        </li>
        `;
        this.remove = `
        <div class="removeCon">
            <div class="remove">
                <h2>Вы уверены, что хотите удалить этого сотрудника?</h2>
                <div class="removeButtonCon">
                    <button type="button" name="remove">Удалить</button>
                    <button type="button" name="cancel">Отмена</button>
                </div>
            </div>
        </div>
        `;
        this.selfEditor = new HTMLEditor(this.html);
        this.cardEditor = new HTMLEditor(this.card);
        this.removeEditor = new HTMLEditor(this.remove);
        this.message = new Message();
        this.agents = null;

        this.ComponentStart();
    }



    ComponentStart() {
        this.setState(this.getState());
        this.checkAuth();

        this.selfEditor.HTMLParser();
        this.cardEditor.HTMLParser();
        this.removeEditor.HTMLParser();

        this.checkURL();
        // В HTMLEditor лучше не лезть без особой необходимости. Писал я его давно.
        // Причем так, чтобы не пришлось лезть.
        // В начале файла есть комент с алгоритмом использование
    }

    checkURL() {

        let url = '/' + this.state.url.split('/')[1].split('?')[0];
        let id = this.state.url.split('/')[1].split('?')[1];
        if (id) {
            id = id.split("=")[1] || null;
        }
        switch (url) {
            case "/add":
                if (!this.state.auth) break;
                if (this.state.auth.role === "Профком") break;

                let add = new Add(this, id);
                this.render(add.getContent());
                return;
            case "/agents":
                this.selfEditor.HTMLPrinter(this.self);
                this.setAgentsEvents();

                return;
            default:
                break;
        }
        // this.setState({url: "/main"});
    }

    async getAgents() {
        const data = {
            task: "getAgents",
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
            this.agents = result.agents;
        }
        this.printAgents();

        return this.agents;
    }
    async removeAgent(e) {
        let user_id = e.target.href.split("?")[1].split("=")[1];
        let remove = this.removeEditor.findElementByParameter('[name="remove"]');
        let cancel = this.removeEditor.findElementByParameter('[name="cancel"]');
        remove.self.addEventListener("click", async () => {
            let data = {
                task: "removeAgent",
                id: user_id,
            };
            let url = './App/php/agents.php';

            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(data)
            });
            let result = await response.json();
            if (result.status) {

                let message = result.message || "Пользователь удален";
                this.message.printMessage(message);
                this.self.querySelectorAll(".item_agents").forEach((item) => {
                    if (item.tagName == "A") {
                        return;
                    } else {
                        this.selfEditor.findElementByParameter('.list_agents').self.removeChild(item);
                    }
                });

                data = {
                    task: "getAgents",
                };
                url = './App/php/agents.php';

                response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(data)
                });

                result = await response.json();
                if (result.status) {
                    this.agents = result.agents;
                }
                this.printAgents();

            } else {

                let message = result["message"] || "Пользователь не был удален";
                this.message.printMessage(message);
            }
            document.querySelector('body').removeChild(this.removeEditor.findElementByParameter(".removeCon").self);

            this.removeEditor.reset(this.remove);
            this.removeEditor.HTMLParser();
        });
        cancel.self.addEventListener("click", async () => {
            document.querySelector('body').removeChild(this.removeEditor.findElementByParameter(".removeCon").self);

            this.removeEditor.reset(this.remove);
            this.removeEditor.HTMLParser();
        });

        this.removeEditor.HTMLPrinter(document.querySelector('body'));
    }
    changeAgent(e) {
        let id = e.target.href.split("?")[1].split("=")[1];
        let url = `/add?id=${id}`;

        this.app.setState({url});
    }

    setAgentsEvents() {
        if (this.state.auth.role !== "Профком") {
            this.selfEditor.findElementByParameter('[name=add]').self.addEventListener("click", () => {
                event.preventDefault();
                this.app.setState({url: event.target.attributes[1].nodeValue});
            });
        } else {
            this.selfEditor.findElementByParameter('[name=add]').self.hidden = true;
        }

        this.getAgents();
    }

    printAgents() {
        this.selfEditor.findElementByParameter(".emptyLab").self.hidden = true;
        this.agents.forEach((item, i) => {
            this.cardEditor.reset(this.card);
            this.cardEditor.HTMLParser();

            this.cardEditor.findElementByParameter('.agent_name').self.textContent = `
                ${item.first_name} ${item.last_name} ${item.surename}
            `;
            this.cardEditor.findElementByParameter('.agent_born-date').self.textContent = `
                ${item.born_date}
            `;
            this.cardEditor.findElementByParameter('.agent_gender').self.textContent = `
                ${item.gender}
            `;
            this.cardEditor.findElementByParameter('.agent_family-status').self.textContent = `
                ${item.family_status}
            `;
            this.cardEditor.findElementByParameter('.agent_childs').self.textContent = `
                ${item.childs}
            `;
            this.cardEditor.findElementByParameter('.agent_post').self.textContent = `
                ${item.post}
            `;
            this.cardEditor.findElementByParameter('.agent_academic-degree').self.textContent = `
                ${item.academic_degree}
            `;
            this.cardEditor.findElementByParameter('.discipline').self.textContent = `
                ${item.discipline}
            `;

            if (this.state.auth.role !== "Профком") {
                this.cardEditor.findElementByParameter('[name="change"]').params.href +=`?id=${item.user_id}`;
                this.cardEditor.findElementByParameter('[name="remove"]').params.href +=`?id=${item.user_id}`;
                this.cardEditor.findElementByParameter('[name="change"]').self.addEventListener("click", (event) => {
                    event.preventDefault();
                    this.changeAgent(event);
                });
                this.cardEditor.findElementByParameter('[name="remove"]').self.addEventListener("click", (event) => {
                    event.preventDefault();
                    this.removeAgent(event);
                });
            } else {
                this.cardEditor.findElementByParameter('[name="change"]').params.class = 'disnone';
                this.cardEditor.findElementByParameter('[name="remove"]').params.class = 'disnone';
            }

            this.cardEditor.HTMLPrinter(this.selfEditor.findElementByParameter(".list_agents").self);
        });
    }

    getContent() {
        return this.self;
    }

    render(content) {
        this.self.innerHTML = "";
        this.self.append(content);
    }


    // general state funcs
    async checkAuth() {
        let result = await this.getAuthFromServer();
        this.setAuthToState(result);
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

// Если заняться будет нечем, можно будет добавить несколько добавления сотрудников без переброса. (типа как доп кнопкой "Добавить и продолжить добавление")

export default Agents;
