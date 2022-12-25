declare module 'handlebars/runtime';
declare type Obj = {[id:string]:(string|number|boolean|undefined|obj|Function|unknown|EventListenerOrEventListenerObject|null)}
declare type ObjFunc = {[id:string]:Function}
declare type ObjEvent = {[id:string]:(EventListenerOrEventListenerObject|null)[]}
declare type ComponentOptionsType = {
    attrs?: Obj,
    props?: Obj,
    data?: Obj,
    events?: ObjFunc,
    methods?: ObjFunc,
}
declare type RouterType = {
    $use: Function,
    $start: Function,
    $go: Function,
    $getRoute: Function,
    $match: Function,
}
declare type StoreType = {
    $set: Function,
    $has: Function,
    $remove: Function,
    $get: Function,
}
declare type UserType = {
    id:number,
    first_name:string,
    second_name:string,
    display_name?:string,
    login:string,
    email:string,
    phone:string,
    avatar?:string,
}
declare type ComponentType = {
    attrs: Obj,
    props: Obj,
    data: Obj,
    events: ObjFunc,
    methods: ObjFunc,
    $compile: Function,
    $find: Function,
    $findAll: Function,
    $title: string,
    $attach: Function,
    $hide: Function,
    $el:Element,
    $uid:string,
    $emit: Function,
    $off: Function,
    $router: RouterType,
    $store: StoreType,
    $currentUser: UserType|null,
}
declare type ObjComponentType = {[id:string]:ComponentType}
declare type EventBus = {
    $on: Function,
    $off: Function,
    $emit: Function,
}
declare type RouteType = {
    $navigate: Function,
    $leave: Function,
    $match: Function,
    $render: Function,
}
declare interface ViewConstructor {
    new (...props:unknown): ComponentType;
}
declare type SignUpParams = {
    first_name: string,
    second_name: string,
    login: string,
    email: string,
    password: string,
    phone: string,
}
declare type SignInParams = {
    login: string,
    password: string,
}
declare type ChatType = {
    id: number,
    title: string,
    avatar: string,
    unread_count: number,
    last_message: null|{
      user: UserType,
      time: string,
      content: string
    }
}
