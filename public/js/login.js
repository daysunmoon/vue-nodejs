(function () {
    var User = function () {
        this.btnLock = false;//登录 按钮的锁

        this.dom = {
            submitBtn: $('#btn'),
            userNameInput: $('input[type=text]'),
            passwordInput: $('input[type=password]')
        }
    }

    User.prototype.bindDOM = function () {
        var _this = this;
        this.dom.submitBtn.click(function () {
            //发送ajax请求之前，先判断是否有锁
            if (!_this.btnLock) {
                //加锁，发请求
                _this.btnLock = true;
                _this.handleLogin();
            }
        })
    }

    // 登录方法，调取ajax
    User.prototype.handleLogin = function () {
        var _this = this;
        $.post('/user/login', {
            userName: this.dom.userNameInput.val(),
            password: this.dom.passwordInput.val()
        }, function (res) {
            if (res.code === 0) {
                // 登录成功
                layer.msg('登录成功');
                console.log(res.data);

                setTimeout(function () {
                    // 跳转到首页
                    location.href = '/';
                }, 1000)
            } else {
                // 登录失败
                layer.msg(res.msg);
            }
              // 记得 解锁
            _this.btnLock = false;
        })
    }


    // 最后
    var user = new User();
    user.bindDOM();
})()