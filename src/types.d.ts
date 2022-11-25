declare module 'handlebars/runtime';
declare type obj = {[id:string]:(string|number|boolean|undefined|obj|Function|unknown|EventListenerOrEventListenerObject|null)}
declare type objfunc = {[id:string]:Function}
declare type objevent = {[id:string]:(EventListenerOrEventListenerObject|null)[]}
declare type ComponentOptionsType = {
    attrs?: obj,
    props?: obj,
    data?: obj,
    events?: objfunc,
    methods?: objfunc,
}
declare type ComponentType = {
    attrs: obj,
    props: obj,
    data: obj,
    events: objfunc,
    methods: objfunc,
    $compile: Function,
    $find: Function,
    $findAll: Function,
    $title: string,
    $on: Function,
    $off: Function,
    $emit: Function,
    $attach: Function,
    $el:Element,
    $uid:string,
}
declare type objComponentType = {[id:string]:ComponentType}
declare type fetch2OptionsType = {
    method: string,
    timeout?: number,
    headers?: {[id:string]:unknown},
    params?: {[id:string]:unknown},
    body?: Document|XMLHttpRequestBodyInit|undefined,
}
declare type fetch2Type = {
    $get: Function,
    $post: Function,
    $put: Function,
    $delete: Function,
    $request: Function
}
