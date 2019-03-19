/**
 * Created by suge on 2018/3/14
 */
//添加备份路径jquery.validate方法
$.validator.addMethod("backpath",function(value,element,params){
    //var reg= /^([a-zA-Z]:\/(\w*\/)*\w*)|([a-zA-Z]:\\(\w*\\)*\w*)|\/(\w*\/)*\w*|\\(\w*\\)*\w*$/;
    var reg= /^([a-zA-Z]:(\\[0-9a-zA-Z]*)+)|([a-zA-Z]:(\/[0-9a-zA-Z]*)+)$/;
    /*var reg= /^([a-zA-Z]:((\\[0-9a-zA-Z]+)+)|(\\))|([a-zA-Z]:((\/[0-9a-zA-Z]+)+)|(\/))$/;*/
    //var reg2=/\/.+$/;
    if(reg.test(value)){
        return true;
    }else{
        return false;
    }
},"请输入备份路径，例c:\\a 或 c:/a");
//新增采集
$("#MySQL-form").validate({
    submitHandler: function() {
        var taskname = $("input[name='taskname']").val();
        var subdir;
        if($("input[name='subdir']").is(":checked")===true){
            subdir=1;
        }
        else{
            subdir=0;
        }
        var filepath = $("#message").val();
        var nativexml=0;
        var arr=[];
        $("#myModal").find("input[name='doctype']:checked").each(function () {
            arr.push($(this).val());
        });
        var doctype = arr.join(",");
        var json;
        if($("input[name='parseparam']").is(":checked")===true){
            json ={
                taskname:taskname,
                subdir:subdir,
                parseparam:1,
                filepath:filepath,
                nativexml:nativexml,
                doctype:doctype
            }
        }
        else{
            json = {
                taskname:taskname,
                subdir:subdir,
                filepath:filepath,
                nativexml:nativexml,
                doctype:doctype
            }

        }
        $.ajax({
            cache: true,
            type: "post",
            url: "http://"+localhost+"/localFile/add",
            data:json,
            async: false,
            success: function (data) {
                $.confirm({
                    confirmButtonClass: 'btn btn-info',
                    cancelButtonClass: 'btn-danger',
                    confirmButton:'确认',
                    cancelButton:'取消',
                    animation: 'zoom',
                    closeAnimation: 'rotateXR',
                    title: '添加成功！',
                    content: '本地文件采集添加成功（此确认框会在3秒后消失）',
                    autoClose: '确认|3000',
                    buttons: {
                        确认: function () {
                            $("#myModal").modal("hide");
                            location.reload();
                        },
                    }
                });

            },

            error:function (data) {
                console.log(data)
            }
        });
    }
});
//初始调用法法
(function () {
    GetLocalFile();
}());
//获取所有本地文件采集任务
function GetLocalFile(){
    $.ajax({
        cache: true,
        type: "post",
        url: "http://"+localhost+"/localFile/list",
        data:{curPage:"1",pageSize:"1000"},
        async: false,
        success: function (data2) {
            var data = JSON.parse(data2)['body'];
            console.log(data)
            var str = "";
            var content = data['pageContent'];
            for(var key in content){
                var taskname = content[key].taskname;
                var id = content[key].id;
                var filepath = content[key].filepath;
                var doctype = content[key].doctype;
                var taskstatus = content[key].taskstatus;
                var subdir = content[key].subdir;
                var doctypeArr = doctype.split(",");
                var str_doctype = "";
                var operation="";
                for(var key2 in doctypeArr){
                    str_doctype +="<a class='btn btn-info btn-xs'><i class='fa fa-file'></i> "+doctypeArr[key2]+"</a>"
                }
                switch (taskstatus){
                    case "":
                        taskstatus = "<a class='btn btn-warning btn-xs'>未启动</a>";
                        operation ="<a class='btn btn-primary btn-xs run'><i class='fa fa-play'></i> 启动 </a><a class='btn btn-info btn-xs change'><i class='fa fa-search'></i> 修改 </a><a class='btn btn-danger btn-xs delete'><i class='fa fa-trash-o'></i> 删除 </a>"
                        break;
                    case "0":
                        taskstatus = "<a class='btn btn-primary btn-xs'>已启动</a>";
                        operation ="<a class='btn btn-primary btn-xs run'><i class='fa fa-play'></i> 启动 </a><a class='btn btn-info btn-xs change'><i class='fa fa-search'></i> 修改 </a><a class='btn btn-danger btn-xs delete'><i class='fa fa-trash-o'></i> 删除 </a>"
                        break;
                    case "1":
                        taskstatus = "<a class='btn btn-info btn-xs'>启动中</a>";
                        operation ="<a class='btn btn-warning btn-xs stop'><i class='fa fa-stop'></i> 停止 </a><a class='btn btn-info btn-xs change'><i class='fa fa-search'></i> 修改 </a><a class='btn btn-danger btn-xs delete'><i class='fa fa-trash-o'></i> 删除 </a>"
                        break;
                    case "2":
                        taskstatus = "<a class='btn btn-info btn-xs'>启动中</a>";
                        operation ="<a class='btn btn-warning btn-xs stop'><i class='fa fa-stop'></i> 停止 </a><a class='btn btn-info btn-xs change'><i class='fa fa-search'></i> 修改 </a><a class='btn btn-danger btn-xs delete'><i class='fa fa-trash-o'></i> 删除 </a>"
                        break;
                }
                switch (subdir){
                    case "1":
                        subdir = "<a class='btn btn-primary btn-xs'>采集</a>";
                        break;
                    case "0":
                        subdir = "<a class='btn btn-warning btn-xs'>不采集</a>";
                        break;
                }
                str +="<tr><td data-id='"+id+"' title='"+taskname+"' class='overhide'>"+taskname+"</td><td title='"+filepath+"' class='overhide'>"+filepath+"</td><td>"+str_doctype+"</td><td>"+subdir+"</td><td>"+taskstatus+"</td><td>"+operation+"</td></tr>"
            }
            $("#LocalFileTbody").html(str);
            var $datatable = $('#datatable-checkbox');
            $datatable.dataTable({
                'order': [[ 1, 'asc' ]],
                'columnDefs': [
                    { orderable: false, targets: [0] }
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
        error:function (data) {
            console.log(data);
        }
    });
}
//启动本地文件采集任务
var $body = $("body");
$body.on("click",".run",function () {
    var id = $(this).parent().parent("tr").children("td").eq(0).data("id");
    $.ajax({
        cache: true,
        type: "post",
        url: "http://"+localhost+"/localFile/start",
        data:{id:id,p:1},
        async: false,
        success: function (data) {
            $.confirm({
                confirmButtonClass: 'btn btn-info',
                cancelButtonClass: 'btn-danger',
                confirmButton:'确认',
                cancelButton:'取消',
                animation: 'zoom',
                closeAnimation: 'rotateXR',
                title: '启动成功！',
                content: '此任务启动成功（此确认框会在3秒后消失）',
                autoClose: '确认|3000',
                buttons: {
                    确认: function () {
                        location.reload();
                    },
                }
            });

        },
        error:function (data) {
            alert("后台错误"+data)
        }
    });

});
//删除本地文件采集任务
$body.on("click",".delete",function () {
    var id = $(this).parent().parent("tr").children("td").eq(0).data("id");
    var $tr = $(this).parent().parent("tr");
    $.confirm({
        confirmButtonClass: 'btn btn-info',
        cancelButtonClass: 'btn-danger',
        confirmButton: '确认',
        cancelButton: '取消',
        animation: 'zoom',
        closeAnimation: 'rotateXR',
        title: '删除？',
        content: '确认是否删除此条数据（此确认框会在8秒后消失）',
        autoClose: '否|8000',
        buttons: {
            deleteUser: {
                text: '是',
                action: function () {
                    $.ajax({
                        cache: true,
                        type: "post",
                        url: "http://"+localhost+"/localFile/rm",
                        data:{id:id},
                        async: false,
                        success: function (data) {
                            $.confirm({
                                confirmButtonClass: 'btn btn-info',
                                cancelButtonClass: 'btn-danger',
                                confirmButton:'确认',
                                cancelButton:'取消',
                                animation: 'zoom',
                                closeAnimation: 'rotateXR',
                                title: '删除成功！',
                                content: '此任务删除成功（此确认框会在3秒后消失）',
                                autoClose: '确认|3000',
                                buttons: {
                                    确认: function () {
                                        $("#datatable-checkbox").DataTable().row($tr).remove().draw(false);
                                    },
                                }
                            });

                        },
                        error:function (data) {
                            alert("后台报错"+data)
                        }
                    });
                }
            },
            否: function () {

            },
        }
    });
});
//停止本地文件采集任务
$body.on("click",".stop",function () {
    var id = $(this).parent().parent("tr").children("td").eq(0).data("id");
    var $tr = $(this).parent().parent("tr");
    $.ajax({
        cache: true,
        type: "post",
        url: "http://"+localhost+"/localFile/stop",
        data:{id:id},
        async: false,
        success: function (data) {
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
                        //$("#datatable-checkbox").DataTable().row($tr).remove().draw(false);
                        location.reload();
                    },
                }
            });

        },
        error:function (data) {
            alert("后台报错"+data)
        }
    });

});
//点击修改弹出模态框2,查看具体信息
var id;
$body.on("click",".change",function () {
    $("#myModal2").modal("show");
     id = $(this).parent().parent("tr").children("td").eq(0).data("id");
    var $tr = $(this).parent().parent("tr");
    var taskname = $tr.children("td").eq(0).text();
    var filepath = $tr.children("td").eq(1).text();
    $("input[name='taskname2']").val(taskname);
    $("#message2").text(filepath);
  /*  var subdir = $tr.children("td").eq(3).text();
    switch (subdir){
        case "采集":
            $("input[name='subdir2']").prop("checked",true);
            break;
        case "不采集":
            $("input[name='subdir2']").prop("checked",false);
            break;
    }*/

});
//修改本地文件采集任务
$("#MySQL-form2").validate({
        submitHandler: function() {
            var taskname = $("input[name='taskname2']").val();
            var subdir;
            if($("input[name='subdir2']").is(":checked")===true){
                subdir=1;
            }
            else{
                subdir=0;
            }
            var filepath = $("#message2").text();
            var nativexml=0;
            var arr=[];
            $("#myModal2").find("input[name='doctype']:checked").each(function () {
                arr.push($(this).val());
            });
            var doctype = arr.join(",");
            var json;
            if($("input[name='parseparam2']").is(":checked")===true){
                json ={
                    id:id,
                    taskname:taskname,
                    subdir:subdir,
                    parseparam:1,
                    filepath:filepath,
                    nativexml:nativexml,
                    doctype:doctype
                }
            }
            else{
                json = {
                    id:id,
                    taskname:taskname,
                    subdir:subdir,
                    filepath:filepath,
                    nativexml:nativexml,
                    doctype:doctype
                }
            }
            console.log('参数')
            console.log(json)
            $.ajax({
                cache: true,
                type: "post",
                url: "http://"+localhost+"/localFile/editDo",
                data:json,
                async: false,
                success: function (data) {
                    $.confirm({
                        confirmButtonClass: 'btn btn-info',
                        cancelButtonClass: 'btn-danger',
                        confirmButton:'确认',
                        cancelButton:'取消',
                        animation: 'zoom',
                        closeAnimation: 'rotateXR',
                        title: '修改成功！',
                        content: '此文件修改成功（此确认框会在3秒后消失）',
                        autoClose: '确认|3000',
                        buttons: {
                            确认: function () {
                                $("#myModal").modal("hide");
                                location.reload();
                            },
                        }
                    });

                },

                error:function (data) {
                    console.log(data)
                }
            });
        }
    });
//根目录路径
function getbasefiles() {
    $.ajax({
        cache: true,
        type: "get",
        url: "http://"+localhost+"/file/root",
        async: false,
        success: function (data) {
            //导航链接部分
            var arr = (data.substring(1,data.length-1)).split(",");
            console.log(arr)
            $("#show_path").html("<li><a href='javascript:void(0)' data-filepath='\\' class='tr_folder'><i class='fa fa-home' style='margin-right: 2px;'></i>Home</a></li>")
            //table部分
            $("#files").dataTable().fnDestroy();
            var string = "";
            if(arr.length===1&&arr[0]==="\"/\""){
                string +="<tr class='tr tr_folder' data-filepath='/'><td class='radio_'><input type='radio' name='path'  class='checkboxes' data-filepath='/'></td><td class='radio__'><i class='fa fa-folder'></i></td><td><a href='javascript:void(0)'>/</a></td></tr>";
            }
            else{
                for(var key in arr){
                    string +="<tr class='tr tr_folder' data-filepath='"+arr[key].substring(1,arr[key].length-2)+"'><td class='radio_'><input type='radio' name='path'  class='checkboxes' data-filepath='"+arr[key].substring(1,arr[key].length-2)+"'></td><td class='radio__'><i class='fa fa-folder'></i></td><td><a href='javascript:void(0)'>"+arr[key].substring(1,arr[key].length-2)+"</a></td></tr>";
                }
            }

            $("#files_tbody").html(string);
            $("#files").dataTable({
                'order': [[ 1, 'asc' ]],
                'columnDefs': [
                    { orderable: false, targets: [0] }
                ],
                "aoColumnDefs": [
                    {"orderable": false, "aTargets": [0,1]}// 制定列不参与排序
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
        error:function () {
            alert("系统错误")
        }
    })
}
//路径方法(windows系统下)
function getfiles(filePath) {
    $.ajax({
        cache: true,
        type: "post",
        url: "http://"+localhost+"/file/view",
        data:{filePath:filePath},
        async: false,
        success: function (data2) {
            //导航链接部分
            var data = JSON.parse(data2);
             console.log(data);
                var pathArr = filePath.split("\\");

                var str = "<li><a href='javascript:void(0)' data-filepath='\\' class='tr_folder'><i class='fa fa-home' style='margin-right: 2px;'></i>Home</a></li>";
                for(var i=0;i<pathArr.length;i++){
                    if(i!==pathArr.length-1){
                        var newArray = pathArr.slice(0,i+1);
                        var newPath = newArray.join("\\");
                        str +="<li><a href='javascript:void(0)' class='tr_folder' data-filepath='"+newPath+"'>"+pathArr[i]+"</a></li>"
                    }
                    else if(i===pathArr.length-1){
                        str +="<li class='active'>"+pathArr[i]+"</li>";
                    }
                }
                $("#show_path").html(str);

            //table部分
            $("#files").dataTable().fnDestroy();
            var string = "";
            var path = filePath.split("\\").slice(0,-1).join("\\");
           if(path===""){
                path = "\\"
            }
            string +="<tr class='tr tr_folder' data-filepath='"+path+"'><td class='radio_'><input type='radio' name='path' class='checkboxes' data-filepath='"+path+"'></td><td class='radio__'><i class='fa fa-folder'></i></td><td><a href='javascript:void(0)'><i class='fa fa-level-up'></i></a></td></tr>";
            string +="<tr class='tr tr_folder' data-filepath='"+filePath+"'><td class='radio_'><input type='radio' name='path'  class='checkboxes' data-filepath='"+filePath+"'></td><td class='radio__'><i class='fa fa-folder'></i></td><td><a href='javascript:void(0)' title='当前目录'>.</a></td></tr>";
            for(var key in data){
                if(data[key]==="1"){
                    var arr = key.split("\\");
                    var showpath = arr[arr.length-1];
                    string +="<tr class='tr tr_folder' data-filepath='"+key+"'><td class='radio_'><input type='radio' name='path'  class='checkboxes' data-filepath='"+key+"'></td><td class='radio__'><i class='fa fa-folder'></i></td><td><a href='javascript:void(0)'>"+showpath+"</a></td></tr>";
                }
                else if(data[key]==="0"){
                    var arr2 = key.split("\\");
                    var showpath2 = arr2[arr2.length-1];
                    string +="<tr class='tr tr_file' data-filepath='"+key+"'><td class='radio_'><input type='radio' name='path' class='checkboxes' data-filepath='"+key+"'></td><td class='radio__'><i class='fa fa-file-o'></i></td><td><a href='javascript:void(0)'>"+showpath2+"</a></td></tr>";
                }
            }
            $("#files_tbody").html(string);
            $("#files").dataTable({
                'order': [[ 1, 'asc' ]],
                'columnDefs': [
                    { orderable: false, targets: [0] }
                ],
                "aoColumnDefs": [
                    {"orderable": false, "aTargets": [0,1]}// 制定列不参与排序
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
        error:function () {
            alert("系统错误")
        }
    })
}
//路径方法(linux系统下)
function getfiles2(filePath) {
    $.ajax({
        cache: true,
        type: "post",
        url: "http://"+localhost+"/file/view",
        data:{filePath:filePath},
        async: false,
        success: function (data2) {
            //导航链接部分
            var data = JSON.parse(data2);
            if(filePath==="/"){
                $("#show_path").html("<li><a href='javascript:void(0)' data-filepath='/' class='tr_folder'><i class='fa fa-home' style='margin-right: 2px;'></i>Home</a></li>")
            }
            else{
                var pathArr = filePath.split("/");
                var str = "<li><a href='javascript:void(0)' data-filepath='/' class='tr_folder'><i class='fa fa-home' style='margin-right: 2px;'></i>Home</a></li>";
                for(var i=1;i<pathArr.length;i++){
                    if(i!==pathArr.length-1){
                        var newArray = pathArr.slice(0,i+1);
                        var newPath = newArray.join("/");
                        str +="<li><a href='javascript:void(0)' class='tr_folder' data-filepath='"+newPath+"'>"+pathArr[i]+"</a></li>"
                    }
                    else if(i===pathArr.length-1){
                        str +="<li class='active'>"+pathArr[i]+"</li>";
                    }
                }
                $("#show_path").html(str);
            }

            //table部分
            $("#files").dataTable().fnDestroy();
            var string = "";
            if(filePath!=="/"){
                var path = filePath.split("/").slice(0,-1).join("/");
                if(path===""){
                    path = "/"
                }
                string +="<tr class='tr tr_folder' data-filepath='"+path+"'><td class='radio_'><input type='radio' name='path' class='checkboxes' data-filepath='"+path+"'></td><td class='radio__'><i class='fa fa-folder'></i></td><td><a href='javascript:void(0)'><i class='fa fa-level-up'></i></a></td></tr>";
            }
            string +="<tr class='tr tr_folder' data-filepath='"+filePath+"'><td class='radio_'><input type='radio' name='path'  class='checkboxes' data-filepath='"+filePath+"'></td><td class='radio__'><i class='fa fa-folder'></i></td><td><a href='javascript:void(0)' title='当前目录'>.</a></td></tr>";
            for(var key in data){
                if(data[key]==="1"){
                    var arr = key.split("/");
                    var showpath = arr[arr.length-1];
                    string +="<tr class='tr tr_folder' data-filepath='"+key+"'><td class='radio_'><input type='radio' name='path'  class='checkboxes' data-filepath='"+key+"'></td><td class='radio__'><i class='fa fa-folder'></i></td><td><a href='javascript:void(0)'>"+showpath+"</a></td></tr>";
                }
                else if(data[key]==="0"){
                    var arr2 = key.split("/");
                    var showpath2 = arr2[arr2.length-1];
                    string +="<tr class='tr tr_file' data-filepath='"+key+"'><td class='radio_'><input type='radio' name='path' class='checkboxes' data-filepath='"+key+"'></td><td class='radio__'><i class='fa fa-file-o'></i></td><td><a href='javascript:void(0)'>"+showpath2+"</a></td></tr>";
                }
            }
            $("#files_tbody").html(string);
            //改变checkbox样式
            $("#files").dataTable({
                'order': [[ 1, 'asc' ]],
                'columnDefs': [
                    { orderable: false, targets: [0] }
                ],
                "aoColumnDefs": [
                    {"orderable": false, "aTargets": [0,1]}// 制定列不参与排序
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
        error:function () {
            alert("系统错误")
        }
    })
}
//点击选择路径出现模态框
$body.on("click",".ChoosePath",function () {
    $.ajax({
        cache: true,
        type: "get",
        url: "http://"+localhost+"/file/root",
        async: false,
        success: function (data) {
            //导航链接部分
            var arr = (data.substring(1,data.length-1)).split(",");
            if(arr.length===1&&arr[0]==="\"/\""){
                getfiles2("/")
            }
            else{
                getbasefiles()
            }

        },
        error:function () {
            alert("系统错误")
        }
    })

});
//点击进入文件夹
$body.on("click",".tr_folder",function () {
    var filePath = $(this).data("filepath");
    if(filePath==="\\"){
        getbasefiles();
    }
    else{
        if(filePath.substring(0,1)==="/"){
            getfiles2(filePath);
        }
        else{
            if(filePath.indexOf("\\")===-1){
                getfiles(filePath+"\\");
            }
            else{
                getfiles(filePath);
            }
        }
    }


});
//阻止radio的冒泡事件
$body.on("click","input[type='radio']",function (e) {
    e.stopPropagation();
});
//点击确定将路径赋值
$body.on("click","#choose_path",function () {
    var path = $("#files_tbody").find("input[type='radio']:checked").data("filepath");
    if(path.substring(0,1)==="/"){
      path = path ;
    }
    else{
        path.indexOf("\\")===-1?path=path+"\\":path=path;
    }
    $("#message").text(path);
    $("#message2").text(path);
    $("#myModal3").modal("hide");
});