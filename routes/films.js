const express = require('express');
const router = express.Router();
const FilmsModel = require('../models/films');
const async = require('async');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({
    dest: 'F:/tmp'
})

// 添加films  - http://localhost:3000/films/add
router.post('/add', upload.single('filmsImg'), (req, res) => {
    // 1.操作文件
    let newFileName = new Date().getTime() + '_' + req.file.originalname;
    let newFilePath = path.resolve(__dirname, '../public/uploads/films/' + newFileName);
    // 2、移动文件
    try {
        let data = fs.readFileSync(req.file.path);
        fs.writeFileSync(newFilePath, data);
        fs.unlinkSync(req.file.path);
        //文件的名字 + films图的名字给写入到数据库
        let films = new FilmsModel({
            name: req.body.filmsName,
            imgUrl: 'http://localhost:3000/uploads/films/' + newFileName,
            score: req.body.filmsScore,
            starring: req.body.filmsStarring,
            country: req.body.filmsCountry,
            time: req.body.filmsTime
        });

        films
            .save()
            .then(() => {
                res.json({
                    code: 0,
                    msg: "ok"
                })
            })
            .catch((err) => {
                res.json({
                    code: -1,
                    msg: err.message
                })
            })
    } catch (error) {
    res.json({
        code: -1,
        msg: error.message
    })
}
})

// router.post('/add',function(req,res){
//     var films = new FilmsModel({
//         name:req.body.filmsName,
//         imgUrl:req.body.filmsUrl,
//         score:req.body.filmsScore,
//         starring:req.body.filmsStarring,
//         country:req.body.filmsCountry,
//         time:req.body.filmsTime
//     });

//     films
//         .save()
//         .then(()=>{
//             res.json({
//                 code:0,
//                 msg:"ok"
//             })
//         })
//         .catch((err)=>{
//             res.json({
//                 code:-1,
//                 msg:err.message
//             }) 
//         })
//     })


// 搜索or查询films - http://localhost:3000/films/search
router.get('/search', function (req, res) {
    // 分页
    // 1. 得到前端传递过来的参数
    let pageNum = Number(req.query.pageNum) || 1;//当前的页数
    let pageSize = Number(req.query.pageSize) || 2;//每页显示的条数

    // 采用并行无关联
    async.parallel([
        function (cb) {
            FilmsModel.find().count().then(num => {
                cb(null, num);
            }).catch(err => {
                cb(err)
            })
        },
        function (cb) {
            FilmsModel.find().skip((pageNum - 1) * pageSize).limit(pageSize)
                .then(data => {
                    cb(null, data);
                }).catch(err => {
                    cb(err)
                })
        }
    ], function (err, result) {
        console.log(result);
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

// 删除films http://localhost:3000/films/delete
router.post('/delete', (req, res) => {
    let id = req.body.id;

    FilmsModel.findOneAndDelete({
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


// 修改films http://localhost:3000/films/update

router.post('/update', upload.single('filmsImg'), (req, res) => {
    // 1.操作文件
    let newFileName = new Date().getTime() + '_' + req.file.originalname;
    let newFilePath = path.resolve(__dirname, '../public/uploads/films/', newFileName);

    // 2、移动文件
    try {
        let data = fs.readFileSync(req.file.path);
        fs.writeFileSync(newFilePath, data);
        fs.unlinkSync(req.file.path);

        //根据id修改数据库文件的名字 + banner图的名字
        FilmsModel.update({
            _id: req.body.id
        }, {
                $set: {
                    name: req.body.filmsName,
                    score: req.body.filmsScore,
                    starring: req.body.filmsStarring,
                    country: req.body.filmsCountry,
                    time: req.body.filmsTime,
                    imgUrl: 'http://localhost:3000/uploads/films/' + newFileName
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

    } catch (error) {
        res.json({
            code: -1,
            msg: error.message
        })
    }
})


// 修改banner 点击修改时携带数据（查询对应的id） http://localhost:3000/banner/update1
router.post('/update1',(req,res)=>{
    let id = req.body.id;

    FilmsModel.findOne({
        _id:id
    }).then(data=>{
        console.log(data)
        res.json({
            code: 0,
            msg: 'ok',
            dataName:data.name,
            dataImg:data.imgUrl,
            dataScore:data.score,
            dataStarring:data.starring,
            dataCountry:data.country,
            dataTime:data.time,
        })
    }).catch(err=>{
        res.json({
            code: -1,
            msg: err.message
        })
    })
})
router.post('/find', function (req, res) {
    const id = req.body.id;
    FilmsModel.findOne({
        _id: id
    }).then(function (data) {
        if (data) {
            res.json({
                code: 0,
                msg: 'ok',
                data:data
            })
        } else {
            res.json({
                code: -1,
                msg: '未找到相关记录'
            })
        }
        console.log('data');
    }).catch(function (error) {
        res.json({
            code: -1,
            msg: error.message
        })
    })
})
module.exports = router;