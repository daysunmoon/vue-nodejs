const express = require("express");
const router = express.Router();
const async = require('async');
const CinemaModel =require('../models/cinema')


// 添加cinema  - http://localhost:3000/cinema/add
router.post('/add',function(req,res){
    var cinema = new CinemaModel({
        name:req.body.cinemaName,
        address:req.body.cinemaAddress,
        price:req.body.cinemaPrice,
        distance:req.body.cinemaDistance
    });

    cinema
        .save()
        .then(()=>{
            res.json({
                code:0,
                msg:'ok'
            })
        })
        .catch(err=>{
            res.json({
                code:-1,
                msg:err.message
            })
        })
})

// 添加cinema  - http://localhost:3000/cinema/search
router.get('/search',(req,res)=>{
    // 分页
   // 1. 得到前端传递过来的参数
   let pageNum = Number(req.query.pageNum) || 1;
   let pageSize = Number(req.query.pageSize) || 2;

   async.parallel([
    function(cb){
        CinemaModel.find().count().then(num=>{
            cb(null,num)
        }).catch(err=>{
            cb(err)
        })
    },function(cb){
        CinemaModel.find().skip((pageNum-1)*pageSize).limit(pageSize).then(data=>{
            cb(null,data)
        }).catch(err=>{
            cb(err)
        })
    }
   ],function(err,result){
        if(err){
            res.json({
                code:-1,
                msg:err.message
            })
        }else{
            res.json({
                code:0,
                msg:'ok',
                data:result[1],
                totalPage:Math.ceil(result[0]/pageSize)
            })
        }
   })
})
module.exports = router; 