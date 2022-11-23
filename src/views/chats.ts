import {obj,ComponentType,Component} from "../components/component";
import fetch2 from "../scripts/fetch2";
import Sidebar from "../components/sidebar";
import Chat from "../components/chat";
const chats_template:string = ``;
const chats:obj[] = [{
    id: 1,
    title: "Иванов Иван",
    url_img: 'https://thispersondoesnotexist.com/image?q=11111111111111',
    last_message: "Привет! Я приехал!"
},{
    id: 2,
    title: "Петров Петр",
    url_img: 'https://thispersondoesnotexist.com/image?q=2222222222222222222',
    last_message: "Привет! Я не приехал!"
}];
export default class Chats extends Component{
    constructor(){
        super(chats_template,'main',{props:{className: 'container'}});
        this.sidebar = new Sidebar(this.chats);
        this.sidebar.$attach(this.$el);
        this.sidebar.$on('chat-open',this.chatOpen.bind(this))
        this.chat = new Chat();
        this.chats = new Proxy(chats,{
            get: (target:any, prop:string)=>{
                if(prop==='push') this.sidebar.data.chats = target;
                return target[prop];
            },
            set: (target:any, prop:string,val:any)=>{
                target[prop] = val;
                this.sidebar.data.chats = target;
                return true;
            }
        });
        Object.assign(this.chats,chats);
    }
    private sidebar:ComponentType;
    private chat:ComponentType;
    private chats: obj[] = [];
    private chatOpen(id:string|number){
        this.chat.$emit('open', chats.find((ch:obj)=>{return ch.id==id}))
        this.chat.$attach(this.$el)
    }
}
