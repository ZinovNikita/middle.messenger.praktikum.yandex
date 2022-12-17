export default class Store {
    private static instance:Store|null = null;
    public static Init():Store{
        if(this.instance===null)
            this.instance = new this();
        return this.instance
    }
    private state:Object = {};
    private constructor(){}
    public $set(key:string,data:any){
        this.state[key as keyof Object] = data;
        return this.state[key as keyof Object];
    }
    public $get(key:string):any{
        if(this.state.hasOwnProperty(key))
            return this.state[key as keyof Object];
        return undefined;
    }
    public $has(key:string):boolean{
        if(this.state.hasOwnProperty(key))
            return true;
        return false;
    }
    public $remove(key:string){
        if(this.state.hasOwnProperty(key))
            delete this.state[key as keyof Object];
    }
}