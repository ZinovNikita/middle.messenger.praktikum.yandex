import {Component} from "../components/component";
const error_template = `
<div class="error">
    <h1>{{status}}</h1>
    <h3 class="message">{{message}}</h3>
    <a id="{{uid}}-back-link" aria-label="Страница со списком чатов">Вернуться к чатам</a>
</div>`;
export default class Index extends Component{
    constructor(data:{[id:string]:unknown}){
        super(error_template,'main',{data});
        this.$el.querySelector(`#${this.$uid}-back-link`)?.addEventListener("click",(event:any)=>{
            this.$emit('route',event.target.dataset.linkTo);
        })
        this.$title = <string>data.title || "Ошибка";
    }
}
