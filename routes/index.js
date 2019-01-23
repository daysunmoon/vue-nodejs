const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    res.render('index');
})

router.get('/banner.html',(req,res)=>{
    res.render('banner');
})

router.get('/films.html',(req,res)=>{
    res.render('films');
})

router.get('/cinema.html',(req,res)=>{
    res.render('cinema')
})

module.exports = router;