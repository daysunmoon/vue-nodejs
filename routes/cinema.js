const express = require("express");
const router = express.Router();
const async = require('async');
const CinemaModel = require('../models/cinema')


// 添加cinema  - http://localhost:3000/cinema/add
router.post('/add', function (req, res) {
    var cinema = new CinemaModel({
        name: req.body.cinemaName,
        address: req.body.cinemaAddress,
        price: req.body.cinemaPrice,
        distance: req.body.cinemaDistance
    });

    cinema
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

// 查询cinema  - http://localhost:3000/cinema/search
router.get('/search', (req, res) => {
    // 分页
    // 1. 得到前端传递过来的参数
    let pageNum = Number(req.query.pageNum) || 1;
    let pageSize = Number(req.query.pageSize) || 2;

    async.parallel([
        function (cb) {
            CinemaModel.find().count().then(num => {
                cb(null, num)
            }).catch(err => {
                cb(err)
            })
        }, function (cb) {
            CinemaModel.find().skip((pageNum - 1) * pageSize).limit(pageSize).then(data => {
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

// 删除cinema http://localhost:3000/cinema /delete
router.post('/delete', (req, res) => {
    let id = req.body.id;

    CinemaModel.findOneAndDelete({
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


// 修改cinema  http://localhost:3000/cinema/update
router.post('/update', (req, res) => {
    let id = req.body.id;

    CinemaModel.update({
        _id: id
    }, {
            $set: {
                name: req.body.cinemaName,
                address: req.body.cinemaAddress,
                price: req.body.cinemaPrice,
                distance: req.body.cinemaDistance
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

// 修改cinema 点击修改时携带数据（查询对应的id） http://localhost:3000/cinema/update1
router.post('/update1',(req,res)=>{
    let id = req.body.id;

    CinemaModel.findOne({
        _id:id
    }).then(data=>{
        console.log(data)
        res.json({
            code: 0,
            msg: 'ok',
            dataName:data.name,
            dataAddress:data.address,
            dataPrice:data.price,
            dataDistance:data.distance
        })
    }).catch(err=>{
        res.json({
            code: -1,
            msg: err.message
        })
    })
})
module.exports = router; 