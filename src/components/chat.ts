import api from '../api';
import Component from '../components/component';
import Modal from './modal';
import Socket from '../utils/socket';
const chatTemplate:string = `
<header class="chat-header">
<a aria-label="Информация о собеседнике" id="profile-info" style="display:flex;">
    <img alt="Аватар чата" class="chat-image" src="{{resourceUrl avatar}}"/>
    <b style="align-self: center;font-size:18px">{{title}}</b>
</a>
<button class="chat-settings btn-dark" {{on 'click' 'toggleSettings'}}>
{{#if showSettings}}&times;{{else}}&equiv;{{/if}}
</button>
</header>
{{#if showSettings}}
<settings class="settings">
{{#if archive}}
<button title="Разархивировать чат" {{on 'click' 'unarchiveChat' id}}>Разархивировать</button>
{{else}}
<button title="Архивировать чат" {{on 'click' 'archiveChat' id}}>Архивировать</button>
{{/if}}
<button title="Удалить чат" {{on 'click' 'deleteChat' id}}>Удалить</button>
<label title="Выбрать аватар" class="btn">
    <input type="file" accept="image/*" {{on 'change' 'changeAvatar' id}}/>
    Выбрать аватар
</label><br><br>
<label>Список пользователей:</label>
<form class="inline" {{on 'submit' 'searchUsers'}} style="max-width:300px">
    <input type="text" name="searchLogin" value="{{searchLogin}}" placeholder="Логин">
    <button type="submit">Найти</button>
</form>
<ul class="user-list">
{{#userSearch}}
    <li>
    {{#if_eq id ../created_by}}{{else}}
        <a {{on 'click' 'openProfileInfo' id}}>
            <img alt="Аватар собеседника" class="chat-image" src="{{resourceUrl avatar}}"/>
            <span>{{display_name}} ({{login}})</span>
        </a>
        <button title="Включить пользователя" {{on 'click' 'includeUser' id}}>&oplus;</button>
    {{/if_eq}}
    </li>
{{/userSearch}}
Уже состоят в чате:
{{#users}}
    <li>
    {{#if_eq id ../created_by}}
        <a>
            <img alt="Аватар собеседника" class="chat-image" src="{{resourceUrl avatar}}"/>
            <span>{{display_name}} ({{role}})</span>
        </a>
    {{else}}
        <a {{on 'click' 'openProfileInfo' id}}>
            <img alt="Аватар собеседника" class="chat-image" src="{{resourceUrl avatar}}"/>
            <span>{{display_name}} ({{role}})</span>
        </a>
        <button title="Исключить пользователя" {{on 'click' 'excludeUser' id}}>&otimes;</button>
    {{/if_eq}}
    </li>
{{/users}}
</ul>
</settings>
{{else}}
<main id="{{uid}}-message-list" class="chat-messages">
{{#messages}}
    <article class="message-block {{#if_eq user_id ../currentUserId}}right{{else}}left{{/if_eq}}">
        <div class="message-item">
            <b class="message-title">{{title}}</b>
        {{#if_eq type 'file'}}
            <div class="message-images">
            {{#file}}
                <img alt="{{filename}}" src="{{resourceUrl path}}"/>
            {{/file}}
            </div>
        {{else}}
            <div class="message-body">{{content}}</div>
        {{/if_eq}}
            <small class="message-time">{{msgTime time}}</small>
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
    <form id="message-form" class="inline" {{on 'submit' 'sendMessage'}}>
        <textarea {{on 'input' 'onInput'}} name="message" placeholder="Сообщение">{{message}}</textarea>
        <label class="image-files">
            &equiv;
            <input id="file-images" {{on 'change' 'addFile'}} name="images" type="file" multiple accept="image/*"/>
        </label>
        <input type="submit" disabled value="Отправить"/>
    </form>
</footer>
{{/if}}`;
export default class Chat extends Component {
    constructor (events:ObjFunc = {}) {
        super(chatTemplate,'div',{
            props: { className: 'chat-box' },
            events: {
                ...events,
                'html-update': () => {
                    this.$emit('scrollEnd');
                },
                scrollEnd: () => {
                    const el = this.$find(`#${this.$uid}-message-list`);
                    if (el !== null) {
                        el.scrollTo(0,el.scrollHeight);
                    }
                },
                open: (chat: Obj,archive:boolean) => {
                    console.log(chat);
                    this.$el.innerHTML = '';
                    this.message = '';
                    this.chatId = chat.id
                    Object.assign(this.data, Object.assign(chat, {
                        messages: [],
                        message: '',
                        images: [],
                        users: [],
                        showSettings: false,
                        archive
                    }));
                    api.chats.$token(this.chatId).then((r)=>{
                        if(this.$currentUser===null) return;
                        this.data.currentUserId = this.$currentUser.id;
                        this.socket = new Socket(this.$currentUser.id,this.chatId,r.token);
                        this.socket.addEventListener("open",()=>{
                            this.socket.$getMessages(0).then((res)=>{
                                this.data.messages = res;
                                console.log(this.data.messages)
                            }).catch(console.error)
                        })
                    })
                }
            }
        });
        this.$addHelper('msgTime', (time:string) => {
            let msgDate = new Date(time);
            let today = new Date()
            if(today.toDateString() === msgDate.toDateString())
                return msgDate.toLocaleTimeString()
            return msgDate.toLocaleString();
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
                open: () => {
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
    private chatId: number = 0;
    private socket: Socket;
    private profileInfoModal: Modal;
    // @ts-ignore - used after template compilation from element events
    private openProfileInfo () {
        this.profileInfoModal.$open();
    }

    // @ts-ignore - used after template compilation from element events
    private sendMessage (event:Event) {
        event.preventDefault();
        const form = <HTMLFormElement>event.target;
        this.socket.$sendMessage(form.message.value).then((res)=>{
            this.data.messages.push(res);
        }).catch(console.error)
    }

    // @ts-ignore - used after template compilation from element events
    private addFile (event:Event) {
        let files = (<HTMLInputElement>event.target).files;
        if(files===null) return;
        api.resources.$add(files[0]).then((r:Obj)=>{
            this.socket.$sendImage(r.id).then((res)=>{
                this.data.messages.push(res);
            })
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
    private archiveChat (event:Event,chatId:number) {
        api.chats.$archive(chatId).then((chat:Obj) => {
            Object.assign(this.data, chat);
            this.$emit('update-chat-list');
        })
    }

    // @ts-ignore - used after template compilation from element events
    private unarchiveChat (event:Event,chatId:number) {
        api.chats.$unarchive(chatId).then((chat:Obj) => {
            Object.assign(this.data, chat);
            this.$emit('update-chat-list');
        })
    }

    // @ts-ignore - used after template compilation from element events
    private deleteChat (event:Event,chatId:number) {
        api.chats.$delete(chatId)
    }

    // @ts-ignore - used after template compilation from element events
    private changeAvatar (event:Event,chatId:number) {
        const tg:HTMLInputElement = <HTMLInputElement>event.target
        if (!tg || !tg.files) return
        api.chats.$avatar(chatId, tg.files[0]).then((chat:Obj) => {
            Object.assign(this.data, chat);
            this.$emit('update-chat-list');
        })
    }

    // @ts-ignore - used after template compilation from element events
    private toggleSettings () {
        this.data.showSettings = !this.data.showSettings;
        if (this.data.showSettings === true) {
            api.chats.$users(this.chatId).then((res:Obj[]) => {
                this.data.users = res;
            })
        }
    }

    // @ts-ignore - used after template compilation from element events
    private searchUsers (event:Event) {
        event.preventDefault();
        const login = (<HTMLFormElement>event.target).searchLogin.value;
        if (!login || login.length === 0) { this.data.userSearch = [] } else {
            api.users.$search(login).then((res:Obj[]) => {
                this.data.userSearch = res;
                this.data.searchLogin = login;
                (<HTMLInputElement>event.target).focus()
            })
        }
    }

    // @ts-ignore - used after template compilation from element events
    private includeUser (event:Event,userId:number) {
        event.preventDefault();
        api.chats.$includeUser(this.chatId,[userId]).then(() => {
            this.data.userSearch = this.data.userSearch.filter(u => u.id !== userId)
            api.chats.$users(this.chatId).then((res:Obj[]) => {
                this.data.users = res;
            })
        })
    }

    // @ts-ignore - used after template compilation from element events
    private excludeUser (event:Event,userId:number) {
        event.preventDefault();
        api.chats.$excludeUser(this.chatId,[userId]).then(() => {
            api.chats.$users(this.chatId).then((res:Obj[]) => {
                this.data.users = res;
            })
        })
    }
}
