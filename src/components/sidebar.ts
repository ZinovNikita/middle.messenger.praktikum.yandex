import Component from './component';
import Modal from '../components/modal';
const sidebarTemplate:string = `
<form id="{{uid}}-search-form" class="search-box inline">
    <input id="{{uid}}-chat-search" type="text" name="chatSearch" class="search-input" placeholder="Поиск" value="{{chatSearch}}" style="width:68%"/>
    <button type="button" id="{{uid}}-profile-btn" class="profile">Профиль</button>
</form>
<ul id="{{uid}}-chats" class="chat-list">
{{#chats}}
{{#if_include title ../chatSearch}}
    {{#if active}}
    <li id="{{../uid}}-chat-{{id}}" class="chat-item active">
    {{else}}
    <li id="{{../uid}}-chat-{{id}}" class="chat-item">
    {{/if}}
        <img alt="Аватар {{title}}" class="chat-image" src="{{url_img}}"/>
        <div class="chat-text">
            <b class="chat-title">{{title}}</b>
            <span class="mutted">{{last_message}}</span>
        </div>
    </li>
{{/if_include}}
{{/chats}}
</ul>`;
export default class Sidebar extends Component {
    constructor (chats:obj[]) {
        super(sidebarTemplate,'nav',{ props: { className: 'sidebar' },data: { chats } });
        this.$on('html-update', this.setLogic.bind(this));
        this.profileEditModal = new Modal({
            data: {
                title: 'Профиль',
                readonly: false,
                fields: [],
                ok_title: 'Сохранить',
                cancel_title: 'Отмена'
            },
            events: {
                done: this.editProfile.bind(this),
                open (this:Modal) {
                    this.data.fields = [];
                    setTimeout(() => {
                        this.data.fields = [
                            { label: 'Аватар', type: 'avatar', name: 'avatar', value: 'https://thispersondoesnotexist.com/image?q=0' },
                            { label: 'Имя', type: 'text', name: 'first_name', value: 'Никита' },
                            { label: 'Фамилия', type: 'text', name: 'second_name', value: 'Зинов' },
                            { label: 'Логин', type: 'text', name: 'login', value: 'ZinovNA' },
                            { label: 'Email', type: 'email', name: 'email', value: 'email@email.ru' },
                            { label: 'Телефон', type: 'tel', name: 'phone', value: '+79876543210' },
                            { label: 'Старый пароль', type: 'password', name: 'oldPassword' },
                            { label: 'Новый пароль', type: 'password', name: 'newPassword' },
                            { label: 'Подтвердите пароль', type: 'password', name: 'newPassword2' }
                        ]
                        this.$find(`#${this.$uid}-fieldset-avatar input[type=file]`).addEventListener('change',(event:any) => {
                            this.$find(`#${this.$uid}-fieldset-avatar img`).setAttribute('src',URL.createObjectURL(event.target.files[0]));
                        })
                    },500)
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
                        } else if (name === 'oldPassword') {
                            if (!value ||
                            value.length < 8 ||
                            value.length > 40 ||
                            !value.match(/[A-ZА-ЯЁ]/) ||
                            !value.match(/[^0-9]/)) {
                                return 'от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра';
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
                                setTimeout(() => {
                                // checkPassword on Server
                                    resolve(true);
                                },1000)
                            } else { resolve(success); }
                        }
                    })
                }
            }
        });
    }

    private profileEditModal:Modal;
    private activate (id:number|string) {
        this.data.chats = (<obj[]> this.data.chats).map((ch:obj) => {
            return { ...ch,active: (ch.id === id) }
        })
    }

    private onSearch (event:Event) {
        event.preventDefault();
        this.data.chatSearch = (<HTMLFormElement>event.target).chatSearch.value;
    }

    private openProfile () {
        this.profileEditModal.$open()
    }

    private setLogic () {
        this.$find(`#${this.$uid}-search-form`)?.addEventListener('submit',this.onSearch.bind(this));
        this.$find(`#${this.$uid}-profile-btn`)?.addEventListener('click',this.openProfile.bind(this));
        (<obj[]> this.data.chats).forEach((ch:obj) => {
            if (!this.data.chatSearch || (<string> this.data.chatSearch).length === 0 || (<string>ch.title).indexOf(<string> this.data.chatSearch) >= 0) {
                this.$find(`#${this.$uid}-chat-${ch.id}`)?.addEventListener('click',() => {
                    this.activate(<number|string>ch.id);
                    this.$emit('chat-open',ch.id)
                })
            }
        })
    }

    private editProfile (result:boolean,fvalues?:obj|undefined) {
        // update profile on server
        console.log('Профиль',result,fvalues);
    }
}
