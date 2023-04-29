

class Agents {
    constructor() {
        this.html = `
        <section class="agents_container">
            <ul>
                <li>
                    Сотрудник1
                </li>
                <li>
                    Сотрудник2
                </li>
                <li>
                    Сотрудник3
                </li>
                <li>
                    Сотрудник4
                </li>
                <li>
                    Сотрудник5
                </li>
            </ul>
        </section>
        `;
    }

    getContent() {
        return this.html;
    }
}

export default Agents;
