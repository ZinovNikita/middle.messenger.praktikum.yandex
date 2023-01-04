export default class Socket extends WebSocket {
    constructor (userId:number,chatId:number,token:string) {
        super(`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`);
    }

    public $sendMessage (content:string) {
        this.send(JSON.stringify({ content, type: 'message' }))
    }

    public $sendImage (content:number) {
        this.send(JSON.stringify({ content, type: 'file' }))
    }

    public $getMessages (content:number = 0) {
        this.send(JSON.stringify({ content, type: 'get old' }))
    }

    public $onMessage (callback:Function) {
        this.addEventListener('message', (event:MessageEvent) => {
            const res = JSON.parse(event.data);
            if (res && typeof res === 'object') {
                if (Array.isArray(res)) {
                    res.reverse().forEach((m:Obj) => {
                        callback(m)
                    });
                } else if (res.type !== 'user connected') {
                    callback(res)
                }
            }
        });
    }
}
