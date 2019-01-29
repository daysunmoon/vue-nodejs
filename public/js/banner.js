(function () {

    //定义这个文件操作的构造函数
    var Banner = function () {
        //  定义这个页面需要的一些数据
        this.pageNum = 1;
        this.pageSize = 3;
        this.totalPage = 0;
        this.bannerList = [];//banner数据

        // 需要用到的 dom 对象  性能优化 -dom缓存
        this.dom = {
            table: $('.banner-table tbody'),
            nameInput: $('#inputEmail3'),
            urlInput: $('#inputPassword3'),
            pagination: $('.pagination'),    // 分页的ul
            addModal: $('#addModal'),//新增模态框
            submitAdd: $('#bannerAdd'),//确认添加按钮
            updateName: $('#updateName'),
            updateImg: $('#updateImg'),
            updateModal: $('#updateModal'),
            submitUpdate: $('#bannerUpdate'),

        }
    }

    // 新增的方法add
    Banner.prototype.add = function () {
        var _this = this;

        // ajax提交，并带有文件

        // 1、实例化一个formData对象
        var formData = new FormData();
        // 2、给formData对象加属性
        formData.append('bannerName', this.dom.nameInput.val());
        formData.append('bannerImg', this.dom.urlInput[0].files[0]);

        $.ajax({
            url: '/banner/add',
            method: 'POST',
            //！！！！上传文件的时候需要设置这两个属性
            contentType: false,
            processData: false,
            data: formData,
            success: function () {
                layer.msg('添加成功');
                setTimeout(function(){
                _this.search();
                },1000)
            },
            error: function (err) {
                console.log(err.message);
                layer.msg('网络异常，请稍后重试');
            },
            complete: function () {
                // 手动调用关闭的方法
                _this.dom.addModal.modal('hide')
                // 手动清空输入框的内容
                _this.dom.nameInput.val('');
                _this.dom.urlInput.val('');
            }
        })
    }


    //修改时携带原有数据
    Banner.prototype.getData = function (id) {
        var _this = this;
        id = id;
        console.log(id)
        $.post('/banner/update1',{
            id:id
        },function(res){
            console.log( res.dataName)
            console.log( res.dataImg)
            _this.dom.updateName.val(res.dataName) 
            // _this.dom.updateImg.val(res.dataImg)  
           
        })
    }
  

    //修改的方法
    Banner.prototype.update = function (id) {
        var _this = this;
        id = id;
        // ajax提交，并带有文件
        // 1、实例化一个formData对象
        var formData = new FormData();
        // 2、给formData对象加属性
        formData.append('id',id)
        formData.append('bannerName', this.dom.updateName.val());
        formData.append('bannerImg', this.dom.updateImg[0].files[0]);

        $.ajax({
            
            url: '/banner/update',
            method: 'POST',
            //！！！！上传文件的时候需要设置这两个属性
            contentType: false,
            processData: false,
            data: formData,
            success: function () {
                layer.msg('修改成功');
                setTimeout(function(){
                    _this.search();
                },1000)
            },
            error: function (err) {
                console.log(err.message);
                layer.msg('网络异常，请稍后重试');
            },
            complete: function () {
                // 手动调用关闭的方法
                _this.dom.updateModal.modal('hide')
                // 手动清空输入框的内容
                _this.dom.updateName.val('');
                _this.dom.updateImg.val('');
            }
        })
    }
    // Banner.prototype.add = function () {
    //     var _this = this;
    //     $.post('/banner/add', {
    //         bannerName: this.dom.nameInput.val(),
    //         bannerUrl: this.dom.urlInput.val()
    //     }, function (res) {
    //         if (res.code == 0) {
    //             layer.msg('添加成功');
    //             // 请求一下数据
    //             _this.search()
    //         } else {
    //             // console.log(res.msg);
    //             layer.msg('网络异常，请稍后重试');
    //         }
    //         // 手动调用关闭的方法
    //         _this.dom.addModal.modal('hide')
    //         // 手动清空输入框的内容
    //         _this.dom.nameInput.val('');
    //         _this.dom.urlInput.val('');
    //     });
    // }

    // 查询的方法search
    Banner.prototype.search = function () {
        var _this = this;
        $.get('/banner/search', {
            pageNum: this.pageNum,
            pageSize: this.pageSize
        }, function (res) {
            if (res.code == 0) {
                layer.msg('查询成功');

                // 将res.data写入到实例的bannerList
                _this.bannerList = res.data;
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

    // 删除的方法
    // Banner.prototype.delete=function(){
    //     var _this = this;
    //     $.post('/banner/delete',{
    //         // id:
    //     },function(res){
    //         if(res.code === 0){
    //             layer.msg('删除成功');

    //         }else{
    //             layer.msg('网络异常，请稍后重试'); 
    //         }
    //     })
    // }

    // 渲染table
    Banner.prototype.renderTable = function () {
        //清空
        this.dom.table.html('');
        for (var i = 0; i < this.bannerList.length; i++) {
            this.dom.table.append(
                `
                <tr>
                    <td>${this.bannerList[i]._id}</td>
                    <td>${this.bannerList[i].name}</td>
                    <td>
                    <img class="banner-img" src="${this.bannerList[i].imgUrl}"
                        alt="">
                    </td>
                    <td>
                    <a href="javascript:;" class="delete" data-id="${this.bannerList[i]._id}">删除</a>&nbsp;&nbsp;&nbsp;
                    <button type="button" class="btn btn-primary btn-lg update" data-toggle="modal" data-target="#updateModal" data-id="${this.bannerList[i]._id}" >修改</button>
                    </td>
                </tr>  
                `
            )
        }

    }

    //渲染分页
    Banner.prototype.renderPage = function () {
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
    Banner.prototype.bindDOM = function () {
        var _this = this;
        //点击新增按钮需要调用add
        this.dom.submitAdd.click(function () {
            _this.add();

        })

        // 分页按钮点击事件
        this.dom.pagination.on('click', 'li', function () {
            // 1、得到页码
            // attr获取属性，如果是自定义属性并且用data- 开头，我们可以更简单的使用data
            var num = Number($(this).data('num'));

            // 1.1 判断是否点击的是相同页，或者<1，或者>总页数
            if (_this.pageNum === num || num < 1 || num > _this.totalPage) {
                return;
            }
            // 2、设置给this.pageNum
            _this.pageNum = num;
            // 3、再次调用一下this.search
            _this.search();
        })

        // 删除按钮
        this.dom.table.on('click', '.delete', function () {
            // 1.得到id
            var id = $(this).data('id');

            // 2.二次确认框
            layer.confirm('确认删除吗？', function () {
                setTimeout(function(){
                    _this.search();
                },1000)
                console.log('确认');
                $.post('/banner/delete', {
                    id: id
                }, function (res) {
                    if (res.code === 0) {
                        layer.msg('删除成功');

                    } else {
                        layer.msg('网络异常，请稍后重试');
                    }
                })
            }, function () {
                console.log('取消');
            })
        })

        //修改按钮
        this.dom.table.on('click', '.update', function () {
            // 1.得到id
            var id = $(this).data('id');

            _this.getData(id);
            // _this.dom.updateName.val() =  _this.dom.nameInput.val();
            // _this.dom.updateImg.val() =  _this.dom.urlInput.val();
           
            _this.dom.submitUpdate.click(function () {
                _this.update(id);

                // $.post('/banner/update', {
                //     id: id,
                //     bannerName: _this.dom.updateName.val(),
                //     bannerImg: _this.dom.updateImg.val()
                //     // bannerName:
                // }, function (res) {
                //     if (res.code === 0) {
                //         layer.msg('修改成功');
                //         // _this.search();
                //     } else {
                //         layer.msg('网络异常，请稍后重试');
                //     }
                //     //   手动调用关闭的方法
                //     _this.dom.updateModal.modal('hide')
                //     // 手动清空输入框的内容
                //     _this.dom.updateName.val('');
                //     _this.dom.updateImg.val('');
                // })

            })

        })

    }


    // 最后
    $(function () {
        var banner = new Banner();
        banner.bindDOM();
        banner.search();//默认渲染第一页
    })

})()



// $(function(){


//     var pageNum = 2;
//     var pageSize = 4;


//     // 默认调用一起 search
//     search(pageNum, pageSize);

//     $('#bannerAdd').click(function(){
//         $.post('/banner/add',{
//             bannerName: $('#inputEmail3').val(),
//             bannerUrl: $('#inputPassword3').val()
//         },function(res){
//             if(res.code == 0){
//                 layer.msg('添加成功');  
//             }else{
//                 console.log(res.msg);
//                 layer.msg('网络异常，请稍后重试');
//             }
//               // 手动调用关闭的方法
//             $('#myModal').modal('hide')
//             // 手动清空输入框的内容
//             $('#inputEmail3').val('');
//             $('#inputPassword3').val('');

//         })
//     })


// })


// /**
//  * 查询banner数据的方法
//  * @param {Number} pageNum 当前的页数
//  * @param {Number} pageSize 每页显示的条数
//  */
// function search(pageNum,pageSize){
//     $.get('/banner/search',{
//         pageNum: pageNum, 
//         pageSize: pageSize
//     },function(res){
//         if(res.code == 0){
//             layer.msg('查询成功');

//             var str = "";
//             for(var i=0;i<res.data.length;i++){
//                 str += `
//                 <tr>
//                 <td>${res.data[i]._id}</td>
//                 <td>${res.data[i].name}</td>
//                 <td>
//                   <img class="banner-img" src="${res.data[i].imgUrl}"
//                     alt="">
//                 </td>
//                 <td>
//                   <a href="javascript:;" class="delete">删除</a>&nbsp;&nbsp;&nbsp;
//                   <a href="javascript:;" class="update">修改</a>
//                 </td>
//             </tr>
//                 `
//             }
//             $('.banner-table tbody').html(str);
//         }else{
//             console.log(res.msg);
//             layer.msg('网络异常，请稍后重试');
//         }
//     })
// }