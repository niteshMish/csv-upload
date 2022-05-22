
const express = require('express');

const port = 7000;
const app = express();

/////


 const bodyParser= require('body-parser');
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));

//////

const path = require('path');
const cookieParser = require('cookie-parser');
const db = require('./config/mongoose');


app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use(express.static('./assets'));
app.use('/uploads',express.static(__dirname+'/uploads'))

app.set('view engine','ejs');
app.set('views','./views');


app.use('/',require('./routes/index'));

app.listen(port , function(err){
    if(err){
        console.log("Error in Listening from the server");
        return ;
    }
    console.log(`yeap ! server is up on the port ${port}`);

})