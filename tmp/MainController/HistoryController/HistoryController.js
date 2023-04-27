class HistoryController {
    constructor() {
        console.log("Контроллер истории подключен");
        this.historySetEventHandler();
    }

    historySetEventHandler() {
        console.log("Ивенты отлавливаются");
        // События, происходящие при изменении истории

        // Это происходит при клике на объект со свойством data-historyLink
        document.querySelectorAll("[data-historyLink]").forEach((historyLink) => {
            historyLink.addEventListener("click", (event) => {
                this.historyLinkEventHandler(event);
            });
        });

        // Это происходит при открытии страницы (вход или перезагрузка)
        window.addEventListener("DOMContentLoaded", () => {
            this.historyWindowOpenEventHandler();
        });

        // Это происходит при закрытии страницы (выход или перезагрузка)
        window.onbeforeunload = () => {
            this.historyWindowCloseEventHandler();
        };
    }

    historyLinkEventHandler(event) {
        event.preventDefault();

        this.state.href = event.target.attributes[1].nodeValue;
        this.historyWindowLocationChanger();
    }

    historyWindowOpenEventHandler() {
        // window.locationbar.visible = false;
        console.log(HistoryController);
        // console.log(window.history.state);
    }

    historyWindowCloseEventHandler() {

        // Было бы неплохо разобраться, почему при onbeforeunload используется адрес, что был при происшествии события.
        // Возможно есть какой то объект этого события и возможно что-то в нем открыто для записи и это можно использовать
        // Но пока маршрутизация будет через .htaccess
    }

    historyWindowLocationChanger() {
        window.history.pushState(this.state, "ModuleLab" /*временно, потом изменить на файл с константами*/, this.state.href);
        console.log(window.history);
        console.log(this.state);
    }
}

export default HistoryController;
