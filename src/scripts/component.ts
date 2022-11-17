import Handlebars from 'handlebars';
export type ComponentOptions = {
    attrs?: {[id:string]:unknown},
    props?: {[id:string]:unknown},
    data?: {[id:string]:unknown},
    events?: {[id:string]:Function},
    watch?: {[id:string]:Function},
}
export class Component extends EventTarget{
    private element: Element|any;
    private template: string;
    private event_list: {[id:string]:(EventListenerOrEventListenerObject|null)[]} = {};
    public attrs: {[id:string]:unknown} = {};
    public props: {[id:string]:unknown} = {};
    public data: {[id:string]:unknown} = {};
    public events: {[id:string]:Function} = {};
    public watch: {[id:string]:Function} = {};
    public uid: string;
    constructor(template:string, tagName:string="div", options?:ComponentOptions){
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
                    throw new Error('Отказано в доступе');
                target[prop] = val;
                this.element[prop] = target[prop];
                return true;
            }
        })
        this.data = new Proxy({},{
            set: (target:any, prop:string, val: any, old:any)=>{
                target[prop] = val;
                this.element.innerHTML = this.compile(target);
                if(typeof this.watch[prop] === "function"){
                    this.watch[prop].call(this,val,old);
                }
                return true;
            }
        })
        Object.assign(this.attrs, options?.attrs);
        Object.assign(this.props, options?.props);
        Object.assign(this.data, options?.data);
        Object.assign(this.events, options?.events);
        Object.assign(this.watch, options?.watch);
        this.props.id = this.uid;
        this.data.uid = this.uid;
        for(let k in this.events){
            this.$on(k,this.events[k]);
        }
    }
    compile(data:unknown){
        return Handlebars.compile(this.template).call(this,data);
    }
    addHelper(name:string,fn:Handlebars.HelperDelegate){
        Handlebars.registerHelper(name, fn);
    }
    get $el():Element{
        return this.element;
    }
    $on(type:string,callback:Function):void{
        if(!Array.isArray(this.event_list[type]))
            this.event_list[type] = [];
        this.event_list[type].push((event:Event)=>{
            callback.call(this,...(<CustomEvent>event).detail);
        });
        this.addEventListener(type,this.event_list[type][this.event_list[type].length-1]);
    }
    $off(type:string):void{
        if(Array.isArray(this.event_list[type])){
            this.event_list[type].forEach(e=>{
                this.removeEventListener(type,e)
            })
        }
        delete this.event_list[type];
    }
    $emit(type:string,...args:unknown[]):void{
        this.dispatchEvent(new CustomEvent(type,{
            detail: args
        }))
    }
    attachParent(el: Element){
        el.appendChild(this.element);
    }
}
