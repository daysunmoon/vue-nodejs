const express = require('express');
const router = express.Router();
const userCheck = require('../middlewares/userCheck');

// 首页 - http://localhost:3000/
router.get('/',userCheck,(req,res)=>{
    // 要获取用户登录的用户名
    res.render('index',{
        nickName:req.cookies.nickName,
        isAdmin:Number(req.cookies.isAdmin)
    });
})


// banner 页面
router.get('/banner.html',userCheck,(req,res)=>{
    res.render('banner',{
        nickName:req.cookies.nickName,
        isAdmin:Number(req.cookies.isAdmin)
    });
})


//films 页面
router.get('/films.html',userCheck,(req,res)=>{
    res.render('films',{
        nickName:req.cookies.nickName,
        isAdmin:Number(req.cookies.isAdmin)
    });
})


// cinema 页面
router.get('/cinema.html',userCheck,(req,res)=>{
    res.render('cinema',{
        nickName:req.cookies.nickName,
        isAdmin:Number(req.cookies.isAdmin)
    })
})

// users 页面
router.get('/users.html',userCheck,(req,res)=>{
    res.render('users',{
        nickName:req.cookies.nickName,
        isAdmin:Number(req.cookies.isAdmin)
    });
})

// 注册 页面
router.get('/register.html', (req, res) => {
    res.render('register');
})
// 登录 页面
router.get('/login.html', (req, res) => {
    res.render('login');
})

module.exports = router;