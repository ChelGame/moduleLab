<<<<<<< HEAD


class Main {
    constructor() {
=======
import HTMLEditor from "/App/utils/HTMLEditor.js";

class Main {
    constructor() {
        this.self = document.createElement("div");
        this.self.classList.add("Main_component");
>>>>>>> 9b948e8de7ba9e4fb710e6e6f2da2caf82a91f4d
        this.html = `
        <div class="fixed_container">
            <section class="about_container">
                <h2 class="about_header">О нашей Лаборатории</h2>
            </section>

            <section class="description_container">
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </section>

            <section class="table_container">
                <table>
                    <thead>
                        <tr>
                            <th colspan="6">Таблица численности сотрудников в разных штатах</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td>Младшие научные сотрудники</td>
                            <td>Средние научные сотрудники</td>
                            <td>Старшие научные сотрудники</td>
                            <td>Ответственные научные сотрудники</td>
                            <td>Ведущие научные сотрудники</td>
                        </tr>
                        <tr>
                            <td>Оптика</td>
                            <td>15</td>
                            <td>8</td>
                            <td>6</td>
                            <td>2</td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td>Генетика</td>
                            <td>12</td>
                            <td>5</td>
                            <td>4</td>
                            <td>2</td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td>Физика</td>
                            <td>54</td>
                            <td>35</td>
                            <td>18</td>
                            <td>7</td>
                            <td>2</td>
                        </tr>
                        <tr>
                            <td>Нано-технологии</td>
                            <td>6</td>
                            <td>3</td>
                            <td>2</td>
                            <td>1</td>
                            <td>1</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>

        `;
<<<<<<< HEAD
    }

    getContent() {
        return this.html;
=======
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
>>>>>>> 9b948e8de7ba9e4fb710e6e6f2da2caf82a91f4d
    }
}

export default Main;
