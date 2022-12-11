import Component from '../components/component';
const errorTemplate = `
<div class="error">
    <h1>{{status}}</h1>
    <h3 class="message">{{message}}</h3>
    <a {{route '/messenger'}} aria-label="Страница со списком чатов">Вернуться к чатам</a>
</div>`;
export default <ViewConstructor> class Index extends Component {
    constructor (data:Obj) {
        super(errorTemplate,'main',{ data });
        this.$title = this.data.title || 'Ошибка';
    }
}
