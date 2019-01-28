(function(){
    var User = function () {
        this.btnLock = false;//注册 按钮的锁
        this.nameCheckLock = false;
        this.nameIsNull = false;
        this.nickName = '普通用户';
        this.Admin = 0;

        this.dom = {
            submitBtn: $('#btn'),
            userNameInput: $('#name'),
            passwordInput: $('#pwd'),
            nickNameInput:$('#nc'),
            isAdminInput:$('#gly'),
        }
    }

    User.prototype.bindDOM = function () {
        var _this = this;
        this.dom.userNameInput.blur(function(){
            if(_this.dom.userNameInput.val()==''){
                layer.msg('用户名不能为空')
            }else{
                _this.nameIsNull = true;
                _this.checkUserName()
            }
           

        })

        this.dom.submitBtn.click(function () {
            //发送ajax请求之前，先判断是否有锁
            console.log(_this.nameCheckLock)
            if (!_this.btnLock && _this.nameCheckLock && _this.nameIsNull) {
               //加锁，发请求
               _this.btnLock = true;
               _this.handleRegister();
           }
       })
        
    }


    //判断用户名是否存在
    User.prototype.checkUserName = function(){
        var _this = this;
        $.post('/user/register1',{
            userName:this.dom.userNameInput.val()
        },function(res){
            if(res.code == 0){
                layer.msg(res.msg);
                _this.nameCheckLock = true;
                console.log(_this.nameCheckLock)
            }else{
                layer.msg(res.msg);
            }
        })
    }

   // 注册方法，调取ajax
    User.prototype.handleRegister = function(){
        $.post('/user/register',{
            userName: this.dom.userNameInput.val(),
            password: this.dom.passwordInput.val(),
            nickName:this.dom.nickNameInput.val() || this.nickName,
            isAdmin:this.dom.isAdminInput.val() || this.isAdmin
        },function(res){
            if (res.code === 0) {
                // 注册成功
                layer.msg(res.msg);
                console.log(res.data);

                setTimeout(function () {
                    // 跳转到登录页
                    location.href = '/login.html';
                }, 1000)
            } else {
                // 注册失败
                layer.msg("网络异常，请稍后重试");
                console.log(res.msg)
            }
              // 记得 解锁
            _this.btnLock = false;
        })
    }

// 最后
var user = new User();
user.bindDOM();
    

})()