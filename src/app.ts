import ChatsPage from './views/chats';
import ErrorPage from './views/error';
import SignUpPage from './views/sign_up';
import SignInPage from './views/sign_in';
import Router from './components/router';
import Store from './components/store';
import api from './api';
import Component from './components/component';
Component.$store = Store.Init();
class Application {
    public $name:string = '';
    private element: Element;
    constructor (selector:string, name:string) {
        const tmp = document.querySelector(selector);
        if (tmp === null) { throw new Error(`Элемент приложения ${selector} не найден`); }
        this.element = tmp;
        this.$name = name;
        Component.$router = Router.Init(this.element);
        Component.$router
            .$use('/',SignInPage)
            .$use('/sign-up',SignUpPage)
            .$use('/messenger',ChatsPage)
            .$use('/404',ErrorPage, { status: 404, title: 'Страница не найдена', message: 'Страница не найдена' })
            .$use('/500',ErrorPage, { status: 500, title: 'Возникла ошибка на сервере', message: 'Возникла ошибка на сервере' })
        api.auth.$user().then(()=>{
            Component.$router.$start();
            if(Component.$router.$match('/') || Component.$router.$match('/sign-up'))
                Component.$router.$go('/messenger');
        }).catch(()=>{
            Component.$router.$start();
            if(!Component.$router.$match('/'))
                Component.$router.$go('/');
        })
    }
}
const App = new Application('#app', 'Месенджер');
export default App;
