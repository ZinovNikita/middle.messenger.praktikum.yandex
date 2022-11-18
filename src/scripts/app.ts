import Application from './application';
import IndexPage from './index';
import ErrorPage from './error';

document.addEventListener("DOMContentLoaded",(event)=>{
    const App = new Application("#app",{
        index: new IndexPage(),
        page404: new ErrorPage({status: 404, message: "Страница не найдена"}),
        page500: new ErrorPage({status: 500, message: "Возникла ошибка на сервере"})
    });
})
