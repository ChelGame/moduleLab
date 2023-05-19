import HTMLEditor from "/App/utils/HTMLEditor.js";

    //

class Agents {
    constructor() {
        this.self = document.createElement("div");
        this.self.classList.add("Agents_component");
        this.html = `
        <section class="agents_container">
            <div class="item_agents">
                <label>
                    ФИО: <input name="full-name" type="text"></input>
                </label>
                <label>
                    Дата рождения: <input name="born" type="date"></input>
                </label>
                <label>
                    Пол:
                    <datalist name="gender">
                        <option value="M" selected>M</option>
                        <option value="Ж">Ж</option>
                    </datalist>
                </label>
                <label>
                    Семейное положение:
                    <datalist name="family-status">
                        <option value="Холост" selected>Холост</option>
                        <option value="Женат">Женат</option>
                        <option value="В гражданском браке">В гражданском браке</option>
                        <option value="Вдовец">Вдовец</option>
                        <option value="5">Разведен</option>
                    </datalist>
                    <div class="agint_desc">
                        <p>Ваш пол учтется. Выберите подходящее вам не обращая внимание на пол.</p>
                    </div>
                </label>
                <label>
                    Дети:
                    <input name="childs" type="number" placeholder="4"></input>
                </label>
                <label>
                    Должность:
                    <input name="post">Старший научный сотрудник</input>
                </label>
                <label>
                    Академическая степень:
                    <input type="text">Доктор наук</input>
                    <div class="agint_desc">
                        <p>Если у вас несколько степеней, укажите все через запятую</p>
                    </div>
                </label>
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
