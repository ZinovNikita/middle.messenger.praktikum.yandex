import ChatsPage from './views/chats';
import ErrorPage from './views/error';
import Modal from './components/modal';
import Router from './components/router';
class Application {
    public $name:string = '';
    private element: Element;
    private readonly router: RouterType;
    constructor (selector:string, name:string) {
        const tmp = document.querySelector(selector);
        if (tmp === null) { throw new Error(`Элемент приложения ${selector} не найден`); }
        this.element = tmp;
        this.$name = name;
        this.router = Router.Init(this.element);
        this.router
            .$use('/',Modal,{
                data: {
                    title: 'Вход',
                    readonly: false,
                    fields: [
                        { label: 'Логин', type: 'text', name: 'login' },
                        { label: 'Пароль', type: 'password', name: 'password' }
                    ],
                    ok_title: 'Войти',
                    cancel_title: 'Регистрация'
                },
                events: {
                    cancel: () => {
                        this.router.$go('/sign-up')
                    },
                    done: (result:boolean, fvalues?:object|undefined) => {
                        if (result) {
                            console.log('Вход', fvalues);
                            this.router.$go('/messenger')
                        }
                    }
                },
                methods: {
                    validator (this:Modal,key:string|undefined) {
                        const checkFields = (name:string, value:string):string => {
                            if (name === 'login') {
                                if (!value ||
                            value.length < 3 ||
                            value.length > 20 ||
                            value.match(/[^A-Za-z0-9\-\_]/) ||
                            !value.match(/[^0-9]/)) {
                                    return 'от 3 до 20 символов, латиница, может содержать цифры, но не состоять из них, без пробелов, допустимы дефис и нижнее подчёркивание';
                                }
                            } else if (name === 'password') {
                                if (!value ||
                            value.length < 8 ||
                            value.length > 40 ||
                            !value.match(/[A-Z]/) ||
                            !value.match(/[^0-9]/)) {
                                    return 'от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра';
                                }
                            }
                            return '';
                        };
                        return new Promise((resolve:Function) => {
                            if (typeof key !== 'undefined' && key.length > 0) {
                                const msg:string = checkFields(key, <string>(<any> this.fvalues)[key]);
                                this.$field_error(key, msg);
                                resolve(msg.length === 0);
                            } else {
                                let success:boolean = true;
                                for (const k in this.fvalues) {
                                    const msg:string = checkFields(k, <string>(<any> this.fvalues)[k]);
                                    success &&= msg.length === 0;
                                    this.$field_error(k, msg);
                                }
                                if (success) {
                                    setTimeout(() => {
                                        // checkPassword on Server
                                        resolve(true);
                                    }, 1000);
                                } else { resolve(success); }
                            }
                        });
                    }
                }
            })
            .$use('/sign-up',Modal,{
                data: {
                    title: 'Регистрация',
                    readonly: false,
                    fields: [
                        { label: 'Имя', type: 'text', name: 'first_name' },
                        { label: 'Фамилия', type: 'text', name: 'second_name' },
                        { label: 'Логин', type: 'text', name: 'login' },
                        { label: 'Email', type: 'email', name: 'email' },
                        { label: 'Телефон', type: 'tel', name: 'phone' },
                        { label: 'Пароль', type: 'password', name: 'password' },
                        { label: 'Подтвердите пароль', type: 'password', name: 'password2' }
                    ],
                    ok_title: 'Зарегистрироваться',
                    cancel_title: 'Войти'
                },
                events: {
                    cancel: () => {
                        this.router.$go('/')
                    },
                    done: (result:boolean, fvalues?:object|undefined) => {
                        if (result) {
                            console.log('Регистрация', fvalues);
                            setTimeout(() => {
                            // registration on Server
                                this.router.$go('/messenger')
                            }, 1000);
                        }
                    }
                },
                methods: {
                    validator (this:Modal,key:string|undefined) {
                        const checkFields = (name:string, value:string):string => {
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
                                if (!value || !value.match(/^(([^<>()[\]\\.,:\s@\"]+(\.[^<>()[\]\\.,:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                                    return 'укажите корректный Email';
                                }
                            } else if (name === 'password' || name === 'password2') {
                                if (!value ||
                            value.length < 8 ||
                            value.length > 40 ||
                            !value.match(/[A-ZА-ЯЁ]/) ||
                            !value.match(/[^0-9]/)) {
                                    return 'от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра';
                                }
                                if (name === 'password2' && value !== (<any> this.fvalues).password) {
                                    return 'Пароли не совпадают';
                                }
                            }
                            return '';
                        };
                        return new Promise((resolve:Function) => {
                            let success:boolean = true;
                            if (typeof key !== 'undefined' && key.length > 0) {
                                const msg:string = checkFields(key, <string>(<any> this.fvalues)[key]);
                                success = msg.length === 0;
                                this.$field_error(key, msg);
                            } else {
                                for (const k in this.fvalues) {
                                    const msg:string = checkFields(k, <string>(<any> this.fvalues)[k]);
                                    success &&= msg.length === 0;
                                    this.$field_error(k, msg);
                                }
                            }
                            resolve(success);
                        });
                    }
                }
            })
            .$use('/messenger',ChatsPage)
            .$use('/404',ErrorPage, { status: 404, title: 'Страница не найдена', message: 'Страница не найдена' })
            .$use('/500',ErrorPage, { status: 500, title: 'Возникла ошибка на сервере', message: 'Возникла ошибка на сервере' })
            .$start()
    }
}
const App = new Application('#app', 'Месенджер');
export default App;
