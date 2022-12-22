import Component from './component';
import Modal from '../components/modal';
import api from '../api';
const sidebarTemplate:string = `
<form class="search-box inline" {{on 'submit' 'onSearch'}} >
    <input type="text" name="chatSearch" class="search-input" placeholder="Поиск" value="{{chatSearch}}"/>
    <button type="button" title="Архив" {{on 'click' 'toogleArchive'}}>{{#if archive}}&check;{{else}}&cross;{{/if}} архив</button>
    <img alt="Профиль" title="Профиль" class="profile-image" src="{{resourceUrl avatar}}" {{on 'click' 'openProfile'}}/>
    <sup class="logout" {{on 'click' 'logoutProfile'}} title="Выйти из приложения">&#8855;</sup>
</form>
<ul class="chat-list">
{{#chats}}
    <li class="chat-item {{#if_eq id ../activeId}}active{{/if_eq}}" {{on 'click' 'chatSelect' id}}>
        <img alt="Аватар {{title}}" class="chat-image" src="{{resourceUrl avatar}}"/>
        <div class="chat-text">
            <b class="chat-title">
                {{title}}
            {{#if unread_count}}
                ({{unread_count}})
            {{/if}}
            </b>
        {{#if last_message}}
            <span class="mutted">{{last_message.content}}</span>
        {{/if}}
        </div>
    </li>
{{/chats}}
</ul>
<button class="btn-circle btn-dark new-chat-btn" {{on 'click' 'createNewChat'}}>&plus;</button>`;
export default class Sidebar extends Component {
    constructor (events:ObjFunc = {}) {
        super(sidebarTemplate,'nav',{
            props: { className: 'sidebar' },
            events: {
                ...events,
                'load-chat-list': () => {
                    api.chats.$chat_list().then(() => {
                        this.data.chats = this.$store.$get('chat_list')
                    })
                }
            }
        });
        this.profileEditModal = new Modal({
            data: {
                title: 'Профиль',
                readonly: false,
                fields: [],
                ok_title: 'Сохранить',
                cancel_title: 'Отмена',
                buttons: [{
                    class: '',
                    event: 'change-password',
                    title: 'Сменить пароль'
                }]
            },
            events: {
                done: (result:boolean,fvalues?:Obj|undefined) => {
                    // update profile on server
                    console.log('Профиль',result,fvalues);
                },
                open: () => {
                    this.profileEditModal.data.fields = [];
                    api.auth.$user().then((res:any) => {
                        this.profileEditModal.data.fields = [
                            { label: 'Аватар', type: 'avatar', name: 'avatar', value: res.avatar },
                            { label: 'Имя', type: 'text', name: 'first_name', value: res.first_name },
                            { label: 'Фамилия', type: 'text', name: 'second_name', value: res.second_name },
                            { label: 'Псевдоним', type: 'text', name: 'display_name', value: res.display_name },
                            { label: 'Логин', type: 'text', name: 'login', value: res.login },
                            { label: 'Email', type: 'email', name: 'email', value: res.email },
                            { label: 'Телефон', type: 'tel', name: 'phone', value: res.phone }
                        ]
                    })
                },
                'select-avatar': () => {
                    this.data.avatar = this.avatar
                },
                'change-password': () => {
                    this.profileEditModal.$close()
                    this.passwordModal.$attach()
                }
            },
            methods: {
                validator (key:string|undefined) {
                    const checkFields = (name:string,value:string):string => {
                        if (name === 'first_name' || name === 'second_name') {
                            if (!value ||
                            value.length === 0 ||
                            (value.match(/[A-Za-z]/) && value.match(/[А-Яа-яЁё]/)) ||
                            !value.match(/^[A-ZА-ЯЁ]/) ||
                            value.match(/[^A-Za-zА-Яа-яЁё\-]/)) {
                                return 'латиница или кириллица, первая буква должна быть заглавной, без пробелов и без цифр, допустим только дефис.';
                            }
                        } else if (name === 'login') {
                            if (!value ||
                            value.length < 3 ||
                            value.length > 20 ||
                            value.match(/[^A-Za-z0-9\-\_]/) ||
                            !value.match(/[^0-9]/)) {
                                return 'от 3 до 20 символов, латиница, может содержать цифры, но не состоять из них, без пробелов, допустимы дефис и нижнее подчёркивание';
                            }
                        } else if (name === 'email') {
                            if (!value || !value.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                                return 'укажите корректный Email';
                            }
                        } else if (name === 'phone') {
                            if (!value ||
                            value.length < 10 ||
                            value.length > 15 ||
                            !value.match(/^(\+|\d)([\d].?)\d/g)) {
                                return 'от 10 до 15 символов, состоит из цифр, может начинается с плюса.'
                            }
                        }
                        return '';
                    }
                    return new Promise((resolve:Function) => {
                        if (typeof key !== 'undefined' && key.length > 0) {
                            const msg:string = checkFields(key,<string>(<any> this.fvalues)[key]);
                            this.$field_error(key,msg);
                            resolve(msg.length === 0);
                        } else {
                            let success:boolean = true;
                            for (const k in this.fvalues) {
                                const msg:string = checkFields(k,<string>(<any> this.fvalues)[k]);
                                success &&= msg.length === 0;
                                this.$field_error(k,msg)
                            }
                            if (success) {
                                api.users.$profile(this.fvalues).then(() => { resolve(true) }).catch(() => { resolve(false) })
                            } else { resolve(success); }
                        }
                    })
                }
            }
        });
        this.passwordModal = new Modal({
            data: {
                title: 'Сменить пароль',
                readonly: false,
                fields: [
                    { label: 'Старый пароль', type: 'password', name: 'oldPassword' },
                    { label: 'Новый пароль', type: 'password', name: 'newPassword' }
                ],
                ok_title: 'Сохранить',
                cancel_title: 'Отмена'
            },
            events: {
                done: (result:boolean,fvalues?:Obj|undefined) => {
                    // update profile on server
                    console.log('Профиль',result,fvalues);
                }
            },
            methods: {
                validator (this:Modal,key:string|undefined) {
                    const checkFields = (name:string,value:string):string => {
                        if (name === 'oldPassword' || name === 'newPassword') {
                            if (!value ||
                        value.length < 8 ||
                        value.length > 40 ||
                        !value.match(/[A-Z]/) ||
                        !value.match(/[^0-9]/)) {
                                return 'от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра';
                            }
                            if (this.fvalues.oldPassword === this.fvalues.newPassword) { return 'Пароли совпадают'; }
                        }
                        return '';
                    }
                    return new Promise((resolve:Function) => {
                        if (typeof key !== 'undefined' && key.length > 0) {
                            const msg:string = checkFields(key,<string>(<any> this.fvalues)[key]);
                            this.$field_error(key,msg);
                            resolve(msg.length === 0);
                        } else {
                            let success:boolean = true;
                            for (const k in this.fvalues) {
                                const msg:string = checkFields(k,<string>(<any> this.fvalues)[k]);
                                success &&= msg.length === 0;
                                this.$field_error(k,msg)
                            }
                            if (success) {
                                api.users.$password(this.fvalues).then(() => { resolve(true) }).catch(() => { resolve(false) })
                            } else { resolve(success); }
                        }
                    })
                }
            }
        });
        this.data.avatar = this.avatar
        this.$emit('load-chat-list')
    }

    private get avatar () {
        return this.$currentUser?.avatar || ''
    }

    private profileEditModal:Modal;
    private passwordModal:Modal;
    private activate (id:number) {
        this.data.activeId = id
    }

    // @ts-ignore - used after template compilation from element events
    private onSearch (event:Event) {
        event.preventDefault();
        const str = (<HTMLFormElement>event.target).chatSearch.value;
        api.chats.$chat_list(0,str,this.data.archive === true).then(() => {
            this.data.chats = this.$store.$get('chat_list')
            this.data.chatSearch = str
        })
    }

    // @ts-ignore - used after template compilation from element events
    private openProfile () {
        this.profileEditModal.$attach()
    }

    // @ts-ignore - used after template compilation from element events
    private logoutProfile () {
        api.auth.$logOut().then(() => {
            this.$router.$go('/')
        });
    }

    // @ts-ignore - used after template compilation from element events
    private chatSelect (event:Event,chId:number) {
        this.activate(chId);
        this.$emit('chat-open',chId,this.data.archive)
    }

    // @ts-ignore - used after template compilation from element events
    private toogleArchive (event:Event) {
        event.preventDefault();
        this.data.archive = !this.data.archive;
        api.chats.$chat_list(0,'',this.data.archive === true).then(() => {
            this.data.chats = this.$store.$get('chat_list')
            this.data.chatSearch = ''
        })
    }

    // @ts-ignore - used after template compilation from element events
    private createNewChat () {
        let title;
        while (title === null || title === undefined || title === '') { title = prompt('Укажите название чата'); }
        api.chats.$create(title).then(() => {
            this.data.chats = this.$store.$get('chat_list')
        })
    }
}
