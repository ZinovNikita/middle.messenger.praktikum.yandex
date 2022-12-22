import { fetch2 } from '../utils'
type ChatsType = {
    $chat_list:Function,
    $create:Function,
    $users:Function,
    $archive:Function,
    $unarchive:Function,
    $delete:Function,
    $avatar:Function,
    $includeUser:Function,
    $excludeUser:Function,
    $token:Function,
}
export default class Chats {
    private host:string = '';
    private store:StoreType;
    private static instance:ChatsType;
    static Init (host:string,store:StoreType):ChatsType {
        if (this.instance === null || this.instance === undefined) { this.instance = new this(host,store); }
        return this.instance
    }

    private constructor (host:string,store:StoreType) {
        this.host = host;
        this.store = store;
    }

    public $chat_list (offset:number = 0,title?:string,archive:boolean = false):Promise<unknown> {
        let url:string = `${this.host}/api/v2/chats`
        if (archive === true) { url += '/archive'; }
        return new Promise((resolve,reject) => {
            fetch2.$get(url,{
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                params: {
                    offset,
                    limit: 100,
                    title: title || ''
                }
            }).then((res) => {
                resolve(this.store.$set('chat_list',res));
            }).catch(reject)
        })
    }

    public $create (title:string):Promise<unknown> {
        return new Promise((resolve,reject) => {
            fetch2.$post(`${this.host}/api/v2/chats`,{
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                params: { title }
            }).then(() => {
                this.$chat_list().then(resolve).catch(reject)
            }).catch(reject)
        })
    }

    public $users (id:number):Promise<unknown> {
        return fetch2.$get(`${this.host}/api/v2/chats/${id}/users`,{
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
    }

    public $archive (chatId:number):Promise<unknown> {
        return fetch2.$post(`${this.host}/api/v2/chats/archive`,{
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json'
            },
            params: { chatId }
        })
    }

    public $unarchive (chatId:number):Promise<unknown> {
        return fetch2.$post(`${this.host}/api/v2/chats/unarchive`,{
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json'
            },
            params: { chatId }
        })
    }

    public $delete (chatId:number):Promise<unknown> {
        return fetch2.$delete(`${this.host}/api/v2/chats`,{
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json'
            },
            params: { chatId }
        })
    }

    public $avatar (chatId:string,file:File):Promise<unknown> {
        const body:FormData = new FormData();
        body.append('chatId', chatId);
        body.append('avatar', file);
        return fetch2.$put(`${this.host}/api/v2/chats/avatar`,{ body })
    }

    public $includeUser (chatId:number,users:number[]):Promise<unknown> {
        return fetch2.$put(`${this.host}/api/v2/chats/users`,{
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json'
            },
            params: { chatId,users }
        })
    }

    public $excludeUser (chatId:number,users:number[]):Promise<unknown> {
        return fetch2.$delete(`${this.host}/api/v2/chats/users`,{
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json'
            },
            params: { chatId,users }
        })
    }

    public $token (chatId:number):Promise<unknown> {
        return fetch2.$post(`${this.host}/api/v2/chats/token/${chatId}`,{
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
    }
}
