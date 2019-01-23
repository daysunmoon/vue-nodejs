$(function(){

    var pageNum = 2;
    var pageSize = 4;

    // var pageNum = location.search.split('&')[0].split('=')[1];
    // var pageSize = location.search.split('&')[1].split('=')[1];
  
    // 默认调用一起 search
    search(pageNum, pageSize);

    $('#bannerAdd').click(function(){
        $.post('/banner/add',{
            bannerName: $('#inputEmail3').val(),
            bannerUrl: $('#inputPassword3').val()
        },function(res){
            if(res.code == 0){
                layer.msg('添加成功');  
            }else{
                console.log(res.msg);
                layer.msg('网络异常，请稍后重试');
            }
              // 手动调用关闭的方法
            $('#myModal').modal('hide')
            // 手动清空输入框的内容
            $('#inputEmail3').val('');
            $('#inputPassword3').val('');

        })
    })

   $.get('/banner/search',function(res){
       for(var i=0;i<res.data.length;i++){
           $(".delete").eq(i).click(function(){
               $(this).parent().parent().remove()
           })
       }
   })

})


/**
 * 查询banner数据的方法
 * @param {Number} pageNum 当前的页数
 * @param {Number} pageSize 每页显示的条数
 */
function search(pageNum,pageSize){
    $.get('/banner/search',{
        pageNum: pageNum, 
        pageSize: pageSize
    },function(res){
        if(res.code == 0){
            layer.msg('查询成功');

            var str = "";
            for(var i=0;i<res.data.length;i++){
                str += `
                <tr>
                <td>${res.data[i]._id}</td>
                <td>${res.data[i].name}</td>
                <td>
                  <img class="banner-img" src="${res.data[i].imgUrl}"
                    alt="">
                </td>
                <td>
                  <a href="javascript:;" class="delete">删除</a>&nbsp;&nbsp;&nbsp;
                  <a href="javascript:;" class="update">修改</a>
                </td>
            </tr>
                `
            }
            $('.banner-table tbody').html(str);
        }else{
            console.log(res.msg);
            layer.msg('网络异常，请稍后重试');
        }
    })
}