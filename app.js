const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');

const indexRouter = require('./routes/index');
const bannerRouter = require('./routes/banner');
const filmsRouter = require('./routes/films');
const cinemaRouter = require('./routes/cinema');



app.use(express.static(path.resolve(__dirname,'./public')));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.set('views','./views');
app.set('view engine','ejs');

app.use('/',indexRouter);
app.use('/banner',bannerRouter);
app.use('/films',filmsRouter);  
app.use('/cinema',cinemaRouter); 
 



app.listen(3000)