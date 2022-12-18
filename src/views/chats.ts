import Component from '../components/component';
import Sidebar from '../components/sidebar';
import Chat from '../components/chat';
const chatsTemplate:string = '';
export default <ViewConstructor> class Chats extends Component {
    constructor () {
        super(chatsTemplate,'main',{
            props: { className: 'container' }
        });

        this.$title = 'Чаты';
        this.sidebar = new Sidebar({
            'chat-open': (id:string|number) => {
                this.chat.$emit('open', this.chats.find((ch:Obj) => { return ch.id === id }))
                this.chat.$attach(this.$el)
            }
        });
        this.sidebar.$attach(this.$el);
        this.chat = new Chat();
    }

    private sidebar:ComponentType;
    private chat:ComponentType;
    private chats: Obj[] = [];
}
