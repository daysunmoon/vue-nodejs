
(function () {
    var Cinema = function () {
        //  定义这个页面需要的一些数据
        this.pageNum = 1;
        this.pageSize = 3;
        this.totalPage = 0;
        this.cinemaList = [];//cinema数据

        // 需要用到的 dom 对象  性能优化 -dom缓存
        this.dom = {
            table: $('.banner-table tbody'),
            nameInput: $('#inputEmail3'),
            addressInput: $('#inputPassword3'),
            priceInput: $('#inputPrice'),
            distanceInput: $('#inputDistance'),
            pagination: $('.pagination'),    // 分页的ul
            addModal: $('#addModal'),//新增模态框
            submitAdd: $('#bannerAdd'),//确认添加按钮
            updateName: $('#updateName'),
            updateAddress: $('#updateAddress'),
            updatePrice: $('#updatePrice'),
            updateDistance: $('#updateDistance'),
            updateModal: $('#updateModal'),
            submitUpdate: $('#bannerUpdate'),

        }
    }


    // 新增的方法add
    Cinema.prototype.add = function () {
        var _this = this;
        $.post('/cinema/add', {
            cinemaName: this.dom.nameInput.val(),
            cinemaAddress: this.dom.addressInput.val(),
            cinemaPrice: this.dom.priceInput.val(),
            cinemaDistance: this.dom.distanceInput.val()
        }, function (res) {
            if (res.code == 0) {
                layer.msg('添加成功');
                // 请求一下数据
                setTimeout(function(){
                    _this.search()
                },1000)
            } else {
                // console.log(res.msg);
                layer.msg('网络异常，请稍后重试');
            }
            // 手动调用关闭的方法
            _this.dom.addModal.modal('hide')
            // 手动清空输入框的内容
            _this.dom.nameInput.val('');
            _this.dom.addressInput.val('');
            _this.dom.priceInput.val('');
            _this.dom.distanceInput.val('');
        });
    }

    //查询的方法
    Cinema.prototype.search = function () {
        var _this = this;
        $.get('/cinema/search', {
            pageNum: this.pageNum,
            pageSize: this.pageSize
        }, function (res) {
            if (res.code == 0) {
                layer.msg("查询成功") ;
                // 将res.data写入到实例的cinemarList
                _this.cinemaList = res.data;
                // 将res.totalPage写入到实例的totalPage
                _this.totalPage = res.totalPage;

                // 调用渲染table
                _this.renderTable();

                // 调用渲染分页
                _this.renderPage();
            } else {
                console.log(res.msg);
                layer.msg('网络异常，请稍后重试');
            }
        })
    }

    //删除的方法
    Cinema.prototype.delete = function (id) {
        var id = id;
        $.post('/cinema/delete', {
            id: id
        }, function (res) {
            if (res.code === 0) {
                layer.msg('删除成功');

            } else {
                layer.msg('网络异常，请稍后重试');
            }
        })
    }

    //修改的方法
    Cinema.prototype.update = function (id) {
        var _this = this;
        var id = id;
        $.post('/cinema/update', {
            id:id,
            cinemaName: this.dom.updateName.val(),
            cinemaAddress: this.dom.updateAddress.val(),
            cinemaPrice: this.dom.updatePrice.val(),
            cinemaDistance: this.dom.updateDistance.val()
        }, function (res) {
            if (res.code == 0) {
                layer.msg('修改成功');
                // 请求一下数据
                setTimeout(function () {
                    _this.search()
                },1000)
            } else {
                // console.log(res.msg);
                layer.msg('网络异常，请稍后重试');
            }
            // 手动调用关闭的方法
            _this.dom.updateModal.modal('hide')
            // 手动清空输入框的内容
            _this.dom.updateName.val('');
            _this.dom.updateAddress.val('');
            _this.dom.updatePrice.val('');
            _this.dom.updateDistance.val('');
        });
    }

    //修改时携带原有数据
    Cinema.prototype.getData = function (id) {
        var _this = this;
        var id = id;
        console.log(id)
        $.post('/cinema/update1',{
            id:id
        },function(res){
            console.log( res.dataName)
            console.log( res.dataAddress)
            _this.dom.updateName.val(res.dataName) ;
            _this.dom.updateAddress.val(res.dataAddress) ;
            _this.dom.updatePrice.val(res.dataPrice) ;
            _this.dom.updateDistance.val(res.dataDistance) ;
            // _this.dom.updateImg.val(res.dataImg)  
           
        })
    }

    // 渲染table
    Cinema.prototype.renderTable = function () {
        //清空
        this.dom.table.html('');
        for (var i = 0; i < this.cinemaList.length; i++) {
            this.dom.table.append(
                `
                <tr> 
                    <td>${this.cinemaList[i]._id}</td>
                    <td>${this.cinemaList[i].name}</td>
                    <td>${this.cinemaList[i].address}</td>
                    <td>&nbsp;&nbsp;&nbsp;&nbsp;${this.cinemaList[i].price}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                    <td>&nbsp;&nbsp;&nbsp;&nbsp;${this.cinemaList[i].distance}&nbsp;&nbsp;&nbsp;&nbsp; </td>
                    <td>
                        <a href="javascript:;" class="delete" data-id="${this.cinemaList[i]._id}">删除</a>&nbsp;&nbsp;&nbsp;
                        <button type="button" class="btn btn-primary btn-lg update" data-toggle="modal" data-target="#updateModal" data-id="${this.cinemaList[i]._id}" >修改</button>
                    </td>
                </tr>
                `
            )
        }
    }

     //渲染分页
    Cinema.prototype.renderPage = function () {
        var prevClassName = this.pageNum === 1 ? 'disabled' : '';
        var nextClassName = this.pageNum === this.totalPage ? 'disabled' : '';
        // 0 清空
        this.dom.pagination.html('');
        // 添加上一页
        this.dom.pagination.append(
            `
            <li class="${prevClassName}" data-num="${this.pageNum - 1}">
                <a href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            `
        )

        // 根据this.totalPage循环多少个li
        for (var i = 0; i < this.totalPage; i++) {
            var className = this.pageNum === i + 1 ? 'active' : '';
            this.dom.pagination.append(
                `
            <li class="${className}" data-num=${i + 1}>
            <a href="#">${i + 1}</a></li>
            `
            )

        }

        // 添加下一页
        this.dom.pagination.append(
            `
        <li class="${nextClassName}" data-num="${this.pageNum + 1}">
        <a href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
        `
        )
    }

    //将所有的dom事件的操作放在这里
    Cinema.prototype.bindDOM = function () {
        var _this = this;
        //点击新增按钮需要调用add
        this.dom.submitAdd.click(function () {
            _this.add();

        })

         // 分页按钮点击事件
         this.dom.pagination.on('click','li',function () {
             // 1、得到页码
            // attr获取属性，如果是自定义属性并且用data- 开头，我们可以更简单的使用data
            var num = Number($(this).data('num'));

             // 1.1 判断是否点击的是相同页，或者<1，或者>总页数
             if(num === _this.pageNum || num < 1 || num > _this.totalPage){
                 return;
             }
             //2.设置给this.pagenum
             _this.pageNum = num;
             // 3、再次调用一下this.search
            _this.search();

         })

          // 删除按钮
          this.dom.table.on('click','.delete',function () {
               // 1.得到id
               var id = $(this).data('id');

               layer.confirm("确认删除吗？",function () {
                    console.log('确认');
                    _this.delete(id);
                    setTimeout(function(){
                        _this.search();
                    },1000)
                
               },function () {
                console.log('取消');
               })
          })


           //修改按钮
           this.dom.table.on('click','.update',function () {
                // 1.得到id
            var id = $(this).data('id');

            _this.getData(id);

            _this.dom.submitUpdate.click(function () {
                _this.update(id);
            }) 
           })


    }



    // 最后
    $(function () {
        var banner = new Cinema(); 
        banner.bindDOM();
        banner.search();//默认渲染第一页
    })


})()












// $(function () {

//     var pageNum = 1;
//     var pageSize = 4;
//     search(pageNum, pageSize);

//     $('#bannerAdd').click(function () {
//         $.post('/cinema/add', {
//             cinemaName: $('#inputEmail3').val(),
//             cinemaAddress: $('#inputPassword3').val(),
//             cinemaPrice: $('#inputPrice').val(),
//             cinemaDistance: $('#inputDistance').val()
//         }, function (res) {
//             if (res.code == 0) {
//                 layer.msg('添加成功');
//             } else {
//                 console.log(res.msg);
//                 layer.msg('网络异常，请稍后重试');
//             }
//             // 手动调用关闭的方法
//             $('#myModal').modal('hide')
//             // 手动清空输入框的内容
//             $('#inputEmail3').val("");
//             $('#inputPassword3').val("");
//             $('#inputPrice').val("");
//             $('#inputDistance').val("");
//         })
//     })
// })


// function search(pageNum, pageSize) {
//     $.get('/cinema/search', {
//         pageNum: pageNum,
//         pageSize: pageSize
//     }, function (res) {
//         if (res.code == 0) {
//             layer.msg('查询成功');
//             var str = "";
//             for (var i = 0; i < res.data.length; i++) {
//                 str += `
//                     <tr> 
//                         <td>${res.data[i]._id}</td>
//                         <td>${res.data[i].name}</td>
//                         <td>${res.data[i].address}</td>
//                         <td>&nbsp;&nbsp;&nbsp;&nbsp;${res.data[i].price}&nbsp;&nbsp;&nbsp;&nbsp;</td>
//                         <td>&nbsp;&nbsp;&nbsp;&nbsp;${res.data[i].distance}&nbsp;&nbsp;&nbsp;&nbsp; </td>
//                         <td>
//                             <a href="javascript:;">&nbsp;&nbsp;&nbsp;&nbsp;删除</a>&nbsp;&nbsp;&nbsp;
//                             <a href="javascript:;">&nbsp;&nbsp;&nbsp;&nbsp;修改</a>
//                         </td>
//                     </tr>
//                 `
//             }
//             $('.banner-table tbody').html(str);
//         } else {
//             console.log(res.msg);
//             layer.msg('网络异常，请稍后重试');
//         }
//     })
// }