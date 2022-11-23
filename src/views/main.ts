import {Component} from "../components/component";
const index_template =`
<nav class="index-menu">
    <h1>Список страниц сайта</h1>
    <ul id="{{uid}}-menu">
    {{#pages}}
        <li><a data-link-to="{{to}}" aria-label="{{title}}">{{text}}</a></li>
    {{/pages}}
    </ul>
</nav>`;
export default class Main extends Component{
    constructor(){
        super(index_template,'main',{
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
        this.$title = "Список страниц сайта";
        this.$el.querySelector(`#${this.$uid}-menu`)?.addEventListener("click",(event:any)=>{
            if(event.target.tagName==='A'){
                this.$emit('route',event.target.dataset.linkTo);
            }
        })
    }
}
