import Controller from "./Controller/Controller.js";
import Component from "./Component/Component.js";

class App {
    constructor() {
        this.self = this;
        // this.Elem = document.querySelector("main");
        this.Controller = new Controller();
        this.Component = new Component();

        this.state = {};

        this.start();
        // попробовать реализовать вариант с наследованием через бинд this

        // Тупая идея, если есть ивент обновления страницы, отлавливать его, чистить ссылку а после обновления ее возвращать
    }

    start() {
        console.log("Работа над корректным отображением и учитыванием адреса все еще идет.");
    }
}

const app = new App();
