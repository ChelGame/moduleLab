import HTMLEditor from "/App/utils/HTMLEditor.js";

class Agents {
    constructor() {
        this.self = document.createElement("div");
        this.self.classList.add("Agents_component");
        this.html = `
        <section class="agents_container">
            <ul class="list_agents">
                <a class="item_agents" href="/add" type="button" name="yes">Добавить сотрудника</a>
                <li class="item_agents">
                    <p class="agent_name">ФИО: <span>Федоренко Павел Сергеевичь</span></p>
                    <p class="agent_born-date">Дата рождения: <span>02.03.1974</span></p>
                    <p class="agent_gender">Пол: <span>Мужской</span></p>
                    <p class="agent_family-status">Семейное положение: <span>Не женат</span></p>
                    <p class="agent_childs">Дети: <span>Нет</span></p>
                    <p class="agent_post">Должность: <span>Старший научный сотрудник</span></p>
                    <p class="agent_academic-degree">Академическая степень: <span>Доктор наук</span></p>
                    <a href="/add" type="button" name="yes">Изменить данные</a>
                </li>
                <li class="item_agents">
                    <p class="agent_name">ФИО: <span>Федоренко Павел Сергеевичь</span></p>
                    <p class="agent_born-date">Дата рождения: <span>02.03.1974</span></p>
                    <p class="agent_gender">Пол: <span>Мужской</span></p>
                    <p class="agent_family-status">Семейное положение: <span>Не женат</span></p>
                    <p class="agent_childs">Дети: <span>Нет</span></p>
                    <p class="agent_post">Должность: <span>Старший научный сотрудник</span></p>
                    <p class="agent_academic-degree">Академическая степень: <span>Доктор наук</span></p>
                    <a href="/add" type="button" name="yes">Изменить данные</a>
                </li>
                <li class="item_agents">
                    <p class="agent_name">ФИО: <span>Федоренко Павел Сергеевичь</span></p>
                    <p class="agent_born-date">Дата рождения: <span>02.03.1974</span></p>
                    <p class="agent_gender">Пол: <span>Мужской</span></p>
                    <p class="agent_family-status">Семейное положение: <span>Не женат</span></p>
                    <p class="agent_childs">Дети: <span>Нет</span></p>
                    <p class="agent_post">Должность: <span>Старший научный сотрудник</span></p>
                    <p class="agent_academic-degree">Академическая степень: <span>Доктор наук</span></p>
                    <a href="/add" type="button" name="yes">Изменить данные</a>
                </li>
                <li class="item_agents">
                    <p class="agent_name">ФИО: <span>Федоренко Павел Сергеевичь</span></p>
                    <p class="agent_born-date">Дата рождения: <span>02.03.1974</span></p>
                    <p class="agent_gender">Пол: <span>Мужской</span></p>
                    <p class="agent_family-status">Семейное положение: <span>Не женат</span></p>
                    <p class="agent_childs">Дети: <span>Нет</span></p>
                    <p class="agent_post">Должность: <span>Старший научный сотрудник</span></p>
                    <p class="agent_academic-degree">Академическая степень: <span>Доктор наук</span></p>
                    <a href="/add" type="button" name="yes">Изменить данные</a>
                </li>
                <li class="item_agents">
                    <p class="agent_name">ФИО: <span>Федоренко Павел Сергеевичь</span></p>
                    <p class="agent_born-date">Дата рождения: <span>02.03.1974</span></p>
                    <p class="agent_gender">Пол: <span>Мужской</span></p>
                    <p class="agent_family-status">Семейное положение: <span>Не женат</span></p>
                    <p class="agent_childs">Дети: <span>Нет</span></p>
                    <p class="agent_post">Должность: <span>Старший научный сотрудник</span></p>
                    <p class="agent_academic-degree">Академическая степень: <span>Доктор наук</span></p>
                    <a href="/add" type="button" name="yes">Изменить данные</a>
                </li>
                <li class="item_agents">
                    <p class="agent_name">ФИО: <span>Федоренко Павел Сергеевичь</span></p>
                    <p class="agent_born-date">Дата рождения: <span>02.03.1974</span></p>
                    <p class="agent_gender">Пол: <span>Мужской</span></p>
                    <p class="agent_family-status">Семейное положение: <span>Не женат</span></p>
                    <p class="agent_childs">Дети: <span>Нет</span></p>
                    <p class="agent_post">Должность: <span>Старший научный сотрудник</span></p>
                    <p class="agent_academic-degree">Академическая степень: <span>Доктор наук</span></p>
                    <a href="/add" type="button" name="yes">Изменить данные</a>
                </li>
                <li class="item_agents">
                    <p class="agent_name">ФИО: <span>Федоренко Павел Сергеевичь</span></p>
                    <p class="agent_born-date">Дата рождения: <span>02.03.1974</span></p>
                    <p class="agent_gender">Пол: <span>Мужской</span></p>
                    <p class="agent_family-status">Семейное положение: <span>Не женат</span></p>
                    <p class="agent_childs">Дети: <span>Нет</span></p>
                    <p class="agent_post">Должность: <span>Старший научный сотрудник</span></p>
                    <p class="agent_academic-degree">Академическая степень: <span>Доктор наук</span></p>
                    <a href="/add" type="button" name="yes">Изменить данные</a>
                </li>
            </ul>
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
    }

    getContent() {
        return this.self;
    }
}

export default Agents;
