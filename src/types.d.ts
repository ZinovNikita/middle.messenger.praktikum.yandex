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
    $el:Element,
    $uid:string,
}
declare type ObjComponentType = {[id:string]:ComponentType}
declare type Fetch2OptionsType = {
    method: string,
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
    $request: Fetch2MethodType
}
declare type EventBus = {
    $on: Function,
    $off: Function,
    $emit: Function,
}
