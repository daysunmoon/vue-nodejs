const express = require('express');
const UserModel = require('../models/user');
const router = express.Router();
const async = require('async');


//注册  /user/register
router.post('/register', (req, res) => {
    // 1. 得到数据, 前端传递过来的参数名跟表中的字段名相同。
    // 2. 实例化用户对象
    let user = new UserModel(req.body);
    //3、save方法
    user.save()
        .then(() => {
            res.json({
                code: 0,
                msg: '注册成功'
            })
        })
        .catch(err => {
            res.json({
                code: -1,
                msg: err.message
            })
        })
})

router.post('/register1', (req, res) => {
    UserModel.find({
        userName: req.body.userName
    }).then(data => {
        if (data.length != 0) {
            res.json({
                code: -1,
                msg: '用户名已存在，请重新注册'
            })
        } else {
            res.json({
                code: 0,
                msg: '可用'
            })
        }
    })
})


// 登录 /user/login
router.post('/login', (req, res) => {
    // 1. 得到前端传递的用户名与密码
    let userName = req.body.userName;
    let password = req.body.password;

    // 2. 数据库查询用户
    UserModel.findOne({
        userName,
        password
    }).then(data => {
        console.log(data);
        // 判断，如果存在 data 有值，不存在，data 为 null
        if (!data) {
            res.json({
                code: -1,
                msg: '用户名或密码错误'
            })
        } else {
            // 先设置cookie 
            res.cookie('nickName', data.nickName, {
                maxAge: 1000 * 60 * 10
            });
            res.cookie('isAdmin', data.isAdmin, {
                maxAge: 1000 * 60 * 10
            })

            //返回数据
            res.json({
                code: 0,
                msg: '登录成功',
                data: {
                    id: data._id,
                    nickName: data.nickName,
                    isAdmin: data.isAdmin
                }
            })
        }
    }).catch(err => {
        console.log(err);
        res.json({
            code: -1,
            msg: err.msg
        })
    })
})




// 添加user  - http://localhost:3000/user/add
router.post('/add', function (req, res) {
    var user = new UserModel({
        userName: req.body.userName,
        password: req.body.userPassword,
        nickName: req.body.userNickName,
        isAdmin: req.body.userIsAdmin
    });

    user
        .save()
        .then(() => {
            res.json({
                code: 0,
                msg: 'ok'
            })
        })
        .catch(err => {
            res.json({
                code: -1,
                msg: err.message
            })
        })
})

// 查询user  - http://localhost:3000/user/search
router.get('/search', (req, res) => {
    // 分页
    // 1. 得到前端传递过来的参数
    let pageNum = Number(req.query.pageNum) || 1;
    let pageSize = Number(req.query.pageSize) || 2;

    async.parallel([
        function (cb) {
            UserModel.find().count().then(num => {
                cb(null, num)
            }).catch(err => {
                cb(err)
            })
        }, function (cb) {
            UserModel.find().skip((pageNum - 1) * pageSize).limit(pageSize).then(data => {
                cb(null, data)
            }).catch(err => {
                cb(err)
            })
        }
    ], function (err, result) {
        if (err) {
            res.json({
                code: -1,
                msg: err.message
            })
        } else {
            res.json({
                code: 0,
                msg: 'ok',
                data: result[1],
                totalPage: Math.ceil(result[0] / pageSize)
            })
        }
    })
})

// 删除user http://localhost:3000/user /delete
router.post('/delete', (req, res) => {
    let id = req.body.id;

    UserModel.findOneAndDelete({
        _id: id
    }).then(data => {
        if (data) {
            res.json({
                code: 0,
                msg: 'ok'
            })
        } else {
            res.json({
                code: -1,
                msg: '未找到相关记录'
            })
        }
    }).catch(err => {
        res.json({
            code: -1,
            msg: err.message
        })
    })
})


// 修改user  http://localhost:3000/user/update
router.post('/update', (req, res) => {
    let id = req.body.id;

    UserModel.update({
        _id: id
    }, {
            $set: {
                userName: req.body.userName,
                password: req.body.userPassword,
                nickName: req.body.userNickName,
                isAdmin: req.body.userIsAdmin
            }
        }).then(() => {
            res.json({
                code: 0,
                msg: 'ok'
            })
        }).catch(err => {
            res.json({
                code: -1,
                msg: err.message
            })
        })
})

// 修改user 点击修改时携带数据（查询对应的id） http://localhost:3000/user/update1
router.post('/update1',(req,res)=>{
    let id = req.body.id;

    UserModel.findOne({
        _id:id
    }).then(data=>{
        console.log(data)
        res.json({
            code: 0,
            msg: 'ok',
            dataName:data.userName,
            dataPassword:data.password,
            dataNickName:data.nickName,
            dataIsAdmin:data.isAdmin
        })
    }).catch(err=>{
        res.json({
            code: -1,
            msg: err.message
        })
    })
})
module.exports = router;