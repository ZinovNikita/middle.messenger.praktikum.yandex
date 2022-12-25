import ApiBase from './api_base'
import { fetch2 } from '../utils'
type AuthType = {
    $authorized: boolean,
    $signUp: (params:SignUpParams) => Promise<UserType>,
    $signIn: (params:SignInParams) => Promise<UserType>,
    $user: () => Promise<UserType>,
    $logOut: () => Promise<string>,
}
export default class Auth extends ApiBase implements AuthType {
    public get $authorized ():boolean {
        return this.store.$has('user')
    }

    public $signUp (params:SignUpParams):Promise<UserType> {
        return new Promise((resolve, reject) => {
            fetch2.$post(`${this.host}/api/v2/auth/signup`,{
                params: {
                    first_name: params.first_name,
                    second_name: params.second_name,
                    login: params.login,
                    password: params.password,
                    phone: params.phone,
                    email: params.email
                }
            }).then(() => {
                this.$user().then(resolve).catch(reject)
            }).catch(reject)
        })
    }

    public $signIn (params:SignInParams):Promise<UserType> {
        return new Promise((resolve, reject) => {
            fetch2.$post(`${this.host}/api/v2/auth/signin`,{
                params: {
                    login: params.login,
                    password: params.password
                }
            }).then(() => {
                this.$user().then(resolve).catch(reject)
            }).catch(reject)
        })
    }

    public $user ():Promise<UserType> {
        return new Promise((resolve,reject) => {
            if (this.store.$has('user')) { resolve(this.store.$get('user')) } else {
                fetch2.$get(`${this.host}/api/v2/auth/user`)
                    .then((res) => {
                        resolve(this.store.$set('user',res))
                    })
                    .catch(reject)
            }
        })
    }

    public $logOut ():Promise<string> {
        return fetch2.$post(`${this.host}/api/v2/auth/logout`) as Promise<string>
    }
}
