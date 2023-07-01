require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
const generslRouter = require('./routers/genersl');
const postRouter = require('./routers/post');
const app = express();
const port = process.env.APP_PORT;

app.use(express.urlencoded({ extended: true}));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use('/static', express.static('static'));

app.use('/', generslRouter);
app.use('/p', postRouter );


app.listen(port, () =>{
    console.log(`สวัสดีครับ http://localhost:${port}`);
})