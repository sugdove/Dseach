/**
 * Created by suge on 2018/3/19
 */
//获取当前系统时间
setInterval(function () {
    var date = new Date().getDay();
    switch (date){
        case 0:
            date = "星期日";
            break;
        case 1:
            date = "星期一";
            break;
        case 2:
            date = "星期二";
            break;
        case 3:
            date = "星期三";
            break;
        case 4:
            date = "星期四";
            break;
        case 5:
            date = "星期五";
            break;
        case 6:
            date = "星期六";
            break;
    }
    var showdate = new Date().toLocaleString() + " "+date;
    $("#showdate").html(showdate)
    }
    ,1000);
//获取系统详细信息
var freeMemory;
var costMemory;
var freeDisk;
var costDisk;

$.ajax({
    cache: true,
    type: "get",
    url: "http://"+localhost+"/home/view",
    dataType:"text",
    async: false,
    success: function (data2) {
        var data = JSON.parse(data2)['body'];
        freeMemory = parseInt(data['空闲内存'].substring(0,data['空闲内存'].length-1));
        costMemory = parseInt(data['已使用内存'].substring(0,data['已使用内存'].length-1));
        freeDisk = parseInt(data['磁盘空间/剩余空间'].split("/")[1]);
        costDisk = parseInt(data['磁盘空间/剩余空间'].split("/")[0]) - parseInt(data['磁盘空间/剩余空间'].split("/")[1]);
        var $index_message =  $(".index_message");
        //系统信息赋值
        $("#systemStartTime").text(data['系统启动时间']);
        $("#searchTimes").text(data['检索请求次数']);
        $("#averageRespondTimes").text(data['平均检索响应时间']);
        $("#totalMessage").text(data['索引信息总量'].split(" ")[0]);
        $("#memoryMessage").text(data['分配内存'].substring(0,data['分配内存'].length-1)+"/"+data['空闲内存']);
        //表格内赋值
        $index_message.eq(0).text(data['分配内存']);
        $index_message.eq(1).text(data['当前用户']);
        $index_message.eq(2).text(data['索引信息总量'].split(" ")[0]+" ");
        $("#docsMessage").text(data['索引信息总量'].split(" ")[1]);
        $index_message.eq(3).text(data['空闲内存'].substring(0,data['空闲内存'].length-1));
        $index_message.eq(4).text(data['JAVA虚拟机']);
        $index_message.eq(5).text(data['检索请求次数']);
        $index_message.eq(6).text(data['已使用内存']);
        $index_message.eq(7).text(data['虚拟机版本']);
        $index_message.eq(8).text(data['平均检索响应时间']);
        $index_message.eq(9).text(data['操作系统']);
        $index_message.eq(10).text(data['服务器端口号']);
        $index_message.eq(11).text(data['系统启动时间']);
        $index_message.eq(12).text(data['虚拟机路径']);
        $index_message.eq(13).text(data['用户默认路径']);
        $index_message.eq(14).text(data['磁盘空间/剩余空间'].split("/")[0]+"/");
        $("#zzz").text(data['磁盘空间/剩余空间'].split("/")[1]);
        data['授权产品/用户'].split("/")[1]=="开源用户"?$index_message.eq(15).text(data['授权产品/用户'].replace("开源用户","DSG")):$index_message.eq(15).text(data['授权产品/用户']);
        $index_message.eq(16).text(data['数据量/节点数量']);
        $index_message.eq(17).text(data['R3使用的存储空间']);
        $index_message.eq(18).text(data['授权版本/类型/服务']);
        $index_message.eq(19).text(data['授权日期']);



    },
    error:function (data) {
        alert("后台出错"+data);
    }
});
//chartJs初始化界面
function ChartJs(freeMemory,costMemory,freeDisk,costDisk){
    var ctx = document.getElementById("Chart1").getContext('2d');
    var ctx2 = document.getElementById("Chart2").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [costMemory, freeMemory],
                backgroundColor:["#ff6384","#36a2eb"],
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                '已使用内存(MB)',
                '空闲内存(MB)'
            ]
        },
        options: {
        /*    title:{
                display:"true",
                text:"内存使用情况"
            },*/
            tooltip:{
            }
        }
    });
    var myChart2 = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [costDisk, freeDisk],
                backgroundColor:["#ff6384","#36a2eb"]
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                '已使用磁盘(GB)',
                '空闲磁盘(GB)'
            ]
        },
        options: {
        }

    });
}
ChartJs(freeMemory,costMemory,freeDisk,costDisk);