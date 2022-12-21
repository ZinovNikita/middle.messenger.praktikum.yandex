import { fetch2 } from '../utils'
type ResourcesType = {
    $url:Function,
    $add:Function,
}
export default class Resources {
    private host:string = '';
    private store:StoreType;
    private static instance:ResourcesType;
    static Init (host:string,store:StoreType):ResourcesType {
        if (this.instance === null || this.instance === undefined) { this.instance = new this(host,store); }
        return this.instance
    }

    private constructor (host:string,store:StoreType) {
        this.host = host;
        this.store = store;
    }

    public $url(url:string){
        if (!url || url.length === 0) { return 'data:image/png;base64,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' }
        return `${this.host}/api/v2/resources/${url || ''}`;
    }

    public $add (file:File):Promise<unknown> {
        const body:FormData = new FormData();
        body.append('resource', file);
        return fetch2.$post(`${this.host}/api/v2/resources`,{ body })
    }
}
