/**
 * Created by suge on 2018/3/22
 */

/**
 * ajax状态参数处理
 */
function StatusHandle(data){
    if(data['head']['status']==="0"){
        $.confirm({
            confirmButtonClass: 'btn btn-info',
            cancelButtonClass: 'btn-danger',
            confirmButton:'确认',
            cancelButton:'取消',
            animation: 'zoom',
            closeAnimation: 'rotateXR',
            title: '操作成功！',
            content: data['head']['headmsg']+"（此确认框会在3秒后消失）",
            autoClose: '确认|3000',
            buttons: {
                确认: function () {

                },
            }
        });
    }
    else if(data['head']['status']==="1"){
        $.confirm({
            confirmButtonClass: 'btn btn-info',
            cancelButtonClass: 'btn-danger',
            confirmButton:'确认',
            cancelButton:'取消',
            animation: 'zoom',
            closeAnimation: 'rotateXR',
            title: '操作失败！',
            content: data['head']['headmsg']+"（此确认框会在5秒后消失）",
            autoClose: '确认|5000',
            buttons: {
                确认: function () {

                },
            }
        });
    }
}

/**
 * 初始化datatable
 */

function dataDatable($table){
    $table.dataTable({
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
}

/**
 * 点击数据库下类型以传入参数并跳转
 */

function clickToJumpDatabase(){
    $('.dataBaseJump').click(function () {
        let dataBaseType = $(this).text();
        window.location.href = encodeURI("dataBase.html?Type="+dataBaseType);
    })
}
clickToJumpDatabase();

var ip = "192.168.2.78";
var port = "9001";//新项目
var port2 = "9977";//老前端
var localhost = ip+":"+port;//新项目需要用到的localhost
var localhost2 = ip+":"+port2;//老项目需要用到的localhost
