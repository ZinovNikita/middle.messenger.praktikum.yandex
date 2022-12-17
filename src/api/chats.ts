import { fetch2 } from "../utils"
export default class Chats {
    private host:string = '';
    private store:StoreType;
    private static instance:Chats|null = null;
    static Init(host:string,store:StoreType):Chats{
        if(this.instance===null)
            this.instance = new this(host,store);
        return this.instance
    }
    private constructor(host:string,store:StoreType){
        this.host = host;
        this.store = store;
    }
    public $chat_list(offset:number=0,title?:string):Promise<unknown>{
        return new Promise((resolve,reject)=>{
            fetch2.$get(`${this.host}/api/v2/chats`,{
                headers:{
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                params:{
                    offset,
                    limit: 100,
                    title: title||''
                }
            }).then((res)=>{
                resolve(this.store.$set('chat_list',res));
            }).catch(reject)
        })
    }
}