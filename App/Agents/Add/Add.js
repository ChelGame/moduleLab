import HTMLEditor from "/App/utils/HTMLEditor.js";

class Agents {
    constructor() {
        this.self = document.createElement("div");
        this.self.classList.add("Agents_component");
        this.html = `
        <section class="agents_container">
            <div class="item_agents">
                <p class="agent_name">ФИО: <input>Федоренко Павел Сергеевичь</input></p>
                <p class="agent_born-date">Дата рождения: <input>02.03.1974</input></p>
                <p class="agent_gender">Пол: <input>Мужской</input></p>
                <p class="agent_family-status">Семейное положение: <input>Не женат</input></p>
                <p class="agent_childs">Дети: <input>Нет</input></p>
                <p class="agent_post">Должность: <input>Старший научный сотрудник</input></p>
                <p class="agent_academic-degree">Академическая степень: <input type="text">Доктор наук</input></p>
                <input type="submit" name="yes">Изменить данные</input>
            </div>
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
