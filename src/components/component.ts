import Handlebars, { HelperDelegate } from 'handlebars';
import EventBus from './event_bus';
import api from '../api';
export default class Component<T extends ComponentOptionsType = {}> {
    constructor (template:string, tagName:string = 'div', options:T) {
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
        const proxyProps:ProxyHandler<any> = {
            set: (target:any, prop:string, val: any) => {
                target[prop] = val;
                this.$compile();
                return true;
            },
            get: (target:any, prop:string) => {
                if (typeof target[prop] === 'object' && target[prop] !== null) {
                    return new Proxy(target[prop], proxyProps)
                } else {
                    return target[prop];
                }
            },
        }
        this.data = new Proxy({},proxyProps)
        Object.assign(this.attrs, options.attrs);
        Object.assign(this.props, options.props);
        Object.assign(this.data, options.data)
        Object.assign(this.events, options.events);
        Object.assign(this.methods, options.methods);
        this.props.id = this.uid;
        this.data.uid = this.uid;
        for (const k in this.events) {
            this.eventBus.$on(k, this.events[k as keyof Obj]);
        }
    }

    private element: Element;
    private template: string;
    private eventBus: EventBus = new EventBus();
    private elementEvents: Obj[] = [];
    private uid: string;

    private eventsBuild () {
        this.elementEvents.forEach((o:Obj) => {
            const el = this.$find(`*[data-event${o.selector}="${o.selector}"]`);
            if (el !== null) {
                el.removeAttribute(`data-event${o.selector}`);
                this.eventBus.$off(`sub.${o.selector}`);
                this.eventBus.$on(`sub.${o.selector}`,(event:Event) => {
                    if (typeof this[o.funcName as keyof this] === 'function') { (<Function> this[o.funcName as keyof this])(event) }
                })
                el.addEventListener(o.name as string, (event:Event) => {
                    this.$emit(`sub.${o.selector}`,event);
                });
            }
        })
    }

    // @ts-ignore - used after template compilation from element events
    private routeTo (event:Event) {
        event.preventDefault();
        this.$router.$go((event.target as HTMLElement).getAttribute('href'))
    }

    public $off (type:string):void {
        this.eventBus.$off(type);
    }

    public $emit (type:string,...args:any[]):void {
        this.eventBus.$emit(type,...args);
    }

    public $title: string = '';
    public attrs: Obj = {};
    public props: Obj = {};
    public data: Obj = {};
    public events: ObjFunc = {};
    public methods: ObjFunc = {};
    public static $router: RouterType;
    public static $store: StoreType;
    public get $el ():Element {
        return this.element;
    }
    public get $router ():RouterType {
        return Component.$router;
    }
    public get $store ():StoreType {
        return Component.$store;
    }

    public get $uid ():string {
        return this.uid;
    }

    public $compile () {
        let eventId = 0;
        this.elementEvents = [];
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
        this.$addHelper('resourceUrl', (path:string) => {
            return new Handlebars.SafeString(api.resourceUrl(path));
        });
        this.$addHelper('on', (name:string, funcName:string) => {
            const eid:string = `${this.$uid}-${++eventId}`;
            this.elementEvents.push({ selector: eid, name, funcName })
            return new Handlebars.SafeString(`data-event${eid}="${eid}"`);
        });
        this.$addHelper('route', (pathname:string) => {
            const eid:string = `${this.$uid}-${++eventId}`;
            this.elementEvents.push({ selector: eid, name: 'click', funcName: 'routeTo' })
            return new Handlebars.SafeString(`data-event${eid}="${eid}" href="${pathname}"`);
        });
        this.element.innerHTML = Handlebars.compile(this.template).call(this,this.data);
        this.eventsBuild()
        this.$emit('html-update');
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

    public $attach (el: Element) {
        el.appendChild(this.element);
        this.$emit('attach');
    }

    public $hide () {
        this.element.parentElement?.removeChild(this.element);
        this.$emit('hide');
    }
}
