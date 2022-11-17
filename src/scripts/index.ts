import {Component} from "./component";
export default class Index extends Component{
    private menu:any;
    constructor(){
        super(`
<nav class="index-menu">
    <h1>Список страниц сайта</h1>
    <ul id="{{uid}}-menu">
    {{#pages}}
        <li><a data-link-to="{{to}}" aria-label="{{title}}">{{text}}</a></li>
    {{/pages}}
    </ul>
</nav>`,'main',{
            data:{
                pages:[
                    {text:'Страница регистрации', title:'Страница регистрации', to:'signup'},
                    {text:'Страница входа', title:'Страница входа', to:'signin'},
                    {text:'Список чатов', title:'Список чатов', to:'chats'},
                    {text:'Страница ошибок 404', title:'Страница ошибок 404', to:'page404'},
                    {text:'Страница ошибок 5**', title:'Страница ошибок 5**', to:'page500'},
                ]
            }
        });
        this.menu = this.$el.querySelector(`#${this.uid}-menu`);
        this.menu.addEventListener("click",(event:any)=>{
            if(event.target.tagName==='A'){
                this.$emit('route',event.target.dataset.linkTo);
            }
        })
    }
}