export default class Store {
    private static instance:StoreType;
    public static Init ():StoreType {
        if (this.instance === null || this.instance === undefined) { this.instance = new this(); }
        return this.instance
    }

    private state:Object = {};
    public $set (key:string,data:any) {
        this.state[key as keyof Object] = data;
        return this.state[key as keyof Object];
    }

    public $get (key:string):unknown {
        if (this.$has(key)) { return this.state[key as keyof Object]; }
        return undefined;
    }

    public $has (key:string):boolean {
        return Object.prototype.hasOwnProperty.call(this.state, key);
    }

    public $remove (key:string) {
        if (this.$has(key)) { delete this.state[key as keyof Object]; }
    }
}
