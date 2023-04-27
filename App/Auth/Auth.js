

class Auth {
    constructor() {
        this.html = `
        <section class="auth_container">
            <form class="auth" >
                <input class="auth_login" type="text" name="login" value="" placeholder="Логин">
                <input class="auth_password" type="password" name="password" value="" placeholder="Пароль">
                <input class="auth_submit" type="submit" name="submit" value="Войти">
                <input class="auth_reset" type="reset" name="reset_b" value="сбросить">
            </form>
        </section>

        <section class="popUp_container disnone confirm">
            <aside class="popUp">
                <p>Уверены, что хотите сбросить введенные данные?</p>
                <div class="button_wrap">
                    <button type="button" name="yes">Да</button>
                    <button type="button" name="no">Нет</button>
                </div>
            </aside>
        </section>

        <section class="popUp_container disnone accept">
            <aside class="popUp">
                <h2>Вход выполнен</h2>
            </aside>
        </section>
        <section class="popUp_container disnone no_accept">
            <aside class="popUp">
                <h2>Вход не выполнен</h2>
            </aside>
        </section>

        `;
    }

    getContent() {
        return this.html;
    }
}



export default Auth;
