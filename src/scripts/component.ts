import Handlebars from 'handlebars';
export type obj = {[id:string]:(string|number|boolean|undefined|obj|Function|unknown|EventListenerOrEventListenerObject|null)}
export type objfunc = {[id:string]:Function}
export type objevent = {[id:string]:(EventListenerOrEventListenerObject|null)[]}
export type ComponentOptionsType = {
    attrs?: obj,
    props?: obj,
    data?: obj,
    events?: objfunc,
    methods?: objfunc,
}
export type ComponentType = {
    attrs: obj,
    props: obj,
    data: obj,
    events: objfunc,
    methods: objfunc,
    $compile: Function,
    $find: Function,
    $findAll: Function,
    $on: Function,
    $off: Function,
    $emit: Function,
    $attach: Function,
    $el:Element,
    $uid:string,
}
export class Component extends EventTarget implements ComponentType{
    private element: Element;
    private template: string;
    private event_list: objevent = {};
    private uid: string;
    public attrs: obj = {};
    public props: obj = {};
    public data: obj = {};
    public events: objfunc = {};
    public methods: objfunc = {};
    public get $el():Element{
        return this.element;
    }
    public get $uid():string{
        return this.uid;
    }
    constructor(template:string, tagName:string="div", options?:ComponentOptionsType){
        super();
        this.element = document.createElement(tagName);
        this.uid = `uid_${Math.floor(new Date().getTime()*(Math.random()*100)).toString(16)}`;
        this.template = template;
        this.attrs = new Proxy(this.element.attributes,{
            set: (target:any, prop:string, val: any)=>{
                target[prop] = val;
                this.element.setAttribute(`${prop}`, val);
                return true;
            }
        })
        this.props = new Proxy(this.element,{
            set: (target:any, prop:string, val: any, old:any)=>{
                if(prop==='innerHTML')
                    return true;
                target[prop] = val;
                this.element[prop as keyof Object] = target[prop];
                return true;
            }
        })
        this.data = new Proxy({},{
            set: (target:any, prop:string, val: any, old:any)=>{
                target[prop] = val;
                this.element.innerHTML = this.$compile(target);
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
        for(let k in this.events){
            this.$on(k,this.events[k as keyof obj]);
        }
    }
    public $compile(data:obj){
        return Handlebars.compile(this.template).call(this,data);
    }
    public $find(selector:string):Element{
        let tmp = this.$el.querySelector(selector);
        if(tmp===null)
            throw new Error(`Элемент ${selector} не найден`);
        return tmp;
    }
    public $findAll(selector:string){
        return this.$el.querySelectorAll(selector);
    }
    public $on(type:string,callback:Function):void{
        if(!Array.isArray(this.event_list[type]))
            this.event_list[type] = [];
        this.event_list[type].push((event:Event)=>{
            callback.call(this,...(<CustomEvent>event).detail);
        });
        this.addEventListener(type,this.event_list[type][this.event_list[type].length-1]);
    }
    public $off(type:string):void{
        if(Array.isArray(this.event_list[type])){
            this.event_list[type].forEach(e=>{
                this.removeEventListener(type,e)
            })
        }
        delete this.event_list[type];
    }
    public $emit(type:string,...args:unknown[]):void{
        this.dispatchEvent(new CustomEvent(type,{
            detail: args
        }))
    }
    public $attach(el: Element){
        el.appendChild(this.element);
    }
}