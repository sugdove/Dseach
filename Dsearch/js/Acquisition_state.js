/**
 * Created by suge on 2018/3/15
 */
function getStatus() {
    //获取当前正在运行任务
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost + "/crawlTask/crawlStatus",
        dataType: "text",
        async: false,
        success: function (data2) {
            console.log(data2)
            var data = JSON.parse(data2)['body'];
            if(data==="当前无正在执行的任务  "){
                $("#taskStatusTbody").html("<tr><td colspan='5' style='text-align: center'> 当前无任务运行 </td></tr>");
            }
            else{
                let arr = data.substring(1, data.length - 1).split("||");
                let length = arr.length;
                console.log(arr)
                let str = "";
                for (let i = 0; i < length - 1; i++) {
                    let arr2 = arr[i].split(",");
                    let id = arr2[0];
                    let taskname = arr2[1];
                    let time = arr2[2];
                    let status = arr2[3];
                    let details = arr2[4];
                    let status_str="";
                    let cog_str="";
                    console.log(status);
                    time == ""||time===" "?time="------------":time=time;
                    switch (status){
                        case " 执行中... ":
                            status_str = "<button type='button' class='btn btn-success btn-xs'>执行中</button>";
                            cog_str = "<a href='javascript:void(0)' class='btn btn-warning btn-xs stopTask'><i class='fa fa-pencil'></i> 暂停 </a><a href='javascript:void(0)'  class='btn btn-danger btn-xs removeTask'><i class='fa fa-trash-o'></i> 停止 </a>";
                            break;
                        case " 暂停中 ":
                            status_str = "<button type='button' class='btn btn-success btn-xs'>暂停中</button>";
                            cog_str = "<a href='javascript:void(0)'  class='btn btn-primary btn-xs startTask'><i class='fa fa-folder'></i> 继续 </a><a href='javascript:void(0)'  class='btn btn-danger btn-xs removeTask'><i class='fa fa-trash-o'></i> 停止 </a>";
                            break;
                        case " 正在停止... ":
                            status_str = "<button type='button' class='btn btn-success btn-xs'>停止中</button>";
                            cog_str = "<a href='javascript:void(0)'  class='btn btn-primary btn-xs startTask'><i class='fa fa-folder'></i> 继续 </a><a href='javascript:void(0)'  class='btn btn-warning btn-xs stopTask'><i class='fa fa-pencil'></i> 暂停 </a>";
                            break;

                    }
                    str += "<tr><td data-id='"+id+"'>"+taskname+"</td><td>"+time+"</td><td>"+details+"</td><td>"+status_str+"</td><td>"+cog_str+"</td></tr>"
                }
                $("#taskStatusTbody").html(str);
            }

        },
        error: function (data) {
            alert("后台出错" + data)
        }
    });
    //获取已经完成的任务列表
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost + "/crawlTask/crawl",
        data: {curPage: "1", pageSize: "1000"},
        async: false,
        success: function (data2) {
            $("#History_Table").dataTable().fnDestroy();
            var data = JSON.parse(data2)['body']['pageContent'];
            console.log(data);
            if(data[0]==="无历史任务信息"){

            }
            else{
                var length = data.length;
                var str = "";
                for (var i = 0; i < length; i++) {
                    var id = data[i].id;
                    var name = data[i].name;
                    var starttime = new Date(data[i]['starttime']).toLocaleString();
                    var endtime;
                    if(data[i]['endtime']==null){
                        endtime = "--------------------------------------";
                    }
                    else{
                        endtime = new Date(data[i]['endtime']).toLocaleString();
                    }
                    console.log(starttime,endtime)
                    var status = data[i].status;
                    var source = data[i].source;
                    str += "<tr><td data-id='" + id + "'>" + name + "</td><td>" + starttime + "</td><td>" + endtime + "</td><td>" + status + "</td><td>" + source + "</td></tr>";
                }
                $("#History_Table_Tbody").html(str);

            }
            $("#History_Table").dataTable({
                'order': [[1, 'asc']],
                'columnDefs': [
                    {orderable: false, targets: [0]}
                ],
                language: {
                    "sProcessing": "处理中...",
                    "sLengthMenu": "显示 _MENU_ 项结果",
                    "sZeroRecords": "没有匹配结果",
                    "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                    "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
                    "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                    "sInfoPostFix": "",
                    "sSearch": "搜索:",
                    "sUrl": "",
                    "sEmptyTable": "表中数据为空",
                    "sLoadingRecords": "载入中...",
                    "sInfoThousands": ",",
                    "oPaginate": {
                        "sFirst": "首页",
                        "sPrevious": "上一页",
                        "sNext": "下一页",
                        "sLast": "末页"
                    },
                    "oAria": {
                        "sSortAscending": ": 以升序排列此列",
                        "sSortDescending": ": 以降序排列此列"
                    }
                }
            });

        },
        error: function (data) {
            alert("后台错误" + data)
        }
    });
}
getStatus();
setInterval(getStatus,8000);
//清除所有历史任务
$("#CleanHistoryWorks").click(function () {
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost + "/crawlTask/clearCrawlHistory",
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
                    title: '清除成功！',
                    content: '已清除所有历史任务（此确认框会在3秒后消失）',
                    autoClose: '确认|3000',
                    buttons: {
                        确认: function () {
                            getStatus();
                        },
                    }
                });
            }
        },
        error: function (data) {
            alert("后台出错" + data)
        }
    });
});
//继续正在进行任务
var $body = $("body");
$body.on("click",".startTask",function () {
    var id = $(this).parent().parent("tr").children("td").eq(0).data("id");
    $.ajax({
        cache: true,
        type: "post",
        url: "http://"+localhost+"/crawlTask/resume",
        data:{id:id},
        async: false,
        success: function (data) {
            if(JSON.parse(data)['head']['status']===0){
                $.confirm({
                    confirmButtonClass: 'btn btn-info',
                    cancelButtonClass: 'btn-danger',
                    confirmButton:'确认',
                    cancelButton:'取消',
                    animation: 'zoom',
                    closeAnimation: 'rotateXR',
                    title: '继续成功！',
                    content: '此任务继续运行成功（此确认框会在3秒后消失）',
                    autoClose: '确认|3000',
                    buttons: {
                        确认: function () {
                            getStatus();
                        },
                    }
                });
            }


        },
        error:function (data) {
            alert("后台错误"+data)
        }
    });

});
//停止正在进行任务
$body.on("click",".removeTask",function () {
    var id = $(this).parent().parent("tr").children("td").eq(0).data("id");
    $.ajax({
        cache: true,
        type: "post",
        url: "http://"+localhost+"/crawlTask/stop",
        data:{id:id},
        async: false,
        success: function (data) {
            if(JSON.parse(data)['head']['status']==="0"){
                $.confirm({
                    confirmButtonClass: 'btn btn-info',
                    cancelButtonClass: 'btn-danger',
                    confirmButton:'确认',
                    cancelButton:'取消',
                    animation: 'zoom',
                    closeAnimation: 'rotateXR',
                    title: '停止成功！',
                    content: '此任务停止成功（此确认框会在3秒后消失）',
                    autoClose: '确认|3000',
                    buttons: {
                        确认: function () {
                            getStatus();
                        },
                    }
                });
            }


        },
        error:function (data) {
            alert("后台报错"+data)
        }
    });

});
//暂停正在进行任务
$body.on("click",".stopTask",function () {
    var id = $(this).parent().parent("tr").children("td").eq(0).data("id");
    $.ajax({
        cache: true,
        type: "post",
        url: "http://"+localhost+"/crawlTask/pause",
        data:{id:id},
        async: false,
        success: function (data) {
            if(JSON.parse(data)['head']['status']==="0"){
                $.confirm({
                    confirmButtonClass: 'btn btn-info',
                    cancelButtonClass: 'btn-danger',
                    confirmButton:'确认',
                    cancelButton:'取消',
                    animation: 'zoom',
                    closeAnimation: 'rotateXR',
                    title: '暂停成功！',
                    content: '此任务暂停成功（此确认框会在3秒后消失）',
                    autoClose: '确认|3000',
                    buttons: {
                        确认: function () {
                            getStatus();
                        },
                    }
                });
            }
        },
        error:function (data) {
            alert("后台报错"+data)
        }
    });

});
