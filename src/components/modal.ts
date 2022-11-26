import Component from './component';
const modalTemplate:string = `
<header class="modal-title">
    <h3>{{title}}</h3>
    <i id="{{uid}}-close" class="modal-close">&times;</i>
</header>
<form id="{{uid}}-form" data-obj-type="modal-form">
{{#fields}}
    {{#if ../readonly}}
        {{#if_eq type 'avatar'}}
        <fieldset id="{{../uid}}-fieldset-{{name}}">
            <label class="avatar-image">
                <img data-obj-type="image" src="{{value}}"/>
            </label>
        </fieldset>
        {{else}}
        <fieldset class="show-field" id="{{../uid}}-fieldset-{{name}}">
            <span class="show-item left">{{label}}</span>
            <span class="show-item right">{{value}}</span>
        </fieldset>
        {{/if_eq}}
    {{else}}
        {{#if_eq type 'avatar'}}
        <fieldset id="{{../uid}}-fieldset-{{name}}">
            <label>{{label}}</label>
            <label class="avatar-image">
                <input data-obj-type="field" type="file" accept="image/*" name="{{name}}"/>
                <img data-obj-type="image" src="{{value}}"/>
            </label>
            <small class="error-msg"></small>
        </fieldset>
        {{else}}
        <fieldset id="{{../uid}}-fieldset-{{name}}">
            <label>{{label}}</label>
            <input data-obj-type="field" type="{{type}}" name="{{name}}" placeholder="{{label}}" value="{{value}}"/>
            <small class="error-msg"></small>
        </fieldset>
        {{/if_eq}}
    {{/if}}
{{/fields}}
</form>
<footer class="modal-footer">
    <button id="{{uid}}-cancel" class="btn-red" data-obj-type="cancel-btn">{{cancel_title}}</button>
    <button id="{{uid}}-ok" data-obj-type="ok-btn">{{ok_title}}</button>
</footer>`;
export default class Modal extends Component {
    constructor (options?:ComponentOptionsType) {
        super(modalTemplate,'dialog',options);
        this.props.className = 'modal';
        this.$on('html-update',this.onMount.bind(this));
        this.onMount()
    }

    private fvalues: obj = {};
    private onMount () {
        (<obj[]> this.data.fields).forEach((f:obj) => {
            this.fvalues[f.name as keyof obj] = f.value;
        })
        this.$find(`#${this.$uid}-form`)?.addEventListener('focusin',this.onFocus.bind(this))
        this.$find(`#${this.$uid}-form`)?.addEventListener('focusout',this.onFocus.bind(this))
        this.$find(`#${this.$uid}-form`)?.addEventListener('focus',this.onFocus.bind(this))
        this.$find(`#${this.$uid}-form`)?.addEventListener('blur',this.onFocus.bind(this))
        this.$find(`#${this.$uid}-ok[data-obj-type=ok-btn]`)?.addEventListener('click',this.onOk.bind(this))
        this.$find(`#${this.$uid}-cancel[data-obj-type=cancel-btn]`)?.addEventListener('click',this.onCancel.bind(this))
        this.$find(`#${this.$uid}-close`)?.addEventListener('click',this.onClose.bind(this))
    }

    private onFocus (event:any) {
        this.fvalues[event.target.name] = event.target.value;
        this.$emit('input',event.target.name,event.target.value);
        this.$is_valid(event.target.name);
    }

    private onCancel () {
        this.$emit('cancel');
        this.$close(false)
    }

    private onOk () {
        this.$is_valid().then((success:boolean) => {
            if (success === true) {
                this.$emit('ok');
                this.$close(true)
            }
        })
    }

    private onClose () {
        (<any> this.$el).close();
        this.$el.remove();
    }

    public $field_error (key:string,msg:string = '') {
        const tmp = this.$find(`#${this.$uid}-fieldset-${key}>.error-msg`);
        if (tmp !== null) { tmp.textContent = msg; }
    }

    public $is_valid (key:string|undefined = undefined):Promise<boolean> {
        if (typeof this.methods.validator === 'function') { return this.methods.validator.call(this,key); } else {
            return new Promise((resolve:Function) => {
                for (const k in this.fvalues) { this.$field_error(k) }
                resolve({ success: true });
            })
        }
    }

    public $open () {
        this.$attach(document.body);
        (<any> this.$el).showModal();
        this.$emit('open');
    }

    public $close (result:boolean = false) {
        (<any> this.$el).close();
        this.$el.remove();
        if (result) { this.$emit('done',true,this.fvalues); } else { this.$emit('done',false); }
    }
}
