(function () {
    var Users = function () {
        //  定义这个页面需要的一些数据
        this.pageNum = 1;
        this.pageSize = 3;
        this.totalPage = 0;
        this.usersList = [];//cinema数据

        // 需要用到的 dom 对象  性能优化 -dom缓存
        this.dom = {
            table: $('.banner-table tbody'),
            nameInput: $('#inputEmail3'),
            passwordInput: $('#inputPassword3'),
            nickNameInput: $('#inputNickName'),
            isAdminInput: $('#inputIsAdmin'),
            pagination: $('.pagination'),    // 分页的ul
            addModal: $('#addModal'),//新增模态框
            submitAdd: $('#bannerAdd'),//确认添加按钮
            updateName: $('#updateName'),
            updatePassword: $('#updatePassword'),
            updateNickName: $('#updateNickName'),
            updateIsAdmin: $('#updateIsAdmin'),
            updateModal: $('#updateModal'),
            submitUpdate: $('#bannerUpdate'),

        }
    }


    // 新增的方法add
    Users.prototype.add = function () {
        var _this = this;
        $.post('/user/add', {
            userName: this.dom.nameInput.val(),
            userPassword: this.dom.passwordInput.val(),
            userNickName: this.dom.nickNameInput.val() || "普通用户",
            userIsAdmin: this.dom.isAdminInput.val() || 0
        }, function (res) {
            if (res.code == 0) {
                layer.msg('添加成功');
                // 请求一下数据
                setTimeout(function () {
                    _this.search()
                }, 1000)
            } else {
                // console.log(res.msg);
                layer.msg('网络异常，请稍后重试');
            }
            // 手动调用关闭的方法
            _this.dom.addModal.modal('hide')
            // 手动清空输入框的内容
            _this.dom.nameInput.val('');
            _this.dom.passwordInput.val('');
            _this.dom.nickNameInput.val('');
            _this.dom.isAdminInput.val('');
        });
    }

    //查询的方法
    Users.prototype.search = function () {
        var _this = this;
        $.get('/user/search', {
            pageNum: this.pageNum,
            pageSize: this.pageSize
        }, function (res) {
            if (res.code == 0) {
                layer.msg("查询成功");
                // 将res.data写入到实例的cinemarList
                _this.usersList = res.data;
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
    Users.prototype.delete = function (id) {
        var id = id;
        $.post('/user/delete', {
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
    Users.prototype.update = function (id) {
        var _this = this;
        var id = id;
        $.post('/user/update', {
            id: id,
            userName: this.dom.updateName.val(),
            userPassword: this.dom.updatePassword.val(),
            userNickName: this.dom.updateNickName.val() ,
            userIsAdmin: this.dom.updateIsAdmin.val() 
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
            _this.dom.updatePassword.val('');
            _this.dom.updateNickName.val('');
            _this.dom.updateIsAdmin.val('');
        });
    }

    //修改时携带原有数据
    Users.prototype.getData = function (id) {
        var _this = this;
        var id = id;
        console.log(id)
        $.post('/user/update1', {
            id: id
        }, function (res) {
            console.log(res.dataName)
            console.log(res.dataPassword)
            _this.dom.updateName.val(res.dataName);
            _this.dom.updatePassword.val(res.dataPassword);
            _this.dom.updateNickName.val(res.dataNickName);
            _this.dom.updateIsAdmin.val(res.dataIsAdmin);
            // _this.dom.updateImg.val(res.dataImg)  

        })
    }

    // 渲染table
    Users.prototype.renderTable = function () {
        //清空
        this.dom.table.html('');
        for (var i = 0; i < this.usersList.length; i++) {
            this.dom.table.append(
                `
                <tr>
                    <td>${this.usersList[i]._id}</td>
                    <td>&nbsp;&nbsp;&nbsp;${this.usersList[i].userName}&nbsp;&nbsp;&nbsp;</td>
                    <td>&nbsp;&nbsp;&nbsp;${this.usersList[i].password}&nbsp;&nbsp;&nbsp;</td>
                    <td>&nbsp;&nbsp;&nbsp;${this.usersList[i].nickName}&nbsp;&nbsp;&nbsp;</td>
                    <td>&nbsp;&nbsp;&nbsp;${this.usersList[i].isAdmin}&nbsp;&nbsp;&nbsp;</td>
                    <td>
                    <a href="javascript:;" class="delete" data-id="${this.usersList[i]._id}">删除</a>&nbsp;&nbsp;&nbsp;
                    <button type="button" class="btn btn-primary btn-lg update" data-toggle="modal" data-target="#updateModal" data-id="${this.usersList[i]._id}" >修改</button>
                    </td>
                </tr>
                `
            )
        }
    }

    //渲染分页
    Users.prototype.renderPage = function () {
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
    Users.prototype.bindDOM = function () {
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
            if (num === _this.pageNum || num < 1 || num > _this.totalPage) {
                return;
            }
            //2.设置给this.pagenum
            _this.pageNum = num;
            // 3、再次调用一下this.search
            _this.search();

        })

        // 删除按钮
        this.dom.table.on('click', '.delete', function () {
            // 1.得到id
            var id = $(this).data('id');

            layer.confirm("确认删除吗？", function () {
                console.log('确认');
                _this.delete(id);
                setTimeout(function () {
                    _this.search();
                }, 1000)

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
        var banner = new Users();
        banner.bindDOM();
        banner.search();//默认渲染第一页
    })


})()