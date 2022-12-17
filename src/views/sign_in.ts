import Modal from '../components/modal';
import api from '../api';
export default <ViewConstructor> class SignIn extends Modal {
    constructor () {
        super({
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
                open:()=>{
                    this.$title = 'Вход';
                },
                cancel:()=>{
                    console.log(this)
                    this.$router.$go('/sign-up')
                },
                done:(result:boolean, fvalues?:object|undefined)=>{
                    if (result) {
                        console.log('Вход', fvalues);
                        this.$router.$go('/messenger')
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
                            if(success===true){
                                api.auth.$signIn(this.fvalues as SignInParams).then(res=>{
                                    this.$store.$set('user',res);
                                    resolve(success);
                                }).catch(()=>{resolve(false)})
                                return;
                            }
                            else { resolve(success); }
                        }
                    });
                }
            }
        });
    }
}
