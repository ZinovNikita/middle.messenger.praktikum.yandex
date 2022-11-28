import Component from '../components/component';
import Modal from './modal';
const chatTemplate:string = `
<header class="chat-header">
<a aria-label="Информация о собеседнике" id="profile-info" style="display:flex;" {{on 'click' 'openProfileInfo' '#profile-info'}}>
    <img alt="Аватар собеседника" class="chat-image" src="{{avatar}}"/>
    <b style="align-self: center;font-size:18px">{{first_name}} {{second_name}}</b>
</a>
</header>
<main id="{{uid}}-message-list" class="chat-messages">
{{#messages}}
    {{#if my}}
    <article class="message-block right">
    {{else}}
    <article class="message-block left">
    {{/if}}
    <div class="message-item">
        <b class="message-title">{{title}}</b>
        <div class="message-images">
        {{#images}}
            <img alt="{{alt}}" src="{{url}}"/>
        {{/images}}
        </div>
        <div class="message-body">{{body}}</div>
        <small class="message-time">{{time}}</small>
    </div>
</article>
{{/messages}}
</main>
<footer class="chat-input-box">
    <div class="chat-input-images">
    {{#images}}
        <img alt="{{alt}}" src="{{url}}"/>
    {{/images}}
    </div>
    <form id="message-form" class="inline" {{on 'submit' 'sendMessage' '#message-form'}}>
        <textarea {{on 'input' 'onInput' '#message-form>textarea'}} name="message" placeholder="Сообщение">{{message}}</textarea>
        <label class="image-files">
            &equiv;
            <input id="file-images" {{on 'change' 'addFile' '#file-images'}} name="images" type="file" multiple accept="image/*"/>
        </label>
        <input type="submit" disabled value="Отправить"/>
    </form>
</footer>`;
const messages:{[id:string]:Obj[]} = {
    1: [{
        title: 'Иванов Иван',
        body: 'Text1',
        time: new Date().toLocaleTimeString(),
        images: [{
            alt: 'foto1',
            url: `https://thispersondoesnotexist.com/image?q=${new Date().getTime()}`
        }],
        my: false
    },{
        title: 'Зинов Никита',
        body: 'Text2',
        time: new Date().toLocaleTimeString(),
        images: [{
            alt: 'foto2',
            url: `https://thispersondoesnotexist.com/image?q=${new Date().getTime()}`
        }],
        my: true
    }],
    2: []
}
export default class Chat extends Component {
    constructor () {
        super(chatTemplate,'div',{
            props: { className: 'chat-box' },
            events: {
                'html-update': function (this: Chat) {
                    const el = this.$find(`#${this.$uid}-message-list`);
                    if (el !== null) {
                        el.scrollTo(0,el.scrollHeight);
                    }
                },
                open (this: Chat,chat: Obj) {
                    this.$el.innerHTML = '';
                    this.message = '';
                    Object.assign(this.data, chat);
                    Object.assign(this.data, {
                        messages: [],
                        message: '',
                        images: []
                    });
                    setTimeout(() => {
                    // loading messages from server
                        const msgs:Obj[] = messages[chat.id as keyof typeof messages];
                        this.messages = new Proxy(msgs,{
                            get: (target:any, prop:string) => {
                                if (prop === 'push') {
                                    this.data.messages = target.sort((a:Obj,b:Obj) => {
                                        if (a > b) return 1;
                                        else if (a < b) return -1;
                                        return 0;
                                    });
                                }
                                return target[prop];
                            },
                            set: (target:any, prop:string,val:any) => {
                                target[prop] = val;
                                this.data.messages = target;
                                return true;
                            }
                        })
                        Object.assign(this.messages,msgs);
                    },500)
                }
            }
        });
        this.profileInfoModal = new Modal({
            data: {
                title: 'Профиль',
                readonly: true,
                fields: [],
                ok_title: 'Сохранить',
                cancel_title: 'Отмена'
            },
            events: {
                open (this: Chat) {
                    this.profileInfoModal.data.fields = [];
                    setTimeout(() => {
                        this.profileInfoModal.data.fields = [
                            { label: 'Аватар', type: 'avatar', name: 'avatar', value: this.data.avatar },
                            { label: 'Имя', type: 'text', name: 'first_name', value: this.data.first_name },
                            { label: 'Фамилия', type: 'text', name: 'second_name', value: this.data.second_name },
                            { label: 'Email', type: 'email', name: 'email', value: this.data.email },
                            { label: 'Телефон', type: 'tel', name: 'phone', value: this.data.phone }
                        ]
                    },500)
                }
            }
        });
    }

    private messages: Obj[] = [];
    private message: string = '';
    private profileInfoModal: Modal;
    // @ts-ignore - used after template compilation from element events
    private openProfileInfo () {
        this.profileInfoModal.$open();
    }

    private fileToBase64 (files:FileList) {
        return new Promise<Obj[]>((resolve) => {
            const images:Obj[] = [];
            const fileLoader = (i:number) => {
                if (i >= files.length) { return resolve(images) }
                const reader = new FileReader();
                const f = files.item(i);
                if (f !== null) {
                    const url = URL.createObjectURL(f);
                    reader.readAsDataURL(f);
                    reader.onload = () => {
                        images.push({
                            alt: f?.name,
                            url,
                            data: reader.result
                        });
                        fileLoader(i + 1);
                    };
                    reader.onerror = () => {
                        fileLoader(i + 1);
                    };
                } else { fileLoader(i + 1); }
            }
            fileLoader(0);
        });
    }

    // @ts-ignore - used after template compilation from element events
    private sendMessage (event:Event) {
        event.preventDefault();
        const form = <HTMLFormElement>event.target;
        console.log('Сообщение',{
            message: form.message.value,
            images: this.data.images
        });
        setTimeout(() => {
            // send to server
            this.messages.push({
                title: 'Зинов Никита',
                body: form.message.value,
                time: new Date().toLocaleTimeString(),
                images: this.data.images,
                my: true
            })
            this.data.images = [];
            this.data.message = '';
        })
    }

    // @ts-ignore - used after template compilation from element events
    private onInput (event:Event) {
        const msg:string = (<HTMLTextAreaElement>event.target).value;
        if (this.message !== msg) { this.message = msg; }
        // message validation
        (<HTMLInputElement> this.$find('#message-form>input[type=submit]')).disabled = (msg.length === 0);
    }

    // @ts-ignore - used after template compilation from element events
    private addFile (event:Event) {
        this.fileToBase64(<FileList>(<any>event.target).files).then((images:Obj[]) => {
            Object.assign(this.data,{ images,message: this.message });
            // message validation
            (<HTMLInputElement> this.$find('#message-form>input[type=submit]')).disabled = (this.message.length === 0);
        })
    }
}
