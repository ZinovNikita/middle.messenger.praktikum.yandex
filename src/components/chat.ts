import Component from '../components/component';
const chatTemplate:string = `
<header class="chat-header">
<a aria-label="Информация о собеседнике" id="profile-info-btn" style="display:flex;">
    <img alt="Аватар собеседника" class="chat-image" src="{{url_img}}"/>
    <b style="align-self: center;font-size:18px">{{title}}</b>
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
    <form id="{{uid}}-message-form" class="inline">
        <textarea name="message" placeholder="Сообщение">{{message}}</textarea>
        <label class="image-files">&equiv;<input name="images" type="file" multiple accept="image/*"/></label>
        <input type="submit" disabled value="Отправить"/>
    </form>
</footer>`;
const messages:{[id:string]:obj[]} = {
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
        super(chatTemplate,'div',{ props: { className: 'chat-box' } });
        this.$on('open',this.load)
        this.$on('html-update', this.setLogic.bind(this));
    }

    private messages: obj[] = [];
    private message: string = '';
    private fileToBase64 (files:FileList) {
        return new Promise<obj[]>((resolve) => {
            const images:obj[] = [];
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

    private scrollEnd () {
        let el = this.$find(`#${this.$uid}-message-list`);
        if(el!==null){
            el.scrollTo(0,el.scrollHeight);
        }
    }

    private setLogic () {
        this.$find(`#${this.$uid}-message-form`)?.addEventListener('submit',this.sendMessage.bind(this));
        this.$find(`#${this.$uid}-message-form input[type=file]`)?.addEventListener('change',(event:Event) => {
            console.log(this.data);
            this.fileToBase64(<FileList>(<any>event.target).files).then((images:obj[]) => {
                Object.assign(this.data,{ images,message: this.message });
                (<HTMLInputElement> this.$find(`#${this.$uid}-message-form input[type=submit]`)).disabled = (this.message.length === 0);
            })
        });
        this.$find(`#${this.$uid}-message-form > textarea`)?.addEventListener('input',(event:Event) => {
            const msg:string = (<HTMLTextAreaElement>event.target).value;
            if (this.message !== msg) { this.message = msg; }
            // message validation
            (<HTMLInputElement> this.$find(`#${this.$uid}-message-form input[type=submit]`)).disabled = (msg.length === 0);
        });
        this.scrollEnd();
    }

    private load (chat: obj) {
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
            const msgs:obj[] = messages[chat.id as keyof typeof messages];
            this.messages = new Proxy(msgs,{
                get: (target:any, prop:string) => {
                    if (prop === 'push') {
                        this.data.messages = target.sort((a:obj,b:obj) => {
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
