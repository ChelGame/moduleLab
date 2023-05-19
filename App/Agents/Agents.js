import HTMLEditor from "/App/utils/HTMLEditor.js";

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

*/

class Agents {
    constructor() {
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
            <a href="/add" type="button" name="change">Изменить данные</a>
        </li>
        `;
        this.selfEditor = new HTMLEditor(this.html);
        this.cardEditor = new HTMLEditor(this.card);
        this.agents = null;

        this.ComponentStart();
    }

    ComponentStart() {
        // В HTMLEditor лучше не лезть без особой необходимости. Писал я его давно.
        // Причем так, чтобы не пришлось лезть.
        // В начале файла есть комент с алгоритмом использование
        this.selfEditor.HTMLParser();
        this.cardEditor.HTMLParser();
        this.checkURL();
    }

    checkURL() {
        let url = '/' + app.state.url.split('/')[1].split('?')[0];
        switch (url) {
            case "/add":

                break;
            case "/agents":
                this.selfEditor.HTMLPrinter(this.self);
                this.setAgentsEvents();

                break;
            default:

        }
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

    setAgentsEvents() {
        this.selfEditor.findElementByParameter('[name=add]').self.addEventListener("click", () => {
            event.preventDefault();
            app.setState({url: event.target.attributes[1].nodeValue});
        });

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
            console.log(app.getAuth());
            if (app.getAuth() && (app.state.auth != "Гость" && app.state.auth != "Сотрудник")) {
                this.cardEditor.findElementByParameter('[name="change"]').self.href +=`?id=${item.user_id}`;
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
}

// Если заняться будет нечем, можно будет добавить несколько добавления сотрудников без переброса. (типа как доп кнопкой "Добавить и продолжить добавление")

export default Agents;
