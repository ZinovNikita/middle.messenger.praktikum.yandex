type fetch2OptionsType = {
    method: string,
    timeout?: number,
    headers?: {[id:string]:unknown},
    params?: {[id:string]:unknown},
    body?: Document|XMLHttpRequestBodyInit|undefined,
}
type fetch2Type = {
    $get: Function,
    $post: Function,
    $put: Function,
    $delete: Function,
    $request: Function
}
class Fetch2{
    private stringify(data:{[id:string]:unknown}) {
        let str = [];
        for(let k in data){
            let v:unknown = data[k];
            if(v==null)
                v = "null";
            else if(Array.isArray(v))
                v = v.join(',');
            else if(typeof v === 'object')
                v = v.toString();
            str.push(`${k}=${encodeURIComponent(v as string)}`)
        }
        if(str.length==0)
            return '';
        return `?${str.join('&')}`;
    }
    public $get(url:string, options:fetch2OptionsType){
        options = Object.assign({method:"GET",timeout:5000},options);
        options.method = "GET";
        if(typeof options.params==='object'){
            url += this.stringify(options.params)
            delete options.params;
        }
        return this.$request(url, options);
    }
    public $post(url:string, options:fetch2OptionsType){
        options = Object.assign({method:"POST",timeout:5000},options);
        options.method = "POST";
        if(typeof options.params==='object'){
            options.body = JSON.stringify(options.params);
            delete options.params;
        }
        return this.$request(url, options);
    }
    public $put(url:string, options:fetch2OptionsType){
        options = Object.assign({method:"PUT",timeout:5000},options);
        options.method = "PUT";
        if(typeof options.params==='object'){
            options.body = JSON.stringify(options.params);
            delete options.params;
        }
        return this.$request(url, options);
    }
    public $delete(url:string, options:fetch2OptionsType){
        options = Object.assign({method:"DELETE",timeout:5000},options);
        options.method = "DELETE";
        if(typeof options.params==='object'){
            options.body = JSON.stringify(options.params);
            delete options.params;
        }
        return this.$request(url, options);
    };
    public $request(url:string, options:fetch2OptionsType){
        options = Object.assign({method:"GET",timeout:5000},options);
        return new Promise(function (resolve, reject) {
            try{
                let xhr = new XMLHttpRequest();
                xhr.open(options.method, url);
                xhr.onload = ()=>{
                    if (xhr.status >= 200 && xhr.status < 300)
                        resolve(xhr.response);
                    else
                        reject({
                            status: xhr.status,
                            statusText: xhr.statusText
                        });
                };
                xhr.onerror = ()=>{
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                };
                if(options.method==="GET")
                    xhr.send();
                else
                    xhr.send(options.body);
            }
            catch(err:any){
                reject({
                    status: "catch",
                    statusText: err.message
                });
            }
        });
    }
} 
const fetch2:fetch2Type = new Fetch2();
export default fetch2;
