

class Articles {
    constructor() {
        this.html = `
        <section class="articles_container">
            <nav>
                <ul>
                    <li>Предыдущая статья</li>
                    <li>Следующая статья</li>
                    <li>Оценить статью</li>
                </ul>
            </nav>
            <ul>
                <li>Статья1</li>
                <li>Статья2</li>
                <li>Статья3</li>
                <li>Статья4</li>
                <li>Статья5</li>
            </ul>
        </section>
        `;
    }

    getContent() {
        return this.html;
    }
}

export default Articles;
