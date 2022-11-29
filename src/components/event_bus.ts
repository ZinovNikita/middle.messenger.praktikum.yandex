export default class EventBus {
    private listeners:Record<string,Function[]>
    constructor () {
        this.listeners = {};
    }

    public $on (event:string, callback:Function) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    public $off (event:string) {
        delete this.listeners[event];
    }

    public $emit (event:string, ...args:any[]) {
        console.log(event,this.listeners[event])
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(listener => {
            listener(...args);
        });
    }
}
