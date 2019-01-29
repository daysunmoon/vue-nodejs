const  express = require('express');
const router = express.Router();
const FilmsModel = require('../models/films');
const async = require('async');

// 添加films  - http://localhost:3000/films/add
router.post('/add',function(req,res){
    var films = new FilmsModel({
        name:req.body.filmsName,
        imgUrl:req.body.filmsUrl,
        score:req.body.filmsScore,
        starring:req.body.filmsStarring
    });

    films
        .save()
        .then(()=>{
            res.json({
                code:0,
                msg:"ok"
            })
        })
        .catch((err)=>{
            res.json({
                code:-1,
                msg:err.message
            }) 
        })
    })


    // 搜索or查询films - http://localhost:3000/films/search
router.get('/search',function(req,res){
    // 分页
   // 1. 得到前端传递过来的参数
   let pageNum = Number(req.query.pageNum) || 1;//当前的页数
   let pageSize = Number(req.query.pageSize) || 2;//每页显示的条数

   // 采用并行无关联
   async.parallel([
       function(cb){
           FilmsModel.find().count().then(num=>{
               cb(null,num);
           }).catch(err=>{
               cb(err)
           })
       },
       function(cb){
            FilmsModel.find().skip((pageNum-1)*pageSize).limit(pageSize)
           .then(data=>{
               cb(null,data);
           }).catch(err=>{
               cb(err)
           })
       }
   ],function(err,result){
       console.log(result);
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
               totalPage:Math.ceil(result[0] / pageSize)
           })
       } 
   })
})
module.exports = router;