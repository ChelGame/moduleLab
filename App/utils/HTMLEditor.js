"use strict"
/*
{
Чтобы создать иерархическое представление html структуры методу необходимо передать строку с html
Для создания представления объектов нужно вызвать метод HTMLParser
Чтобы после создания представления создать реальную DOM структуру, нужно вызвать метод HTMLPrinter
и передать ему ссылку на дом элемент, в который будет помещен текущий html
В конце файла есть пример использования.
Не воспринимает комментарии - поправимо
}
*/
export default class HTMLEditor {
    constructor(html) {
        this.html = html;
        this.obj = [];

        this.tag = '';
        this.paramKey = '';
        this.paramVal = '';
        this.paramFlag = true; // true значит читаем ключ иначе читаем значение
        this.text = '';

        this.state = '';
        this.depth = 0;

        this.elem = {};
        this.directory = [
            'area',
            'base',
            'br',
            'col',
            'hr',
            'img',
            'input',
            'link',
            'meta',
            'param',
        ];
    }
    reset (html) {
        this.html = html;
        this.obj = [];

        this.tag = '';
        this.paramKey = '';
        this.paramVal = '';
        this.paramFlag = true;
        this.text = '';

        this.state = '';
        this.depth = 0;

        this.elem = {};
    }
    HTMLPrinter (parent) {
        const printChild = (child) => {
            child.forEach(ch => {
                for (let param in ch.params) {
                    ch.self.setAttribute(param, ch.params[param]);
                }
                ch.parent.self.append(ch.self);
                if (ch.childs) {
                    printChild (ch.childs);
                }
            });
        }
        try {
            this.obj.forEach((item) => {
                for (let param in item.params) {
                    item.self.setAttribute(param, item.params[param]);
                }

                if (parent) {
                    parent.append(item.self);
                    // item.parent.self.append(item.self);
                }
                printChild(item.childs);
            });
        } catch (e) {
            console.log(e);
        }
    }
    HTMLParser (parent) {
        if (!this.html) {
            // console.log('Пустой html');
            return;
        }
        let parents = [];
        let quote  = '';

        for (var i = 0; i < this.html.length; i++) {
            if (this.html[i] === '<') {
                this.text = this.text.replace('\\n').trim();
                if (this.text) {
                    this.elem = {
                        'parent': parents[this.depth - 1],
                        'childs': null,
                        'params': {},
                        'self' : this.text,
                    };
                    if (parents[this.depth - 1]) {
                        parents[this.depth - 1].childs.push(this.elem);
                    }
                }

                this.state = 'rTag';
                this.tag = '';
            } else if (this.html[i] === '>') {
                if (this.state === 'rTag') {
                    try {
                        this.elem = {
                            'parent': null,
                            'childs': [],
                            'params': {
                            },
                            'self' : null,
                        };

                        this.elem.self = document.createElement(this.tag);
                        parents[this.depth] = this.elem;

                        if (this.depth === 0) {
                            this.obj.push(this.elem);
                        } else {

                            this.elem.parent = parents[this.depth - 1];
                            this.elem.parent.childs.push(this.elem);
                        }

                        let flag = this.directory.some((el) => {
                            return this.tag === el;
                        });
                        if (!flag) this.depth++;


                    } catch (e) {
                        console.log("error, maybe the depth was -1", e);
                    }
                }
                this.state = 'rTex';
                this.text = '';
                // this.paramVal = this.paramVal;
                // this.paramVal = this.paramVal || true;
                if (this.paramKey) {
                    this.elem.params[this.paramKey] = this.paramVal;
                }
                this.paramKey = '';
                this.paramVal = '';
                this.paramFlag = true;
            } else if (this.html[i] === ' ') {
                if (this.state === 'rTex') {

                    this.text += this.html[i];
                }
                if (this.state === 'rPar') {

                    if (this.paramFlag) {
                        // this.paramVal = this.paramVal || true;
                        if (this.paramKey) {
                            this.elem.params[this.paramKey] = this.paramVal;
                        }
                        this.paramKey = '';
                        this.paramVal = '';
                        this.paramFlag = true;
                    } else {
                        this.paramVal += this.html[i];
                    }
                }
                if (this.state === 'rTag') {
                    try {
                        this.elem = {
                            'parent': null,
                            'childs': [],
                            'params': {
                            },
                            'self' : null,
                        };

                        this.elem.self = document.createElement(this.tag);
                        parents[this.depth] = this.elem;

                        if (this.depth === 0) {
                            this.obj.push(this.elem);
                        } else {

                            this.elem.parent = parents[this.depth - 1];
                            this.elem.parent.childs.push(this.elem);
                        }

                        this.state = 'rPar';
                        this.param = '';
                        let flag = this.directory.some((el) => {
                            return this.tag === el;
                        });
                        if (!flag) this.depth++;


                    } catch (e) {
                        console.log("error, maybe the depth was -1", e);
                    }
                }
            } else if (this.paramFlag && this.html[i] === '/') {
                this.state = 'cTag';
                this.depth--;
                parents.pop();
            } else {
                switch (this.state) {
                    case 'rTag':
                        this.tag += this.html[i];
                        break;
                    case 'rPar':
                        try {
                            if (this.paramFlag && this.html[i] === "=") {
                                i++;
                                if (this.html[i] === "\"" || this.html[i] === "\'" || this.html[i] === "\`") {
                                    this.paramFlag = !this.paramFlag;
                                    quote = this.html[i];
                                } else {
                                    throw "unexpected space, quote was expected";
                                }
                            } else if (!this.paramFlag && this.html[i] === quote) {
                                this.paramFlag = !this.paramFlag;
                            } else {
                                if (this.paramFlag) {
                                    this.paramKey += this.html[i];
                                } else {
                                    this.paramVal += this.html[i];
                                }
                            }
                        } catch (e) {
                            console.log(e);
                        }
                        break;
                    case 'rTex':
                        this.text += this.html[i];
                        break;
                }
            }
        }
        if (parent) {
            for (var child in this.obj) {
                parent.childs[child] = this.obj[child];
            }
        }
        return this.obj;
    }
}

// const str = `
// <section class="popUp hide put">
//     <form class="TaskGen f f_col f_c" >
//         <textarea class="input" name="task" rows="8" cols="80">Разобрать входящие</textarea>
//         <input class="input" type="text" name="processig" value="Бессрочно">
//         <input class="input" type="text" name="complite" value="Бессрочно">
//         <input class="input" type="hidden" name="CreateTime" value="">
//         <button class="button" type="button" name="sendTask">Создать</button>
//     </form>
// </section>
// `;
// const editor = new HTMLEditor(str);
// editor.HTMLParser();
// editor.HTMLPrinter();
