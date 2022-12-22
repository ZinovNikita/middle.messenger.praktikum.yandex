import Component from '../components/component';
const indexTemplate = `
<nav class="index-menu">
    <h1>Список страниц сайта</h1>
    <ul id="{{uid}}-menu">
    {{#pages}}
        <li><a {{route to}} aria-label="{{title}}">{{text}}</a></li>
    {{/pages}}
    </ul>
</nav>`;
export default <ViewConstructor> class Main extends Component {
    constructor () {
        super(indexTemplate,'main',{
            data: {
                pages: [
                    { text: 'Страница регистрации', title: 'Страница регистрации', to: '/sign-up' },
                    { text: 'Страница входа', title: 'Страница входа', to: '/' },
                    { text: 'Список чатов', title: 'Список чатов', to: '/messenger' },
                    { text: 'Страница ошибок 404', title: 'Страница ошибок 404', to: '/404' },
                    { text: 'Страница ошибок 5**', title: 'Страница ошибок 5**', to: '/500' }
                ]
            }
        });
        this.$title = 'Список страниц сайта';
    }
}
