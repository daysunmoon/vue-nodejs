const express = require('express');
const router = express.Router();
const OrderModel = require('../models/order');

// 搜索查询
router.get('/search', function (req,res) {
    let pageNum = Number(req.query.pageNum) || 1;
    let pageSize = Number(req.query.pageSize) || 2;

    // 采用并行无关联
    async.parallel([
        function (cb) {
            OrderModel.find().count().then(num => {
                cb(null,num);
            }).catch (err => {
                cb(err)
            })
        },
        function (cb) {
            OrderModel.find().skip((pageNum -1) * pageSize).limit(pageSize)
            .then(data => {
                cb(null, data);
            }).catch(err => {
                cb(err)
            })
        }
    ], function (err,result){
        console.log(result);
        if(err) {
            res.json({
                code: -1,
                msg: err.message
            })
        }else {
            res.json({
                code: 0,
                msg: 'ok',
                data: result[1]
            })
        }
    })
})
// 删除order http://localhost:3000/order/delete
router.post('/delete', (req, res) => {
  let id = req.body.id;

  OrderModel.findOneAndDelete({
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