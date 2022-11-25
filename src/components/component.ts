import Handlebars from 'handlebars';
export default class Component extends EventTarget {
    constructor (template:string, tagName:string = 'div', options?:ComponentOptionsType) {
        super();
        this.element = document.createElement(tagName);
        this.uid = `uid_${Math.floor(new Date().getTime() * (Math.random() * 100)).toString(16)}`;
        this.template = template;
        this.attrs = new Proxy(this.element.attributes,{
            set: (target:any, prop:string, val: any) => {
                target[prop] = val;
                this.element.setAttribute(`${prop}`, val);
                return true;
            }
        })
        this.props = new Proxy(this.element,{
            set: (target:any, prop:string, val: any) => {
                if (prop === 'innerHTML') { return true; }
                target[prop] = val;
                this.element[prop as keyof Object] = target[prop];
                return true;
            }
        })
        this.data = new Proxy({},{
            set: (target:any, prop:string, val: any) => {
                target[prop] = val;
                this.element.innerHTML = this.$compile(target);
                this.$emit('html-update')
                return true;
            }
        })
        Object.assign(this.attrs, options?.attrs);
        Object.assign(this.props, options?.props);
        Object.assign(this.data, options?.data);
        Object.assign(this.events, options?.events);
        Object.assign(this.methods, options?.methods);
        this.props.id = this.uid;
        this.data.uid = this.uid;
        for (const k in this.events) {
            this.$on(k,this.events[k as keyof obj]);
        }
    }

    private element: Element;
    private template: string;
    private event_list: objevent = {};
    private uid: string;
    public attrs: obj = {};
    public props: obj = {};
    public data: obj = {};
    public events: objfunc = {};
    public methods: objfunc = {};
    public get $el ():Element {
        return this.element;
    }

    public get $uid ():string {
        return this.uid;
    }

    public $title: string = '';
    public $compile (data:obj) {
        Handlebars.registerHelper('if_eq', function (this:any, a:any, b:any, opts:any) {
            if (a === b) {
                return opts.fn(this);
            } else {
                return opts.inverse(this);
            }
        });
        Handlebars.registerHelper('if_include', function (this:any, a:any, b:any, opts:any) {
            if (b === null || b === undefined || (typeof b === 'string' && b.length === 0)) { return opts.fn(this); }
            if (a.indexOf(b) >= 0) {
                return opts.fn(this);
            } else {
                return opts.inverse(this);
            }
        });
        return Handlebars.compile(this.template).call(this,data);
    }

    public $find (selector:string):Element {
        const tmp = this.$el.querySelector(selector);
        if (tmp === null) { throw new Error(`Элемент ${selector} не найден`); }
        return tmp;
    }

    public $findAll (selector:string) {
        return this.$el.querySelectorAll(selector);
    }

    public $on (type:string,callback:Function):void {
        if (!Array.isArray(this.event_list[type])) { this.event_list[type] = []; }
        this.event_list[type].push((event:Event) => {
            callback.call(this,...(<CustomEvent>event).detail);
        });
        this.addEventListener(type,this.event_list[type][this.event_list[type].length - 1]);
    }

    public $off (type:string):void {
        if (Array.isArray(this.event_list[type])) {
            this.event_list[type].forEach(e => {
                this.removeEventListener(type,e)
            })
        }
        delete this.event_list[type];
    }

    public $emit (type:string,...args:unknown[]):void {
        this.dispatchEvent(new CustomEvent(type,{
            detail: args
        }))
    }

    public $attach (el: Element) {
        el.appendChild(this.element);
        this.$emit('attach');
    }
}
