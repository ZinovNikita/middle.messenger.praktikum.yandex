import Handlebars, { HelperDelegate } from 'handlebars';
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
            this.$on(k, this.events[k as keyof Obj]);
        }
        this.$on('html-update', this.eventsBuild)
    }

    private element: Element;
    private template: string;
    private eventList: ObjEvent = {};
    private elementEvents: Obj[] = [];
    private uid: string;

    private eventsBuild () {
        this.elementEvents.forEach((o:Obj) => {
            const el = this.$find(o.selector as string);
            const f = this[o.funcName as keyof this];
            if (el !== null && typeof f === 'function') {
                // bind used to set context of Component class, and not element from which event is called
                el.addEventListener(o.name as string, f.bind(this));
            }
        })
    }

    public attrs: Obj = {};
    public props: Obj = {};
    public data: Obj = {};
    public events: ObjFunc = {};
    public methods: ObjFunc = {};
    public get $el ():Element {
        return this.element;
    }

    public get $uid ():string {
        return this.uid;
    }

    public $title: string = '';
    public $compile (data:Obj) {
        this.$addHelper('if_eq', function (this:any, a:any, b:any, opts:any) {
            if (a === b) {
                return opts.fn(this);
            } else {
                return opts.inverse(this);
            }
        });
        this.$addHelper('if_include', function (this:any, a:any, b:any, opts:any) {
            if (b === null || b === undefined || (typeof b === 'string' && b.length === 0)) { return opts.fn(this); }
            if (a.indexOf(b) >= 0) {
                return opts.fn(this);
            } else {
                return opts.inverse(this);
            }
        });
        this.$addHelper('on', (name:string, funcName:string, selector:string) => {
            if (this.elementEvents.filter((o:Obj) => { return (o.selector === selector && o.name === name && o.funcName === funcName) }).length === 0) {
                this.elementEvents.push({ selector, name, funcName })
            }
            return '';
        });
        return Handlebars.compile(this.template).call(this,data);
    }

    public $addHelper (name:string,cb:HelperDelegate) {
        Handlebars.registerHelper(name, cb);
    }

    public $find (selector:string):Element|null {
        return this.$el.querySelector(selector);
    }

    public $findAll (selector:string) {
        return this.$el.querySelectorAll(selector);
    }

    public $on (type:string,callback:Function):void {
        if (!Array.isArray(this.eventList[type])) { this.eventList[type] = []; }
        this.eventList[type].push((event:Event) => {
            callback.call(this,...(<CustomEvent>event).detail);
        });
        this.addEventListener(type,this.eventList[type][this.eventList[type].length - 1]);
    }

    public $off (type:string):void {
        if (Array.isArray(this.eventList[type])) {
            this.eventList[type].forEach((e:EventListenerOrEventListenerObject|null) => {
                this.removeEventListener(type,e)
            })
        }
        delete this.eventList[type];
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
