import ApiBase from './api_base'
import { fetch2 } from '../utils'
type UsersType = {
    $get: (id:number) => Promise<UserType>,
    $profile: (params:UserType) => Promise<UserType>,
    $avatar: (file:File) => Promise<string>,
    $search: (login:string) => Promise<UserType[]>,
    $password: (params:Obj) => Promise<string>,
}
export default class Users extends ApiBase implements UsersType {
    public $get (id:number):Promise<UserType> {
        return new Promise((resolve,reject) => {
            if (this.store.$has(`user-${id}`)) { resolve(this.store.$get(`user-${id}`)) } else {
                fetch2.$get(`${this.host}/api/v2/user/${id}`)
                    .then((res) => {
                        resolve(this.store.$set(`user-${id}`,res))
                    })
                    .catch(reject)
            }
        })
    }

    public $profile (params:UserType):Promise<UserType> {
        return new Promise((resolve,reject) => {
            fetch2.$put(`${this.host}/api/v2/user/profile`,{
                params: {
                    first_name: params.first_name,
                    second_name: params.second_name,
                    display_name: params.display_name,
                    login: params.login,
                    email: params.email,
                    phone: params.phone
                }
            })
                .then((res) => {
                    resolve(this.store.$set('user',res))
                })
                .catch(reject)
        })
    }

    public $avatar (file:File):Promise<string> {
        const body:FormData = new FormData();
        body.append('avatar', file);
        return new Promise((resolve,reject) => {
            fetch2.$put(`${this.host}/api/v2/user/profile/avatar`,{ headers: undefined, body }).then((r) => {
                const user = (r as UserType);
                this.store.$set('user',user)
                resolve(`${this.host}/api/v2/resources/${user.avatar || ''}`);
            }).catch(reject)
        })
    }

    public $search (login:string):Promise<UserType[]> {
        return fetch2.$post(`${this.host}/api/v2/user/search`,{ params: { login } }) as Promise<UserType[]>
    }

    public $password (params:Obj):Promise<string> {
        return fetch2.$put(`${this.host}/api/v2/user/password`,{
            params: {
                oldPassword: params.oldPassword,
                newPassword: params.newPassword
            }
        }) as Promise<string>
    }
}
