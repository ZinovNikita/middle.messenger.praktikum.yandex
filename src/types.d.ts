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
}
declare type ObjComponentType = {[id:string]:ComponentType}
declare type Fetch2OptionsType = {
    method?: string,
    timeout?: number,
    headers?: Obj,
    params?: Obj,
    body?: Document|XMLHttpRequestBodyInit|undefined,
}
declare type Fetch2MethodType = (url:string, options:Fetch2OptionsType) => Promise<unknown>
declare type Fetch2Type = {
    $get: Fetch2MethodType,
    $post: Fetch2MethodType,
    $put: Fetch2MethodType,
    $delete: Fetch2MethodType,
    $request: Fetch2MethodType,
}
declare type EventBus = {
    $on: Function,
    $off: Function,
    $emit: Function,
}
declare type RouterType = {
    $use: Function,
    $start: Function,
    $go: Function,
    $getRoute: Function,
    $match: Function,
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
declare type StoreType = {
    $set: Function,
    $has: Function,
    $remove: Function,
    $get: Function,
}
declare type UserType = {
    first_name:string|null,
    second_name:string|null,
    display_name:string|null,
    login:string|null,
    email:string|null,
    phone:string|null,
    avatar?:string|null,
}
declare type ChatType =   {
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