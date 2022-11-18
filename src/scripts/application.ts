import {obj,objfunc,objevent,ComponentOptionsType,ComponentType} from "./component";
import Modal from './modal';
export type objComponentType = {[id:string]:ComponentType}
export default class Application{
    private pages:objComponentType;
    private element: Element;
    private signInForm: Modal;
    private signUpForm: Modal;
    constructor(selector:string,pages:objComponentType){
        let tmp = document.querySelector(selector);
        if(tmp===null)
            throw new Error(`Элемент приложения ${selector} не найден`);
        this.element = tmp;
        this.pages = pages;
        for(let k in this.pages){
            this.pages[k as keyof objComponentType].$on('route',this.route);
        }
        this.signInForm=new Modal({
            data:{
                title: "Вход",
                readonly: false,
                fields:[
                    {label: 'Логин', type: 'text', name: 'login'},
                    {label: 'Пароль', type: 'password', name: 'password'}
                ],
                ok_title: "Войти",
                cancel_title: "Регистрация"
            },
            events:{
                done:(result:boolean,fvalues?:object|undefined)=>{
                    if(result)
                        this.route('chats')
                    else
                        this.route('signup')
                }
            },
            methods:{
                validator(name:string,value:string){
                    if(name==='login'){
                        if(!value
                        || value.length<3
                        || value.length>20
                        || value.match(/[^A-Za-z0-9\-\_]/)
                        || !value.match(/[^0-9]/)){
                            return 'от 3 до 20 символов, латиница, может содержать цифры, но не состоять из них, без пробелов, допустимы дефис и нижнее подчёркивание';
                        }
                    }
                    else if(name==='password'){
                        if(!value
                        || value.length<8
                        || value.length>40
                        || !value.match(/[A-Z]/)
                        || !value.match(/[^0-9]/)){
                            return 'от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра';
                        }
                    }
                    return '';
                }
            }
        });
        this.signUpForm=new Modal({
            data:{
                title: "Регистрация",
                readonly: false,
                fields:[
                    {label: 'Имя', type: 'text', name: 'first_name'},
                    {label: 'Фамилия', type: 'text', name: 'second_name'},
                    {label: 'Логин', type: 'text', name: 'login'},
                    {label: 'Email', type: 'email', name: 'email'},
                    {label: 'Телефон', type: 'tel', name: 'phone'},
                    {label: 'Пароль', type: 'password', name: 'password'},
                    {label: 'Подтвердите пароль', type: 'password', name: 'password2'}
                ],
                ok_title: "Зарегистрироваться",
                cancel_title: "Войти"
            },
            events:{
                done:(result:boolean,fvalues?:{[id:string]:unknown}|undefined)=>{
                    if(result)
                        this.route('chats')
                    else
                        this.route('signin')
                }
            },
            methods:{
                validator(name:string,value:string){
                    if(name==='first_name' || name==='second_name'){
                        if(!value
                        || value.length==0
                        || (value.match(/[A-Za-z]/) && value.match(/[А-Яа-яЁё]/))
                        || !value.match(/^[A-ZА-ЯЁ]/)
                        || value.match(/[^A-Za-zА-Яа-яЁё\-]/)){
                            return 'латиница или кириллица, первая буква должна быть заглавной, без пробелов и без цифр, допустим только дефис.';
                        }
                    }
                    else if(name==='login'){
                        if(!value
                        || value.length<3
                        || value.length>20
                        || !value.match(/[^A-Za-z0-9\-\_]/)
                        || value.match(/[^0-9]/)){
                            return 'от 3 до 20 символов, латиница, может содержать цифры, но не состоять из них, без пробелов, допустимы дефис и нижнее подчёркивание';
                        }
                    }
                    else if(name==='email'){
                        if(!value || !value.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
                            return 'укажите корректный Email';
                        }
                    }
                    else if(name==='password' || name==='password2'){
                        if(!value
                        || value.length<8
                        || value.length>40
                        || !value.match(/[A-ZА-ЯЁ]/)
                        || !value.match(/[^0-9]/)){
                            return 'от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра';
                        }
                        if(name==='password2' && value!==(<any>this.fvalues).password){
                            return 'Пароли не совпадают';
                        }
                    }
                    return '';
                }
            }
        });
        this.route('index');
    }
    private route=(k:string)=>{
        if(k==='signin'){
            this.signInForm.$open();
        }
        else if(k==='signup'){
            this.signUpForm.$open();
        }
        else{
            if(!this.pages[k])
                k = "page404";
            this.element.innerHTML = '';
            this.pages[k].$attach(this.element);
        }
    }
}
