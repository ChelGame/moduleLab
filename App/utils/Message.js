export default class Message {
    constructor() {
        this.self = document.createElement("section");
        this.self.classList.add("popUp_container", "disnone");

        this.popUp = document.createElement("aside");
        this.popUp.classList.add("popUp");

        this.message = document.createElement("p");
        this.message.classList.add("message");

        this.self.append(this.popUp);
        this.popUp.append(this.message);

        this.timeout = null;

        this.self.addEventListener("click", () => {
            try {
                this.removeMessage();
                clearTimeout(this.timeout);
            } catch (e) {}
        });
        document.addEventListener(`keydown`, (event) => {
            try {
                this.removeMessage();
                clearTimeout(this.timeout);
            } catch (e) {}
        }, false);
    }

    printMessage(message, timeout = 5000) {
        try {
            document.body.append(this.self);

            this.self.classList.remove("disnone");
            this.message.innerHTML = message;

            if (timeout) {
                this.timeout = setTimeout(() => {
                    this.removeMessage();
                }, timeout);
            }
        } catch (e) {}
    }

    removeMessage() {
        try {
            this.self.classList.add("disnone");
            setTimeout(() => {
                try {
                    document.body.removeChild(this.self);
                } catch (e) {}
            }, 200);
        } catch (e) {}
    }
}
