import { fetch2 } from '../utils'
type AuthType = {
    $authorized:boolean,
    $signUp:Function,
    $signIn:Function,
    $user:Function,
    $logOut:Function,
}
export default class Auth {
    private host:string = '';
    private store:StoreType;
    private static instance:AuthType;
    static Init (host:string,store:StoreType):AuthType {
        if (this.instance === null || this.instance === undefined) { this.instance = new this(host,store); }
        return this.instance
    }

    private constructor (host:string,store:StoreType) {
        this.host = host;
        this.store = store;
    }

    public get $authorized ():boolean {
        return this.store.$has('user')
    }

    public $signUp (params:SignUpParams):Promise<unknown> {
        return new Promise((resolve, reject) => {
            fetch2.$post(`${this.host}/api/v2/auth/signup`,{
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json'
                },
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

    public $signIn (params:SignInParams):Promise<unknown> {
        return new Promise((resolve, reject) => {
            fetch2.$post(`${this.host}/api/v2/auth/signin`,{
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                params: {
                    login: params.login,
                    password: params.password
                }
            }).then(() => {
                this.$user().then(resolve).catch(reject)
            }).catch(reject)
        })
    }

    public $user ():Promise<unknown> {
        return new Promise((resolve,reject) => {
            if (this.store.$has('user')) { resolve(this.store.$get('user')) } else {
                fetch2.$get(`${this.host}/api/v2/auth/user`,{
                    headers: {
                        accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                    .then((res) => {
                        resolve(this.store.$set('user',res))
                    })
                    .catch(reject)
            }
        })
    }

    public $logOut ():Promise<unknown> {
        return fetch2.$post(`${this.host}/api/v2/auth/logout`,{
            headers: {
                accept: 'application/json'
            }
        })
    }
}
