$(function(){

    var pageNum = 1;
    var pageSize = 4;
    search(pageNum,pageSize);

    $('#bannerAdd').click(function(){
        $.post('/cinema/add',{
            cinemaName:$('#inputEmail3').val(),
            cinemaAddress: $('#inputPassword3').val(),
            cinemaPrice:$('#inputScore').val(),
            cinemaDistance:$('#inputStarring').val()
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
            $('#inputEmail3').val("");
            $('#inputPassword3').val("");
            $('#inputScore').val("");
            $('#inputStarring').val("");
        })
    })
})


function search(pageNum,pageSize){
    $.get('/cinema/search',{
        pageNum:pageNum,
        pageSize:pageSize
    },function(res){
        if(res.code == 0){
            layer.msg('查询成功');  
            var str = "";
            for(var i=0;i<res.data.length;i++){
                str += `
                    <tr> 
                        <td>${res.data[i]._id}</td>
                        <td>${res.data[i].name}</td>
                        <td>${res.data[i].address}</td>
                        <td>&nbsp;&nbsp;&nbsp;&nbsp;${res.data[i].price}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td>&nbsp;&nbsp;&nbsp;&nbsp;${res.data[i].distance}&nbsp;&nbsp;&nbsp;&nbsp; </td>
                        <td>
                            <a href="javascript:;">&nbsp;&nbsp;&nbsp;&nbsp;删除</a>&nbsp;&nbsp;&nbsp;
                            <a href="javascript:;">&nbsp;&nbsp;&nbsp;&nbsp;修改</a>
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