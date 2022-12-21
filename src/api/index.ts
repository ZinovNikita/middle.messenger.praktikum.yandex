import Auth from './auth'
import Users from './users';
import Chats from './chats';
import Resources from './resources'
import Store from '../components/store';
const host = 'https://ya-praktikum.tech';
const store = Store.Init();
export default {
    auth: Auth.Init(host,store),
    users: Users.Init(host,store),
    chats: Chats.Init(host,store),
    resources: Resources.Init(host,store)
}
