import express from 'express';
import path from 'path';
const app = express();
const PORT = process.env.PORT || 3000;
const badIPs = [];
const requestsCounts = {};
const lastRequestTime = {};
const __dirname = path.resolve();
app.use(express.static('dist'));
app.use(function(req, res, next) {
    if(badIPs.indexOf(req.ip)>=0){
        res.status(403).send('IP Banned!');
        return;
    }
    if((new Date().getTime()-lastRequestTime[req.ip]>60000) || (typeof requestsCounts[req.ip] === 'undefined')){
        requestsCounts[req.ip] = 0
        lastRequestTime[req.ip] = new Date().getTime()
    }
    requestsCounts[req.ip]++;
    //Если более 1000 запросов в минуту на IP, то блокируем его
    if(requestsCounts[req.ip]>1000){
        badIPs.push(req.ip);
        delete requestsCounts[req.ip];
        res.status(403).send('IP Banned!');
        return;
    }
    next();
});
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/dist/index.html`)
})
app.get('/:page', (req, res) => {
    if(['sign-up','messenger','404','500'].indexOf(req.params.page)>=0)
        res.sendFile(`${__dirname}/dist/index.html`)
    else{
        res.redirect('/404')
    }
})
app.listen(PORT,(req, res)=>{
    console.log(`server on ${PORT}`);
});
