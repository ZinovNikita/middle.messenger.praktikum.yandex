import { fetch2 } from "../utils"
export default class Users {
    private host:string = '';
    private store:StoreType;
    private static instance:Users|null = null;
    static Init(host:string,store:StoreType):Users{
        if(this.instance===null)
            this.instance = new this(host,store);
        return this.instance
    }
    private constructor(host:string,store:StoreType){
        this.host = host;
        this.store = store;
    }
    public $get(id:number):Promise<unknown>{
        return new Promise((resolve,reject)=>{
            if(this.store.$has(`user-${id}`))
                resolve(this.store.$get(`user-${id}`))
            else{
                fetch2.$get(`${this.host}/api/v2/user/${id}`,{
                    headers:{
                        'accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                .then((res)=>{
                    resolve(this.store.$set(`user-${id}`,res))
                })
                .catch(reject)
            }
        })
    }
    public $profile(params:UserType):Promise<unknown>{
        return new Promise((resolve,reject)=>{
            fetch2.$put(`${this.host}/api/v2/user/profile`,{
                headers:{
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                params:{
                    first_name: params.first_name,
                    second_name: params.second_name,
                    display_name: params.display_name,
                    login: params.login,
                    email: params.email,
                    phone: params.phone
                }
            })
            .then((res)=>{
                resolve(this.store.$set(`user`,res))
            })
            .catch(reject)
        })
    }
    public $avatar(file:File):Promise<string>{
        const body:FormData = new FormData();
        body.append('avatar', file);
        return new Promise((resolve,reject)=>{
            fetch2.$put(`${this.host}/api/v2/user/profile/avatar`,{body}).then((r)=>{
                const user = (r as UserType);
                this.store.$set(`user`,user)
                resolve(`${this.host}/api/v2/resources/${user.avatar||''}`);
            })
            .catch(reject)
        })
    }
    public $search(login:string):Promise<unknown>{
        return fetch2.$post(`${this.host}/api/v2/user/search`,{
            headers:{
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            params:{ login }
        })
    }
}