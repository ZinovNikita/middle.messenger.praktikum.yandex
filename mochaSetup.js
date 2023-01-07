import { register } from 'ts-node';
register({
    project: './tsconfig.json',
});
import { JSDOM } from 'jsdom';
const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body><div id="app"></div></body></html>`,{
    url: 'http://localhost:3000'
});
global.XMLHttpRequest = function(){
    Object.assign(this,{
        withCredentials: true,
        status: 200,
        statusText: 'status',
        response: '{"result":"done"}',
        open(method, url){},
        send(data){this.onload()},
        setRequestHeader(key,val){},
        getResponseHeader(key){return 'application/json'},
        onload(){},
        onerror(){}
    })
    return this;
}
global.window = dom.window;
global.document = dom.window.document;