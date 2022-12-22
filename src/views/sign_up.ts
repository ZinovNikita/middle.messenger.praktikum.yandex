import Modal from '../components/modal';
import api from '../api';
export default <ViewConstructor> class SignUp extends Modal {
    constructor () {
        super({
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
                open: () => {
                    this.$title = 'Регистрация';
                },
                cancel: () => {
                    this.$router.$go('/')
                },
                done: (result:boolean) => {
                    if (result === true) {
                        this.$router.$go('/messenger')
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
                        } else if (name === 'phone') {
                            if (!value ||
                            value.length < 10 ||
                            value.length > 15 ||
                            !value.match(/^(\+|\d)([\d].?)\d/g)) {
                                return 'от 10 до 15 символов, состоит из цифр, может начинается с плюса.'
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
                            if (success === true) {
                                api.auth.$signUp(this.fvalues as SignUpParams).then(res => {
                                    resolve(success);
                                }).catch(() => {
                                    resolve(false)
                                })
                                return;
                            }
                        }
                        resolve(success);
                    });
                }
            }
        });
        this.$title = 'Регистрация';
    }
}
