import ApiBase from './api_base'
import { fetch2 } from '../utils'
type ChatsType = {
    $chat_list: (offset:number,title:string|undefined,archive:boolean) => Promise<Obj[]>,
    $create: (title:string) => Promise<Obj[]>,
    $users: (id:number) => Promise<UserType[]>,
    $archive: (chatId:number) => Promise<Obj[]>,
    $unarchive: (chatId:number) => Promise<Obj[]>,
    $delete: (chatId:number) => Promise<Obj[]>,
    $avatar: (chatId:string,file:File) => Promise<Obj[]>,
    $includeUser: (chatId:number,users:number[]) => Promise<string>,
    $excludeUser: (chatId:number,users:number[]) => Promise<string>,
    $token: (chatId:number) => Promise<Obj[]>,
}
export default class Chats extends ApiBase implements ChatsType {
    public $chat_list (offset:number = 0,title?:string,archive:boolean = false):Promise<Obj[]> {
        let url:string = `${this.host}/api/v2/chats`
        if (archive === true) { url += '/archive'; }
        return new Promise((resolve,reject) => {
            fetch2.$get(url,{
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

    public $create (title:string):Promise<Obj[]> {
        return new Promise((resolve,reject) => {
            fetch2.$post(`${this.host}/api/v2/chats`,{
                params: { title }
            }).then(() => {
                this.$chat_list().then(resolve).catch(reject)
            }).catch(reject)
        })
    }

    public $users (id:number):Promise<UserType[]> {
        return fetch2.$get(`${this.host}/api/v2/chats/${id}/users`) as Promise<UserType[]>
    }

    public $archive (chatId:number):Promise<Obj[]> {
        return fetch2.$post(`${this.host}/api/v2/chats/archive`,{
            params: { chatId }
        }) as Promise<Obj[]>
    }

    public $unarchive (chatId:number):Promise<Obj[]> {
        return fetch2.$post(`${this.host}/api/v2/chats/unarchive`,{
            params: { chatId }
        }) as Promise<Obj[]>
    }

    public $delete (chatId:number):Promise<Obj[]> {
        return fetch2.$delete(`${this.host}/api/v2/chats`,{
            params: { chatId }
        }) as Promise<Obj[]>
    }

    public $avatar (chatId:string,file:File):Promise<Obj[]> {
        const body:FormData = new FormData();
        body.append('chatId', chatId);
        body.append('avatar', file);
        return fetch2.$put(`${this.host}/api/v2/chats/avatar`,{ headers: undefined, body }) as Promise<Obj[]>
    }

    public $includeUser (chatId:number,users:number[]):Promise<string> {
        return fetch2.$put(`${this.host}/api/v2/chats/users`,{
            params: { chatId,users }
        }) as Promise<string>
    }

    public $excludeUser (chatId:number,users:number[]):Promise<string> {
        return fetch2.$delete(`${this.host}/api/v2/chats/users`,{
            params: { chatId,users }
        }) as Promise<string>
    }

    public $token (chatId:number):Promise<Obj[]> {
        return fetch2.$post(`${this.host}/api/v2/chats/token/${chatId}`,{
        }) as Promise<Obj[]>
    }
}
