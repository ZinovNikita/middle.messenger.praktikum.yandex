type Fetch2OptionsType = {
    method?: string,
    timeout?: number,
    headers?: Obj,
    params?: Obj,
    body?: Document|XMLHttpRequestBodyInit|undefined,
}
type Fetch2MethodType = (url:string, options?:Fetch2OptionsType) => Promise<unknown>
type Fetch2Type = {
    $get: Fetch2MethodType,
    $post: Fetch2MethodType,
    $put: Fetch2MethodType,
    $delete: Fetch2MethodType,
    $request: Fetch2MethodType,
}
class Fetch2 implements Fetch2Type {
    private stringify (data:Obj) {
        const str = [];
        for (const k in data) {
            let v:unknown = data[k];
            if (v == null) { v = 'null'; } else if (Array.isArray(v)) { v = v.join(','); } else if (typeof v === 'object') { v = v.toString(); }
            str.push(`${k}=${encodeURIComponent(v as string)}`)
        }
        if (str.length === 0) { return ''; }
        return `?${str.join('&')}`;
    }

    public $get:Fetch2MethodType = (url, options = {}) => {
        options = Object.assign({
            method: 'GET',
            timeout: 5000,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json'
            }
        },options);
        options.method = 'GET';
        if (typeof options.params === 'object') {
            url += this.stringify(options.params)
            delete options.params;
        }
        return this.$request(url, options);
    }

    public $post:Fetch2MethodType = (url, options = {}) => {
        options = Object.assign({
            method: 'POST',
            timeout: 5000,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json'
            }
        },options);
        options.method = 'POST';
        if (typeof options.params === 'object') {
            options.body = JSON.stringify(options.params);
            delete options.params;
        }
        return this.$request(url, options);
    }

    public $put:Fetch2MethodType = (url, options = {}) => {
        options = Object.assign({
            method: 'PUT',
            timeout: 5000,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json'
            }
        },options);
        options.method = 'PUT';
        if (typeof options.params === 'object') {
            options.body = JSON.stringify(options.params);
            delete options.params;
        }
        return this.$request(url, options);
    }

    public $delete:Fetch2MethodType = (url, options = {}) => {
        options = Object.assign({
            method: 'DELETE',
            timeout: 5000,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json'
            }
        },options);
        options.method = 'DELETE';
        if (typeof options.params === 'object') {
            options.body = JSON.stringify(options.params);
            delete options.params;
        }
        return this.$request(url, options);
    };

    public $request:Fetch2MethodType = (url, options = {}) => {
        options = Object.assign({ method: 'GET',timeout: 5000 },options);
        return new Promise(function (resolve, reject) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open(options.method || 'GET', url);
                xhr.withCredentials = true;
                if (options.headers !== undefined) {
                    for (const k in options.headers) { xhr.setRequestHeader(k, options.headers[k]) }
                }
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        const resCt = xhr.getResponseHeader('content-type');
                        if (resCt !== undefined && resCt !== null && resCt.indexOf('application/json') >= 0) {
                            try {
                                resolve(JSON.parse(xhr.response));
                            } catch (err:any) {
                                reject({
                                    status: xhr.status,
                                    statusText: err.message
                                });
                            }
                        } else { resolve(xhr.response); }
                    } else {
                        reject({
                            status: xhr.status,
                            statusText: xhr.statusText
                        });
                    }
                };
                xhr.onerror = () => {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                };
                if (options.method === 'GET') { xhr.send(); } else { xhr.send(options.body); }
            } catch (err:any) {
                reject({
                    status: 'catch',
                    statusText: err.message
                });
            }
        });
    }
}
const fetch2:Fetch2Type = new Fetch2();
export default fetch2;
