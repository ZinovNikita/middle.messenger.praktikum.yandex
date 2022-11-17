import IndexPage from './index';
import ErrorPage from './error';
import Modal from './modal';
class Application{
    private pages:{[id:string]:any};
    private element: Element|any;
    constructor(selector:string,pages:{[id:string]:any}){
        this.element = document.querySelector(selector);
        this.pages = pages;
        for(let k in this.pages){
            this.pages[k].$on('route',this.route);
        }
        this.route('index');
    }
    private signInFields={

    }
    private route=(k:string)=>{
        if(k==='signin'){

        }
        else if(k==='signup'){

        }
        if(!this.pages[k])
            k = "page404";
        this.element.innerHTML = '';
        this.pages[k].attachParent(this.element);
    }
}
document.addEventListener("DOMContentLoaded",(event)=>{
    const App = new Application("#app",{
        index: new IndexPage(),
        page404: new ErrorPage({status: 404, message: "Страница не найдена"}),
        page500: new ErrorPage({status: 500, message: "Возникла ошибка на сервере"})
    });
    /*setInterval(()=>{
        App.attrs.title = new Date().getTime();
        console.log(App.attrs.title)
    },1000)*/
})
