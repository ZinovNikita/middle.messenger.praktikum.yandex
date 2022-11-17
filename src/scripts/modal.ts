import {ComponentOptions,Component} from "./component";
export default class Modal extends Component{
    private fvalues:{[id:string]:unknown} = {};
    private form:any;
    private okBtn:any;
    private cancelBtn:any;
    constructor(options?:ComponentOptions){
        super(`
<header class="modal-title"><h3>{{title}}</h3></header>
<form id="{{uid}}-form" data-obj-type="modal-form">
{{#fields}}
    {{#if readonly}}
        {{#if show}}
            <fieldset class="show-field">
                <span class="show-item left">{{label}}</span>
                <span class="show-item right">{{value}}</span>
            </fieldset>
        {{/if}}
    {{else}}
        <fieldset>
            <label>{{label}}</label>
            <input data-obj-type="field" type="{{type}}" name="{{name}}" placeholder="{{label}}"/>
        </fieldset>
    {{/if}}
{{/fields}}
</form>
<footer class="modal-footer">
    <button id="{{uid}}-cancel" data-obj-type="cancel-btn">{{cancel_title}}</button>
    <button id="{{uid}}-ok" data-obj-type="ok-btn">{{ok_title}}</button>
</footer>`,'dialog',options)
        this.$on("input",this.onInput);
        this.$on("ok",this.onOk);
        this.$on("cancel",this.onCancel);
        this.form = this.$el.querySelector(`#${this.uid}-form`);
        this.form.addEventListener("input",(event:any)=>{
            this.$emit("input",event.target.name,event.target.value);
        })
        this.okBtn = this.$el.querySelector(`#${this.uid}-ok[data-obj-type=ok-btn]`);
        this.okBtn.addEventListener("click",(event:any)=>{
            this.$emit("ok",event.target.name,event.target.value);
        })
        this.cancelBtn = this.$el.querySelector(`#${this.uid}-cancel[data-obj-type=cancel-btn]`);
        this.cancelBtn.addEventListener("click",(event:any)=>{
            this.$emit("cancel",event.target.name,event.target.value);
        })
    }
    private onInput(name:string,value:any){
        this.fvalues[name] = value;
    }
    private onOk(name:string,value:any){
        console.log(this.fvalues);
    }
    private onCancel(name:string,value:any){
        console.log(this.fvalues);
    }
}
