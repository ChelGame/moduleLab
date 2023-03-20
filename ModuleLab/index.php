<!DOCTYPE html>
<html lang="ru">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Module Laboratory</title>
        <link type="image/x-icon" href="./img/icon.ico">
        <link rel="stylesheet" href="./css/index.css">
        <link rel="stylesheet" href="./css/media.css">
        <script type="module" defer src="./js/index.js">

        </script>
        <script
  src="https://code.jquery.com/jquery-3.6.4.min.js"
  integrity="sha256-oP6HI9z1XaZNBrJURtCoUT5SUnxFr8s3BzRl+cbzUq8="
  crossorigin="anonymous"></script>
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
                        <li><a data-link="true" href="/auth.html">Войти</a></li>
                        <li hidden><a href="#">Выйти</a></li>
                        <li><a data-link="true" href="/main.html">Главная</a></li>
                        <li><a data-link="true" href="/agents.html" >Наши сотрудники</a></li>
                        <li><a data-link="true" href="/articles.html" >Публикации</a></li>
                        <li><a data-link="true" href="/lab4.html" >lab4</a></li> <!-- Фантазия закончилась -->
                        <li><a data-link="true" href="/showData.html" >showData</a></li> <!-- Фантазия закончилась -->
                    </ul>
                </nav>
            </section>
        </header>

        <main>
            <!-- <div class="fixed_container">
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
            </div> -->
        </main>

        <footer>
            <section class="logo_container">
                <a href="./index.html"><img class="logo_image" src="./img/icon.ico" alt="colb"></a>
            </section>
            <section class="navigation_container">
                <nav>
                    <ul>
                        <li><a data-link="true" href="/auth.html">Войти</a></li>
                        <li hidden><a href="#">Выйти</a></li>
                        <li><a data-link="true" href="/main.html" >Главная</a></li>
                        <li><a data-link="true" href="/agents.html" >Наши сотрудники</a></li>
                        <li><a data-link="true" href="/articles.html" >Публикации</a></li>
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
