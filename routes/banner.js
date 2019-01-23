const express = require('express');
const router = express.Router();
const BannerModel = require('../models/banner');
const async = require('async');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({
    dest: 'F:/tmp'
})

// 添加banenr  - http://localhost:3000/banner/add
router.post('/add', upload.single('bannerImg'), (req, res) => {
    // 1.操作文件
    let newFileName = new Date().getTime() + '_' + req.file.originalname;
    let newFilePath = path.resolve(__dirname, '../public/uploads/banners/', newFileName);

    // 2、移动文件
    try {
        let data = fs.readFileSync(req.file.path);
        fs.writeFileSync(newFilePath, data);
        fs.unlinkSync(req.file.path);
    
        //文件的名字 + banner图的名字给写入到数据库
        let banner = new BannerModel({
            name: req.body.bannerName,
            imgUrl: 'http://localhost:3000/uploads/banners/' + newFileName
        });
    
        banner
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




// router.post('/add',(req,res)=>{
//     var banner = new BannerModel({
//         name:req.body.bannerName,
//         imgUrl:req.body.bannerUrl
//     });

//     banner
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

// })


// 搜索or查询banner - http://localhost:3000/banner/search
router.get('/search', (req, res) => {
    // 分页
    // 1. 得到前端传递过来的参数
    let pageNum = Number(req.query.pageNum) || 1;//当前的页数
    let pageSize = Number(req.query.pageSize) || 2;//每页显示的条数

    // 采用并行无关联
    async.parallel([
        function (cb) {
            BannerModel.find().count().then(num => {
                cb(null, num);
            }).catch(err => {
                cb(err)
            })
        },
        function (cb) {
            BannerModel.find().skip((pageNum - 1) * pageSize).limit(pageSize)
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

// 删除banner http://localhost:3000/banner/delete
router.post('/delete', (req, res) => {
    let id = req.body.id;

    BannerModel.findOneAndDelete({
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
module.exports = router;







