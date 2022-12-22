import Component from '../components/component';
import Sidebar from '../components/sidebar';
import Chat from '../components/chat';
const messengerTemplate:string = '';
export default <ViewConstructor> class Messenger extends Component {
    constructor () {
        super(messengerTemplate,'main',{
            props: { className: 'container' }
        });

        this.$title = 'Чаты';
        this.sidebar = new Sidebar({
            'chat-open': (id:string|number,archive:boolean = false) => {
                this.chat.$emit('open', this.$store.$get('chat_list').find((ch:Obj) => { return ch.id === id }),archive)
                this.chat.$attach(this.$el)
            }
        });
        this.sidebar.$attach(this.$el);
        this.chat = new Chat({
            'update-chat-list': () => {
                this.sidebar.$emit('load-chat-list')
            }
        });
    }

    private sidebar:ComponentType;
    private chat:ComponentType;
}
