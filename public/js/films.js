$(function(){
    var pageNum = 1;
    var pageSize = 6;

    search(pageNum,pageSize);

    $('#bannerAdd').click(function(){
        $.post('/films/add',{
            filmsName:$('#inputEmail3').val(),
            filmsUrl: $('#inputPassword3').val(),
            filmsScore:$('#inputScore').val(),
            filmsStarring:$('#inputStarring').val()
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
             $('#inputScore').val('');
             $('#inputStarring').val('')
        })
    })
}) 

function search(pageNum,pageSize){
    $.get('/films/search',{
        pageNum : pageNum,
        pageSize : pageSize
    },function(res){
        if(res.code == 0){
            layer.msg('查询成功');  
            var str = '';
            for(var i=0;i<res.data.length;i++){
                str += `
                <tr> 
                        <td>${res.data[i]._id}</td>
                        <td>${res.data[i].name}</td>
                        <td>
                            <img class="banner-img" src="${res.data[i].imgUrl}"
                            alt="">
                        </td>
                        <td>${res.data[i].score}</td>
                        <td>${res.data[i].starring} </td>
                        <td>
                            <a href="javascript:;">&nbsp;&nbsp;&nbsp;&nbsp;删除</a>&nbsp;&nbsp;&nbsp;
                            <a href="javascript:;">&nbsp;&nbsp;&nbsp;&nbsp;修改&nbsp;&nbsp;</a>
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