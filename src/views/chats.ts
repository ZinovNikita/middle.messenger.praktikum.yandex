import Component from '../components/component';
import Sidebar from '../components/sidebar';
import Chat from '../components/chat';
const chatsTemplate:string = '';
const chats:Obj[] = [{
    id: 1,
    first_name: 'Иван',
    second_name: 'Иванов',
    email: 'email1@email.ru',
    phone: '+79876543211',
    avatar: 'https://thispersondoesnotexist.com/image?q=11111111111111',
    last_message: 'Привет! Я приехал!'
},{
    id: 2,
    first_name: 'Петр',
    second_name: 'Петров',
    email: 'email2@email.ru',
    phone: '+79876543212',
    avatar: 'https://thispersondoesnotexist.com/image?q=2222222222222222222',
    last_message: 'Привет! Я не приехал!'
}];
export default <ViewConstructor> class Chats extends Component {
    constructor () {
        super(chatsTemplate,'main',{
            props: { className: 'container' }
        });

        this.$title = 'Чаты';
        this.sidebar = new Sidebar(this.chats, {
            'chat-open': (id:string|number) => {
                this.chat.$emit('open', chats.find((ch:Obj) => { return ch.id === id }))
                this.chat.$attach(this.$el)
            }
        });
        this.sidebar.$attach(this.$el);
        this.chat = new Chat();
        this.chats = new Proxy(chats,{
            get: (target:any, prop:string) => {
                if (prop === 'push') this.sidebar.data.chats = target;
                return target[prop];
            },
            set: (target:any, prop:string,val:any) => {
                target[prop] = val;
                this.sidebar.data.chats = target;
                return true;
            }
        });
        Object.assign(this.chats,chats);
    }

    private sidebar:ComponentType;
    private chat:ComponentType;
    private chats: Obj[] = [];
}
