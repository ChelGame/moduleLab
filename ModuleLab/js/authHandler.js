async function authHandler (event) {
    event.preventDefault();
    if (event.type === 'submit') {
        let login = document.querySelector(".auth_login");
        let password = document.querySelector(".auth_password");

        login.style.backgroundColor = "#0f0";
        password.style.backgroundColor = "#0f0";

        setTimeout(() => {
            login.style = null;
            password.style = null;
            let accept = document.querySelector('.accept');

            function addDisnone() {
                accept.classList.add("disnone");
                accept.removeEventListener('click', addDisnone);
            }

            accept.classList.remove("disnone");
            accept.addEventListener('click', addDisnone);
        }, 1000);

        let url = '/php/writeData.php';
        let data = {
            login: login.value,
            password: password.value,
        }
        let resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data),
        });
    }

    if (event.type === 'reset') {
        let confirm   = document.querySelector(".confirm");
        let yesButton = document.querySelector('[name="yes"]');
        let noButton  = document.querySelector('[name="no"]');
        let login = document.querySelector(".auth_login");
        let password = document.querySelector(".auth_password");

        confirm.classList.remove("disnone");

        yesButton.addEventListener("click", yesHandler);
        noButton.addEventListener("click", noHandler);

        function yesHandler() {
            document.querySelector('form').removeEventListener("reset", authHandler);
            event.target.reset();
            document.querySelector('form').addEventListener("reset", authHandler);

            login.style.backgroundColor = "#f00";
            password.style.backgroundColor = "#f00";
            confirm.classList.add("disnone");
            yesButton.removeEventListener("click", yesHandler);

            setTimeout(() => {
                login.style = null;
                password.style = null;

            }, 1000);
        }

        function noHandler() {
            login.style.backgroundColor = "#00f";
            password.style.backgroundColor = "#00f";
            confirm.classList.add("disnone");
            noButton.removeEventListener("click", noHandler);

            setTimeout(() => {
                login.style = null;
                password.style = null;
            }, 1000);
        }


    }


}

export default authHandler;
