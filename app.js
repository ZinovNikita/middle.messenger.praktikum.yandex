const { text } = require('express');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const testData = {
    chats:[{
        id: 1,
        title: "Иванов Иван",
        url_img: 'https://thispersondoesnotexist.com/image',
        message:[{
            text: "Привет! Я приехал!"
        }]
    }]
}
app.use(express.static('dist'));
app.get('/chats', function (req, res) {
    res.set('Content-Type', 'application/json')
    res.status(200).send(testData.chats.map(c=>{return{
        id: c.id,
        title: c.title,
        url_img: c.url_img,
        last_message: c.message[c.message.length-1].text
    }}))
})
app.listen(PORT,(req, res)=>{
    console.log(`server on ${PORT}`);
});
