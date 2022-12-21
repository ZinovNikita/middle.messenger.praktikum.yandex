export default class Socket extends WebSocket{
    constructor(userId:number,chatId:number,token:string) {
        super(`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`);
    }
    private sendData(data:Obj):Promise<unknown>{
        return new Promise((resolve,reject) => {
            try{
                this.send(JSON.stringify(data))
                this.addEventListener("message", (event:MessageEvent)=>{
                    try{
                        resolve(JSON.parse(event.data))
                    }
                    catch(e){
                        reject(e)
                    }
                }, {once:true})
            }
            catch(e){
                reject(e)
            }
        })
    }
    public $sendMessage(content:string):Promise<unknown>{
        return this.sendData({content, type: 'message'});
    }
    public $sendImage(id:number):Promise<unknown>{
        return this.sendData({content: id, type: 'file'});
    }
    public $getMessages(offset:number=0):Promise<unknown>{
        return this.sendData({content: offset, type: 'get old'});
    }
}