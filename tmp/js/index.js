import tableHandler from "./tableHandler.js";
import authHandler from "./authHandler.js";

class App {
    constructor() {
        this.parent = document.querySelector("main");
        this.state = {
            target: "main",
            auth: "no",
            href: "main.html",
        };
        this.settebleEvents = [];
    }

    start() {
        this.setState(this.getStorageState()); // получаем последнее состояние приложения из хранилища
        this.changePage(); // подгружаем контент
        this.setLinkEvents();
        this.setUrlEvents();
    }

    setState(state) {
        this.state = state;
        this.setStoreageState();
    }

    setStoreageState() {
        localStorage.state = JSON.stringify(this.state);
    }

    getStorageState() {
        let state = this.state;
        if (localStorage.length && localStorage.state != "null") state = JSON.parse( localStorage.state );
        return state;
    }

    async changePage() {
        let url = '/js/template/';
        url += this.state.href;

        try {
            // загружаем
            let response = await fetch(url);

            let result = await response.text();
            // вставляем
            this.parent.innerHTML = result;
            this.setEvents();
        } catch (e) {
            console.log("bad addres. description: " + e);
        }
    }

    changeUrl() {
        window.history.pushState(this.state, "Module Laboratory", this.state.target);
    }

    setLinkEvents() {
        document.querySelectorAll('[data-link="true"]').forEach((item, i) => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                this.setState(
                    {
                        href: e.target.href.split("/").at(-1),
                        target: e.target.href.split("/").at(-1).split('.')[0],
                        auth: this.state.auth,
                    }
                );
                this.changePage();
                this.changeUrl();
            });
        });
    }

    setUrlEvents() {
        window.addEventListener("popstate", () => {
            this.setState(window.history.state);
            this.changePage();
        });
    }

    async printData() {
        let url = '/php/printData.php';
        let resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        });

        let result = await resp.text();
        document.querySelector(".showData").innerHTML = `<pre>${result}</pre>`;
    }

    showData() {
        this.printData();
    }

    setEvents() {
        switch (this.state.target) {
            case "main":
                document.querySelector('table').addEventListener("click", tableHandler);
                break;
            case "auth":
                document.querySelector('form').addEventListener("submit", authHandler);
                document.querySelector('form').addEventListener("reset", authHandler);
                break;
            case "lab4":
                function cleareColor() {
                    $(".lab4_container")[0].querySelectorAll("article").forEach((item) => {
                        item.style = null;
                        item.querySelectorAll("section").forEach((subItem) => {
                            subItem.style = null;
                        });
                    });
                }
                let asideMenu1 = $(".aside1_menu")[0];
                let asideMenu2 = $(".aside2_menu")[0];

                $(".lab4_container")[0].querySelectorAll("article").forEach((item) => {
                    let li = document.createElement("li");
                    let ul = document.createElement("ul");
                    li.textContent = item.querySelector("h1").textContent;
                    asideMenu1.append(li);
                    li.addEventListener('click', () => {
                        cleareColor(asideMenu1);
                        item.style.backgroundColor = "#09afff";
                    });
                    item.querySelectorAll("section").forEach((subItem) => {
                        let li = document.createElement("li");
                        li.textContent = subItem.querySelector("h2").textContent;
                        ul.append(li);
                        li.addEventListener('click', () => {
                            cleareColor(asideMenu1);
                            subItem.style.backgroundColor = "#09afff";
                        });
                    });
                    asideMenu1.append(ul);
                });

                break;
            case "showData":
                this.showData();

                break;
            default:
                return ;
        }
    }


}

const app = new App();
app.start();
