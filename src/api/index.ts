import Auth from './auth'
import Users from './users';
import Chats from './chats';
import Resources from './resources'
import Store from '../components/store';
const host = 'https://ya-praktikum.tech';
const store = Store.Init();
export default {
    auth: Auth.Init(host,store) as Auth,
    users: Users.Init(host,store) as Users,
    chats: Chats.Init(host,store) as Chats,
    resources: Resources.Init(host,store) as Resources
}
