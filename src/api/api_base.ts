export default class ApiBase {
    // @ts-ignore - extended option
    protected host:string = '';
    // @ts-ignore - extended option
    protected store:StoreType;
    protected static instance:unknown;
    static Init (host:string,store:StoreType):unknown {
        if (this.instance === null || this.instance === undefined) { this.instance = new this(host,store); }
        return this.instance
    }

    constructor (host:string,store:StoreType) {
        this.host = host;
        this.store = store;
    }
}
