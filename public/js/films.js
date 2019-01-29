(function () {
    //定义这个文件操作的构造函数
    var Films = function () {
        //  定义这个页面需要的一些数据
        this.pageNum = 1;
        this.pageSize = 3;
        this.totalPage = 0;
        this.filmsList = [];//films数据

        // 需要用到的 dom 对象  性能优化 -dom缓存
        this.dom = {
            table: $('.banner-table tbody'),
            nameInput: $('#inputEmail3'),
            urlInput: $('#inputPassword3'),
            starringInput: $('#inputStarring'),
            scoreInput: $('#inputScore'),
            countryInput: $('#inputCountry'),
            timeInput: $('#inputTime'),
            pagination: $('.pagination'),    // 分页的ul
            addModal: $('#addModal'),//新增模态框
            submitAdd: $('#bannerAdd'),//确认添加按钮
            updateName: $('#updateName'),
            updateImg: $('#updateImg'),
            updateScore: $('#updateScore'),
            updateStarring: $('#updateStarring'),
            updateCountry: $('#updateCountry'),
            updateTime: $('#updateTime'),
            updateModal: $('#updateModal'),
            submitUpdate: $('#bannerUpdate'),

        }
    }

    // 新增的方法add
    Films.prototype.add = function () {
        var _this = this;

        // ajax提交，并带有文件

        // 1、实例化一个formData对象
        var formData = new FormData();
        // 2、给formData对象加属性
        formData.append('filmsName', this.dom.nameInput.val());

        formData.append('filmsImg', this.dom.urlInput[0].files[0]);

        formData.append('filmsScore', this.dom.scoreInput.val());

        formData.append('filmsStarring', this.dom.starringInput.val());

        formData.append('filmsCountry', this.dom.countryInput.val());

        formData.append('filmsTime', this.dom.timeInput.val());

        $.ajax({
            url: '/films/add',
            method: 'POST',
            //！！！！上传文件的时候需要设置这两个属性
            contentType: false,
            processData: false,
            data: formData,
            success: function () {
                layer.msg('添加成功');
                setTimeout(function () {
                    _this.search();
                }, 1000)
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
                _this.dom.scoreInput.val('');
                _this.dom.starringInput.val('');
                _this.dom.countryInput.val('');
                _this.dom.timeInput.val('');
            }
        })
    }


    // 查询的方法search
    Films.prototype.search = function () {
        var _this = this;
        $.get('/films/search', {
            pageNum: this.pageNum,
            pageSize: this.pageSize
        }, function (res) {
            if (res.code == 0) {
                layer.msg('查询成功');

                // 将res.data写入到实例的filmsList
                _this.filmsList = res.data;
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


    //修改时携带原有数据
    Films.prototype.getData = function (id) {
        var _this = this;
        id = id;
        console.log(id)
        $.post('/films/update1',{
            id:id
        },function(res){
            console.log( res.dataName)
            console.log( res.dataImg)
            _this.dom.updateName.val(res.dataName) ;
            // _this.dom.updateImg.val(res.dataImg)  
            _this.dom.updateScore.val(res.dataScore) ;
            _this.dom.updateStarring.val(res.dataStarring) ;
            _this.dom.updateCountry.val(res.dataCountry) ;
            _this.dom.updateTime.val(res.dataTime) ;
        })
    }

    //修改的方法   
    Films.prototype.update = function (id) {
        var _this = this;
        id = id;
        // ajax提交，并带有文件

        // 1、实例化一个formData对象
        var formData = new FormData();
        // 2、给formData对象加属性
        formData.append('id',id)
        formData.append('filmsName', this.dom.updateName.val());

        formData.append('filmsImg', this.dom.updateImg[0].files[0]);

        formData.append('filmsScore', this.dom.updateScore.val());

        formData.append('filmsStarring', this.dom.updateStarring.val());

        formData.append('filmsCountry', this.dom.updateCountry.val());

        formData.append('filmsTime', this.dom.updateTime.val());

        $.ajax({
            url: '/films/update',
            method: 'POST',
            //！！！！上传文件的时候需要设置这两个属性
            contentType: false,
            processData: false,
            data: formData,
            success: function () {
                layer.msg('修改成功');
                setTimeout(function () {
                    _this.search();
                }, 1000)
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
                _this.dom.updateScore.val('');
                _this.dom.updateStarring.val('');
                _this.dom.updateCountry.val('');
                _this.dom.updateTime.val('');
            }
        })
    }

    // 渲染table
    Films.prototype.renderTable = function () {
        //清空
        this.dom.table.html('');
        for (var i = 0; i < this.filmsList.length; i++) {
            this.dom.table.append(
                `
                <tr> 
                    <td>${this.filmsList[i]._id}</td>
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

    //渲染分页
    Films.prototype.renderPage = function () {
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
        for (var i = 0; i < this.totalPage;i++) {
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

    Films.prototype.bindDOM = function () {
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
                $.post('/films/delete', {
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
           
            _this.dom.submitUpdate.click(function () {
                _this.update(id);

            })
        })
    }

// 最后
    $(function () {
        var banner = new Films();
        banner.bindDOM();
        banner.search();//默认渲染第一页
    })

})()












// $(function () {
//     var pageNum = 1;
//     var pageSize = 6;

//     search(pageNum, pageSize);

//     $('#bannerAdd').click(function () {
//         $.post('/films/add', {
//             filmsName: $('#inputEmail3').val(),
//             filmsUrl: $('#inputPassword3').val(),
//             filmsScore: $('#inputScore').val(),
//             filmsStarring: $('#inputStarring').val()
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
//             $('#inputEmail3').val('');
//             $('#inputPassword3').val('');
//             $('#inputScore').val('');
//             $('#inputStarring').val('')
//         })
//     })
// })

// function search(pageNum, pageSize) {
//     $.get('/films/search', {
//         pageNum: pageNum,
//         pageSize: pageSize
//     }, function (res) {
//         if (res.code == 0) {
//             layer.msg('查询成功');
//             var str = '';
//             for (var i = 0; i < res.data.length; i++) {
//                 str += `
//                 <tr> 
//                         <td>${res.data[i]._id}</td>
//                         <td>${res.data[i].name}</td>
//                         <td>
//                             <img class="banner-img" src="${res.data[i].imgUrl}"
//                             alt="">
//                         </td>
//                         <td>${res.data[i].score}</td>
//                         <td>${res.data[i].starring} </td>
//                         <td>
//                             <a href="javascript:;">&nbsp;&nbsp;&nbsp;&nbsp;删除</a>&nbsp;&nbsp;&nbsp;
//                             <a href="javascript:;">&nbsp;&nbsp;&nbsp;&nbsp;修改&nbsp;&nbsp;</a>
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