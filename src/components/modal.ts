import Component from './component';
import api from '../api';
const modalTemplate:string = `
<header class="modal-title">
    <h3>{{title}}</h3>
    <i class="modal-close" {{on 'click' 'onClose'}}>&times;</i>
</header>
<form class="modal-body" {{on 'focusin' 'onFocus'}} {{on 'focusout' 'onFocus'}} {{on 'blur' 'onFocus'}} {{on 'focus' 'onFocus'}}>
{{#fields}}
    {{#if ../readonly}}
        {{#if_eq type 'avatar'}}
        <fieldset id="{{../uid}}-fieldset-{{name}}">
            <label class="avatar-image">
                <img src="{{resourceUrl value}}"/>
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
                <input type="file" accept="image/*" name="{{name}}" {{on 'change' 'onSelectAvatar'}}/>
                <img src="{{resourceUrl value}}"/>
            </label>
            <small class="error-msg"></small>
        </fieldset>
        {{else}}
        <fieldset id="{{../uid}}-fieldset-{{name}}">
            <label>{{label}}</label>
            <input type="{{type}}" name="{{name}}" placeholder="{{label}}" value="{{value}}"/>
            <small class="error-msg"></small>
        </fieldset>
        {{/if_eq}}
    {{/if}}
{{/fields}}
</form>
{{#if_eq readonly false}}
<footer class="modal-footer">
{{#buttons}}
    <button class="{{class}}" {{on 'click' 'onButton'}} event="{{event}}">{{title}}</button>
{{/buttons}}
    <button class="btn-red" {{on 'click' 'onCancel'}}>{{cancel_title}}</button>
    <button {{on 'click' 'onOk'}}>{{ok_title}}</button>
</footer>
{{/if_eq}}`;
export default class Modal extends Component {
    constructor (options:ComponentOptionsType) {
        options.events = Object.assign({},options.events)
        options.events = Object.assign(options.events,{
            'html-update': () => {
                (<Obj[]> this.data.fields).forEach((f:Obj) => {
                    this.fvalues[f.name as keyof Obj] = f.value;
                })
                this.$emit('mounted');
            },
            attach: () => {
                if (!(<HTMLDialogElement> this.$el).open) { (<HTMLDialogElement> this.$el).showModal(); }
                this.$emit('open');
            }
        });
        super(modalTemplate,'dialog', options);
        (<HTMLDialogElement> this.$el).close();
        this.props.className = 'modal';
        this.$emit('html-update');
    }

    public fvalues: Obj = {};

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
    private onButton (event:any) {
        this.$emit(event.target.getAttribute('event'));
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
        api.users.$avatar(event.target.files[0]).then((url:string) => {
            this.$find(`#${this.$uid}-fieldset-avatar img`)?.setAttribute('src',url);
            this.fvalues.avatar = url;
            this.$emit('input','avatar',url);
            this.$emit('select-avatar')
        });
    }

    public $field_error (key:string,msg:string = '') {
        const tmp = this.$find(`#${this.$uid}-fieldset-${key}>.error-msg`);
        if (tmp !== null) { tmp.textContent = msg; }
    }

    public $is_valid (key:string|undefined = undefined):Promise<boolean> {
        if (key === undefined) {
            for (const k in this.fvalues) {
                const tmp:any = this.$find(`*[name="${k}"]`);
                if (tmp !== null) {
                    this.fvalues[tmp.name] = tmp.value;
                    this.$emit('input',tmp.name,tmp.value);
                }
            }
        }
        if (typeof this.methods.validator === 'function') { return this.methods.validator.call(this,key); } else {
            return new Promise((resolve:Function) => {
                for (const k in this.fvalues) { this.$field_error(k); }
                resolve({ success: true });
            })
        }
    }

    public $attach () {
        document.body.appendChild(this.$el);
        this.$emit('attach');
    }

    public $close (result:boolean = false) {
        (<HTMLDialogElement> this.$el).close();
        this.$el.remove();
        if (result) { this.$emit('done',true,this.fvalues); } else { this.$emit('done',false); }
    }
}
