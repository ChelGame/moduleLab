<!DOCTYPE html>
<html lang="ru">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Module Laboratory</title>
        <link type="image/x-icon" href="./img/icon.ico">
        <link rel="stylesheet" href="./css/index.css">
        <link rel="stylesheet" href="./css/media.css">
        <script type="module" defer src="./App/App.js"></script>
    </head>
    <body>
        <header>
            <section class="logo_container">
                <a href="./index.html"><img class="logo_image" src="./img/icon.ico" alt="colb"></a>
            </section>
            <section class="page_container">
                <h1 class="page_name">Модуль "Лаборатория"</h1>
            </section>
            <section class="navigation_container">
                <nav>
                    <ul>
                        <li hidden><a href="#">Выйти</a></li>
                        <li><a data-historyLink href="/auth">Войти</a></li>
                        <li><a data-historyLink href="/register">Регистрация</a></li>
                        <li><a data-historyLink href="/main">Главная</a></li>
                        <li hidden><a data-historyLink href="/agents">Наши сотрудники</a></li>
                        <li><a data-historyLink href="/articles">Публикации</a></li>
                    </ul>
                </nav>
            </section>
        </header>

        <main>

        </main>

        <footer>
            <section class="logo_container">
                <a href="./index.html"><img class="logo_image" src="./img/icon.ico" alt="colb"></a>
            </section>
            <section class="navigation_container">
                <nav>
                    <ul>
                        <li hidden><a href="#">Выйти</a></li>
                        <li><a data-historyLink href="/auth">Войти</a></li>
                        <li><a data-historyLink href="/register">Регистрация</a></li>
                        <li><a data-historyLink href="/main" >Главная</a></li>
                        <li hidden><a data-historyLink href="/agents" >Наши сотрудники</a></li>
                        <li><a data-historyLink href="/articles" >Публикации</a></li>
                    </ul>
                </nav>
            </section>
            <section class="address_container">
                <address class="address">
                    <a href="mailto:lab@lab.com">lab@lab.com</a>
                    <a href="tel:+74353234456">+7(4353)23-44-56</a>
                </address>
            </section>
        </footer>
    </body>
</html>
