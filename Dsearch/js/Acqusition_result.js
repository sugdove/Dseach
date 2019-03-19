/**
 * Created by suge on 2018/3/15
 */
var q
if(document.URL.indexOf("?")===-1){

}
else{
     q = decodeURI((document.URL.split("?")[1]).split("=")[1]);
}

var ps = 10;
var sr = "";
//获取搜索结果方法
var totalpage;
function getResult(localhost, q, p,ps,sr) {
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost + "/serach/go",
        dataType:"text",
        data: {q: q, p: p,ps:ps,sr:sr},
        async: false,
        success: function (data2) {
            var data = JSON.parse(data2)['body'];
            var length = data.length;
            var srest1 = data[0]['srest1'];
            var srest2 = data[0]['srest2'];
            var sunserach = data[0].sunserach;
            var sword = data[0].sword;
            var utime = data[0].utime;
            var str1 = srest1+"-"+srest2;
            var str2 ="(耗时:"+utime+"ms)";
            var total_page = Math.ceil(sunserach/10);

            $("#srest").html(str1);
            $("#sunserach").html(sunserach);//总共数据条数
            $("#sword").text(sword); //检索词
            $("#utime").html(str2);  //消耗时间
            $("#nowPage").text(p);  //当前页码
            $("#max_page").attr("max",total_page); //让input不超过最大页
            if(JSON.parse(data2)['body'][0]['sunserach']==="0"){
            var str = "<h2 style='margin-left: 10px'><img src='images/alertDanger.png' alt='警告' style=' width: 40px; margin-right: 18px;margin-top: -12px;'>"+JSON.parse(data2)['body'][1]['mesInfo']+"</h2>"+"<div style='padding-left: 70px'>"+JSON.parse(data2)['body'][1]['mesTip']+"</div>"
              $("#result_content").html(str);

            }
            else{

                //totalpage = sunserach;
                var str = "";
                for (var i = 1; i < length; i++) {
                    var content = data[i].content;
                    var id = data[i].id;
                    var time = data[i].time;
                    var title = data[i].title;
                    str += "<li><div class='message_wrapper'><h4 class='heading hover-red-2 showTitle' data-id='"+id+"'>"+title+"</h4><blockquote class='message'>"+content+"</blockquote><span class='label' title='时间' style='color:green'>"+time+"</span><br /></div></li>";
                }
                $("#result_content").html(str);
            }

        },
        error: function (data) {
            alert("后台出错" + data)
        }
    });
}
$.ajax({
    cache: true,
    type: "post",
    url: "http://" + localhost + "/serach/go",
    dataType:"text",
    data: {q: q, p: 1},
    async: false,
    success: function (data2) {
            var data = JSON.parse(data2)['body'];
            var length = data.length;
            var srest1 = data[0]['srest1'];
            var srest2 = data[0]['srest2'];
            var sunserach = data[0].sunserach;
            var sword = data[0].sword;
            var utime = data[0].utime;
            var str1 = srest1+"-"+srest2;
            var str2 ="(耗时:"+utime+"ms)";
            var total_page = Math.ceil(sunserach/10);
            totalpage = sunserach;

    },
});
var $body = $("body");
//当前页搜索情况
$body.on("click","#local_search",function () {
     q = $(this).parent().find("input[type='text']").val();
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost + "/serach/go",
        dataType:"text",
        data: {q: q, p: 1},
        async: false,
        success: function (data2) {
            var data = JSON.parse(data2)['body'];
            var length = data.length;
            var srest1 = data[0]['srest1'];
            var srest2 = data[0]['srest2'];
            var sunserach = data[0].sunserach;
            var sword = data[0].sword;
            var utime = data[0].utime;
            var str1 = srest1+"-"+srest2;
            var str2 ="(耗时:"+utime+"ms)";
            var total_page = Math.ceil(sunserach/10);
            totalpage = sunserach;

        },
    });
    init_page(localhost,q,ps,sr);
});
function init_page(localhost,q,ps,sr){
    $('#page_box').paging({
        initPageNo: 1, // 初始页码
        totalPages: Math.ceil(totalpage/ps), //总页数
        totalCount: '合计' + totalpage + '条数据', // 条目总数
        slideSpeed: 600, // 缓动速度。单位毫秒
        jump: true, //是否支持跳转
        callback: function(page) { // 回调函数
            getResult(localhost, q, page,ps,sr);
        }
    })
}
/*function init_page2(localhost,id){
    $('#page_box_2').paging({
        initPageNo: 1, // 初始页码
        totalPages: Math.ceil(totalpage/10), //总页数
        totalCount: '合计' + totalpage + '条数据', // 条目总数
        slideSpeed: 600, // 缓动速度。单位毫秒
        jump: true, //是否支持跳转
        callback: function(page) { // 回调函数
            preview(localhost, id, page);
        }
    })
}*/
init_page(localhost,q,ps,sr);
//显示详细信息API
function preview(localhost,id,q2) {
    $.ajax({
        cache: true,
        type: "get",
        url: "http://"+localhost+"/serach/preview",
        async: false,
        data:{id:id,t:"preview",p:q2},
        success: function (data2) {
            let data = JSON.parse(data2)['body'];
            let pre = data.pre;
            let filePath = data.filePath;
            let curpage = data.curpage;
            let id = data.id;
            let title = data.title;
            $("#nowPage").text(curpage);  //当前页码
            totalPage2 = data.pagesum;
            $("#myModalLabel").html("<form action='http://"+localhost2+"/rivu/download.rv' type='get'>"+title+"<i class='fa fa-download FileDownload' data-id='"+id+"' data-filepath='"+filePath+"' title='下载'></i><input type='text' value='"+id+"' name='id' style='display:none'></form>");
            $("#details_content").html("<textarea style='width: 585px;height: 446px;resize: none;' readonly>"+pre+"</textarea>")
        },
        error:function (data) {
            alert("后台出错"+data);
        }
    });
}
//点击标题出现模态框，显示所有信息
var q2;
var id;
var totalPage2;
$body.on("click",".showTitle",function () {
     q2 = 1;
     id = $(this).data("id");
    preview(localhost,id,q2);
    $("#myModal").modal("show");
    $("#max_page").val("");
    $("#max_page").attr("max",totalPage2); //让input不超过最大页
    $("#total_page").text(totalPage2);//共totalpage页
});
//点击跳转到具体页码
$body.on("click","#go_page",function () {
    var page = $(this).parent().children("input[type='number']").val();
    preview(localhost,id,page);
});
//点击上一页
$body.on("click","#previousPage",function () {
    var nowPage = parseInt($("#nowPage").text());
    if(nowPage>=2){
        preview(localhost,id,nowPage-1)
    }
});
//点击下一页
$body.on("click","#nextPage",function () {
    var nowPage = parseInt($("#nowPage").text());
    if(nowPage<totalPage2){
        preview(localhost,id,nowPage+1)
    }
});
//转换每页显示页数
$body.on("change","#perPageNum",function () {
    ps = $(this).val();
    init_page(localhost,q,ps,sr);
});
//转换排序模式
$body.on("click",".link",function () {
    var link = $(this).text();
    switch (link){
        case "相关度":
            sr = "";
            break;
        case "title":
            sr = "title desc";
            break;
        case "size":
            sr = "size desc";
            break;
        case "createtime":
            sr = "createtime desc";
            break;
    }
    $(".choosed").addClass("link").removeClass("choosed");
    $(this).addClass("choosed").removeClass("link");
    getResult(localhost, q, 1,ps,sr)
});
//从数据库中删除检索结果
$body.on("click","#deleteResult",function () {
    $.confirm({
        confirmButtonClass: 'btn btn-info',
        cancelButtonClass: 'btn-danger',
        confirmButton: '确认',
        cancelButton: '取消',
        animation: 'zoom',
        closeAnimation: 'rotateXR',
        title: '删除？',
        content: '确认是否删除（此确认框会在8秒后消失）',
        autoClose: '否|8000',
        buttons: {
            deleteUser: {
                text: '是',
                action: function () {
                    $.ajax({
                        cache: true,
                        type: "get",
                        url: "http://" + localhost + "/serach/delQuery",
                        data:{c:true,q:q},
                        async: false,
                        success: function (data) {
                            if(JSON.parse(data)['head']['status']==="0"){
                                $.confirm({
                                    confirmButtonClass: 'btn btn-info',
                                    cancelButtonClass: 'btn-danger',
                                    confirmButton: '确认',
                                    cancelButton: '取消',
                                    animation: 'zoom',
                                    closeAnimation: 'rotateXR',
                                    title: '删除成功！',
                                    content: '已删除此检索结果（此确认框会在3秒后消失）',
                                    autoClose: '确认|3000',
                                    buttons: {
                                        确认: function () {
                                            totalpage = 1;
                                            init_page(localhost,q,ps,sr);
                                        },
                                    }
                                });
                            }
                        },
                        error: function (data) {
                            alert("后台出错" + data)
                        }
                    });
                }
            },
            否: function () {

            },
        }
    });

});
//下载文件操作
$body.on("click",".FileDownload",function () {
    let $this = $(this);
    $.confirm({
        confirmButtonClass: 'btn btn-info',
        cancelButtonClass: 'btn-danger',
        confirmButton: '确认',
        cancelButton: '取消',
        animation: 'zoom',
        closeAnimation: 'rotateXR',
        title: '下载？',
        content: '确认是否下载（此确认框会在8秒后消失）',
        autoClose: '否|8000',
        buttons: {
            deleteUser: {
                text: '是',
                action: function () {
                    $this.parent('form').submit();
                }
            },
            否: function () {

            },
        }
    });

});