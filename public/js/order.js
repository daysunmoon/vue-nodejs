(function () {
  // 定义这个文件操作的构造函数
  var Orders = function () {
    // 定义这个页面需要的一些数据
    this.pageNum = 1;
    this.pageSize = 3;
    this.totalPage = 0;
    this.orderList = [];
    // 需要用到的dom对象 
    this.dom = {
      table: $('banner-table tobady'),
    }
  }

  // 查询方法
  Orders.prototype.search = function () {
    var _this = this;
    $.get('/order/search', {
      pageNum: this.pageNum,
      pageSize: this.pageSize
    },function (res) {
      if (res.code === 0) {
        layer.msg('查询成功');

        _this.orderList = res.data;
        _this.totalPage = res.totalPage;
        _this.renderTable();
        _this.renderPage();
      }
    })
  }
  // 删除方法
  Orders.prototype.delete = function (id) {
    var id = id;
    $.post('/order/delete', {
      id: id
    }, function (res) {
      if (res.code === 0) {
        layer.msg('删除成功');
      } else {
        layer.msg('网络异常，请稍后重试');
      }
    })
  }
})

// 渲染table
Orders.prototype.renderTable = function () {
  this.dom.table.html('');
  for (var i = 0; i < this.orderList.length; i++) {
    this.dom.table.append(
      `
      <tr> 
        <td>${this.orderList[i]._id}</td>
        <td>${this.filmsList[i].name}</td>
        <td>
            <img class="banner-img" src="${this.filmsList[i].imgUrl}"
            alt="">
        </td>
        <td>${this.filmsList[i].score}</td>
        <td>${this.filmsList[i].starring} </td>
        <td>${this.filmsList[i].country}</td>
        <td>${this.filmsList[i].time}</td>
        <td>
        <a href="javascript:;" class="delete" data-id="${this.filmsList[i]._id}">&nbsp;删除</a>
        <button type="button" class="btn btn-primary btn-lg update" data-toggle="modal" data-target="#updateModal" data-id="${this.filmsList[i]._id}" >修改&nbsp;</button>
        </td>
      </tr> 
      `
    )
  }
}