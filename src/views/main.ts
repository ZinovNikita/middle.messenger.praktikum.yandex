import Component from '../components/component';
const indexTemplate = `
<nav class="index-menu">
    <h1>Список страниц сайта</h1>
    <ul id="{{uid}}-menu">
    {{#pages}}
        <li><a href="{{to}}" aria-label="{{title}}">{{text}}</a></li>
    {{/pages}}
    </ul>
</nav>`;
export default class Main extends Component {
    constructor () {
        super(indexTemplate,'main',{
            data: {
                pages: [
                    { text: 'Страница регистрации', title: 'Страница регистрации', to: '/signup.html' },
                    { text: 'Страница входа', title: 'Страница входа', to: '/signin.html' },
                    { text: 'Список чатов', title: 'Список чатов', to: '/chats.html' },
                    { text: 'Страница ошибок 404', title: 'Страница ошибок 404', to: '/404.html' },
                    { text: 'Страница ошибок 5**', title: 'Страница ошибок 5**', to: '/500.html' }
                ]
            }
        });
        this.$title = 'Список страниц сайта';
    }
}
