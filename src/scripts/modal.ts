import {obj,ComponentOptionsType,Component} from "./component";
const modal_template:string = `
<header class="modal-title">
    <h3>{{title}}</h3>
    <i id="{{uid}}-close" class="modal-close">&times;</i>
</header>
<form id="{{uid}}-form" data-obj-type="modal-form">
{{#fields}}
    {{#if readonly}}
        <fieldset class="show-field" id="{{../uid}}-fieldset-{{name}}">
            <span class="show-item left">{{label}}</span>
            <span class="show-item right">{{value}}</span>
        </fieldset>
    {{else}}
        <fieldset id="{{../uid}}-fieldset-{{name}}">
            <label>{{label}}</label>
            <input data-obj-type="field" type="{{type}}" name="{{name}}" placeholder="{{label}}" value="{{value}}"/>
            <small class="error-msg"></small>
        </fieldset>
    {{/if}}
{{/fields}}
</form>
<footer class="modal-footer">
    <button id="{{uid}}-cancel" class="btn-red" data-obj-type="cancel-btn">{{cancel_title}}</button>
    <button id="{{uid}}-ok" data-obj-type="ok-btn">{{ok_title}}</button>
</footer>`;
export default class Modal extends Component{
    private fvalues: obj = {};
    constructor(options?:ComponentOptionsType){
        super(modal_template,'dialog',options);
        this.props.className = "modal";
        (<obj[]>this.data.fields).forEach((f:obj)=>{
            this.fvalues[f.name as keyof obj] = f.value;
        })
        this.$find(`#${this.$uid}-form`)?.addEventListener("input",this.onInput.bind(this))
        this.$find(`#${this.$uid}-ok[data-obj-type=ok-btn]`)?.addEventListener("click",this.onOk.bind(this))
        this.$find(`#${this.$uid}-cancel[data-obj-type=cancel-btn]`)?.addEventListener("click",this.onCancel.bind(this))
        this.$find(`#${this.$uid}-close`)?.addEventListener("click",this.onClose.bind(this))
    }
    private onInput(event:any){
        this.fvalues[event.target.name] = event.target.value;
        this.$emit("input",event.target.name,event.target.value);
        this.$is_valid(event.target.name);
    }
    private onCancel(){
        this.$emit("cancel");
        this.$close(false)
    }
    private onOk(){
        if(this.$is_valid()){
            this.$emit("ok");
            this.$close(true)
        }
    }
    private onClose(event:any){
        (<any>this.$el).close();
        this.$el.remove();
    }
    public $is_valid(key?:string|undefined):boolean{
        if(typeof this.methods.validator==='function'){
            let res:boolean = true;
            if(typeof key==="string"){
                let msg = this.methods.validator.call(this,key,this.fvalues[key]);
                this.$find(`#${this.$uid}-fieldset-${key}>.error-msg`).textContent = msg
                return msg.length===0;
            }
            else{
                for(let k in this.fvalues){
                    let msg = this.methods.validator.call(this,k,this.fvalues[k]);
                    this.$find(`#${this.$uid}-fieldset-${k}>.error-msg`).textContent = msg
                    res &&= msg.length===0;
                }
            }
            return res
        }
        return true;
    }
    public $open(){
        this.$attach(document.body);
        (<any>this.$el).showModal();
        this.$emit("open");
    }
    public $close(result:boolean=false){
        (<any>this.$el).close();
        this.$el.remove();
        if(result)
            this.$emit("done",true,this.fvalues);
        else
            this.$emit("done",false);
    }
}
