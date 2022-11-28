import Component from './component';
const modalTemplate:string = `
<header class="modal-title">
    <h3>{{title}}</h3>
    <i id="{{uid}}-close" class="modal-close"
        {{on 'click' 'onClose' 'i.modal-close'}}>&times;</i>
</header>
<form id="{{uid}}-form" data-obj-type="modal-form"
    {{on 'focusin' 'onFocus' 'form[data-obj-type="modal-form"]'}}
    {{on 'focusout' 'onFocus' 'form[data-obj-type="modal-form"]'}}
    {{on 'blur' 'onFocus' 'form[data-obj-type="modal-form"]'}}
    {{on 'focus' 'onFocus' 'form[data-obj-type="modal-form"]'}}>
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
            <input data-obj-type="file-avatar" type="{{type}}" name="{{name}}" placeholder="{{label}}" value="{{value}}"
                {{on 'change' 'onSelectAvatar' 'input[data-obj-type="file-avatar"]'}}/>
            <small class="error-msg"></small>
        </fieldset>
        {{/if_eq}}
    {{/if}}
{{/fields}}
</form>
<footer class="modal-footer">
    <button id="{{uid}}-cancel" class="btn-red" data-obj-type="cancel-btn"
        {{on 'click' 'onCancel' 'button[data-obj-type="cancel-btn"]'}}>{{cancel_title}}</button>
    <button id="{{uid}}-ok" data-obj-type="ok-btn"
        {{on 'click' 'onOk' 'button[data-obj-type="ok-btn"]'}}>{{ok_title}}</button>
</footer>`;
export default class Modal extends Component {
    constructor (options:ComponentOptionsType) {
        if (!options.events) { options.events = {}; }
        options.events['html-update'] = function (this:Modal) {
            (<Obj[]> this.data.fields).forEach((f:Obj) => {
                this.fvalues[f.name as keyof Obj] = f.value;
            })
            this.$emit('mounted');
        }
        super(modalTemplate,'dialog', options);
        this.props.className = 'modal';
        this.$emit('html-update');
    }

    private fvalues: Obj = {};

    // @ts-ignore - used after template compilation from element events
    private onFocus (event:any) {
        this.fvalues[event.target.name] = event.target.value;
        this.$emit('input',event.target.name,event.target.value);
        this.$is_valid(event.target.name);
    }

    // @ts-ignore - used after template compilation from element events
    private onCancel () {
        this.$emit('cancel');
        this.$close(false)
    }

    // @ts-ignore - used after template compilation from element events
    private onOk () {
        this.$is_valid().then((success:boolean) => {
            if (success === true) {
                this.$emit('ok');
                this.$close(true)
            }
        })
    }

    // @ts-ignore - used after template compilation from element events
    private onClose () {
        (<any> this.$el).close();
        this.$el.remove();
    }

    // @ts-ignore - used after template compilation from element events
    private onSelectAvatar (event:any) {
        this.$emit('select-avatar',event)
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
