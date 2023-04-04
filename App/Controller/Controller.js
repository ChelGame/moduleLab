import HistoryController from "./HistoryController/HistoryController.js";

class Controller {
    constructor() {
        this.self = this;
        this.HistoryController = new HistoryController();
        // попробовать реализовать вариант с наследованием через бинд this
    }
}

export default Controller;
