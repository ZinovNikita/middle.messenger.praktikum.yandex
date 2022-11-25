import Component from '../components/component';
const errorTemplate = `
<div class="error">
    <h1>{{status}}</h1>
    <h3 class="message">{{message}}</h3>
    <a id="{{uid}}-back-link" href="/chats.html" aria-label="Страница со списком чатов">Вернуться к чатам</a>
</div>`;
export default class Index extends Component {
    constructor (data:{[id:string]:unknown}) {
        super(errorTemplate,'main',{ data });
        this.$title = <string>data.title || 'Ошибка';
    }
}
