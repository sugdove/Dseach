/*
* 索引数据查看
*/

var elemBox= $('#datatable-checkbox > tbody');//表格内容框
var currPage=1;
var pageClickNum=0;//判断页码是否被点击
$(function($) {
    //初始化数据
     getIndexData(1);
    //删除
    $('#datatable-checkbox').on('click','.delete-btn',function () {
        var currId=$(this).parents('tr').attr('data-id');//删除行id
        deleteData(currId)
    });
    //查看详情
    $('#datatable-checkbox').on('click','.index-data-detail',function () {
       var currId=$(this).parents('tr').attr('data-id');//查看行id
       getDetailData(currId);
    })
    //搜索
    $("#index-data-search").keyup(function() {
     var value=$(this).val();
     indexDataSearch(value);
    })
    //删除所有数据
    $("#deleteAllData").click(function() {
        $.confirm({
            confirmButtonClass: 'btn btn-info',
            cancelButtonClass: 'btn-danger',
            confirmButton: '确认',
            cancelButton: '取消',
            animation: 'zoom',
            closeAnimation: 'rotateXR',
            title: '删除？',
            content: '是否删除所有数据（此确认框会在8秒后消失）',
            autoClose: '否|8000',
            buttons: {
                deleteUser: {
                    text: '是',
                    action: function () {
                        $(".spinner").show();
                        $(".black_overlay").show();
                        deleteAllData();
                    }
                },
                否: function () {

                },
            }
        });

    })
});
/*
* 获取初始化数据
* page当前页码
* */
function getIndexData(page) {
    var totalData,tableData;
    $.ajax({
        cache: true,
        type: "post",
        url: `http://${localhost}/solr/list`,
        async: false,
        data:{p:page},
        success: function (response) {
            totalData = JSON.parse(response)['body'];
            tableData=totalData[1];
            handlePageData(tableData);
            if(pageClickNum==0){
                var  pageInfo=totalData[0];
                handlePagination(pageInfo);
            }

        },
        error:function (data) {
            alert("后台报错"+data)
        }
    })
}

/*
*获取详情数据
* id  数据项id
* */
function getDetailData(id) {
    $.ajax({
        cache: true,
        type: "get",
        url: 'http://'+localhost+'/solr/view?id='+id,
        async: false,
        success: function (response) {
            var data=JSON.parse(response)['body'];
            handleModal(data)
        },
        error:function (data) {
            alert("后台报错"+data)
        }
    })
}

/*
*删除数据
* id  数据项id
*elem 数据项所在的行
* */
function deleteData(id) {
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
                        url: `http://${localhost}/solr/rm?id=${id}&p=${currPage}`,
                        async: false,
                        success: function (response) {
                            if(JSON.parse(response)['head']['status']==="1"){
                                $.confirm({
                                    confirmButtonClass: 'btn btn-info',
                                    cancelButtonClass: 'btn-danger',
                                    confirmButton:'确认',
                                    cancelButton:'取消',
                                    animation: 'zoom',
                                    closeAnimation: 'rotateXR',
                                    title: '删除失败！',
                                    content: '未知原因删除失败（此确认框会在8秒后消失）',
                                    autoClose: '确认|8000',
                                    buttons: {
                                        确认: function () {

                                        },
                                    }
                                });
                            }
                            else{
                                $.confirm({
                                    confirmButtonClass: 'btn btn-info',
                                    cancelButtonClass: 'btn-danger',
                                    confirmButton:'确认',
                                    cancelButton:'取消',
                                    animation: 'zoom',
                                    closeAnimation: 'rotateXR',
                                    title: '删除成功！',
                                    content: '已删除此条数据（此确认框会在8秒后消失）',
                                    autoClose: '确认|3000',
                                    buttons: {
                                        确认: function () {
                                            var data=JSON.parse(response)['body'];
                                            pageClickNum=0;
                                            handlePagination(data[0]);
                                            handlePageData(data[1]);
                                        },
                                    }
                                });

                            }

                        },
                        error:function (data) {
                            alert("后台报错"+data)
                        }
                    })
                }
            },
            否: function () {

            },
        }
    });


}

/*
* 弹出框数据
*data 数据项
* */
function handleModal(data) {
    var modalBox=$('#myModal').find('.modal-body');
    var cont='';
    var content=''
    for(var key in data){
        if(key.indexOf('内容')==-1){
            if(key.indexOf('id')==-1){
                cont+=`<div class="row form-group">
               <label class="col-sm-2 control-label">${key}</label>
               <div class="col-sm-10">
                 <input class="form-control" value="${data[key]}" readonly>
               </div>
            </div>`;
            }else {
                cont+=`<div class="row form-group">
               <label class="col-sm-2 control-label">${key}&nbsp;： </label>
               <div class="col-sm-10">
                 <input class="form-control" value="${data[key]}" readonly>
               </div>
            </div>`;
            }
        }else {
            content=`<div class="row form-group">
               <label class="col-sm-2 control-label">${key}</label>
               <div class="col-sm-10">
                 <textarea class="form-control"  rows="5"  readonly>${data[key]}</textarea>
               </div>
        </div>`;
        }
    }

    modalBox.empty();
    modalBox.append(cont,content);
}

/*
* 表格数据
* */
function handlePageData(data) {
    if(data.length>0){
        let len;
        var cont='';
        for(let i=0;i<data.length;i++){
            len=data[i].length-1;
            cont+=`<tr data-id="${data[i][len]}">
            <td>${data[i][1]}</td>
            <td>${data[i][2]}</td>
            <td>${data[i][3]}</td>
            <td>${data[i][4]}</td>
            <td>${data[i][5]}</td>
            <td>
                <span class="btn btn-primary btn-xs index-data-detail" data-toggle="modal" data-target="#myModal">
                <i class="fa fa-search"></i>查看</span>
                <span class="btn btn-danger btn-xs delete-btn"> <i class="fa fa-trash-o"></i> 删除</span>
            </td>
           </tr>`;
        }
    }else {
        cont='<tr class="odd"><td valign="top" colspan="12" class="dataTables_empty">表中数据为空</td></tr>'
    }
   elemBox.empty();
   elemBox.append(cont);
}

/*
* 页码数据
* */
function handlePagination(data) {
    $('#page_box').paging({
        initPageNo: data.curpage, // 初始页码
        totalPages: data.pagesum, //总页数
        totalCount: '合计' + data.tatol + '条数据', // 条目总数
        slideSpeed: 600, // 缓动速度。单位毫秒
        jump: true, //是否支持跳转
        callback: function(page) { // 回调函数
            currPage=page;
            pageClickNum++;
         if(pageClickNum<2){
             return false;
         }else {
             getIndexData(page);
         }

        }
    })
}
/*
* 搜索
* */
function indexDataSearch(query) {
    $.ajax({
        cache: true,
        type: "post",
        url: `http://${localhost}/solr/list/query`,
        async: false,
        data: {q: query},
        success: function (response) {
            var data = JSON.parse(response)['body'];
            // if(data[1].length>0){
                pageClickNum=0;
                handlePageData(data[1]);
                handlePagination(data[0]);
            // }

        },
        error: function (data) {
            alert("后台报错" + data)
        }
    })
}
/*
* 删除所有数据
* */
function deleteAllData(){
    $.ajax({
        cache: true,
        type: "get",
        url: `http://${localhost}/solr/rmAll`,
        async: true,
        success: function (response) {
            var data = JSON.parse(response);

            if(data['head']['status']==="1"){
                $.confirm({
                    confirmButtonClass: 'btn btn-info',
                    cancelButtonClass: 'btn-danger',
                    confirmButton:'确认',
                    cancelButton:'取消',
                    animation: 'zoom',
                    closeAnimation: 'rotateXR',
                    title: '删除失败！',
                    content: '删除操作失败请检查后台（此确认框会在8秒后消失）',
                    autoClose: '确认|3000',
                    buttons: {
                        确认: function () {
                            $(".spinner").hide();
                            $(".black_overlay").hide();
                        },
                    }
                });
            }
            else if(data['head']['status']==="0"){
                $.confirm({
                    confirmButtonClass: 'btn btn-info',
                    cancelButtonClass: 'btn-danger',
                    confirmButton:'确认',
                    cancelButton:'取消',
                    animation: 'zoom',
                    closeAnimation: 'rotateXR',
                    title: '删除成功！',
                    content: '已清空所有数据('+data['body']['rmcount']+'条)（此确认框会在8秒后消失）',
                    autoClose: '确认|3000',
                    buttons: {
                        确认: function () {
                            $(".spinner").hide();
                            $(".black_overlay").hide();
                         location.reload();
                        },
                    }
                });

            }
        },
        error: function (data) {
            $(".spinner").hide();
            $(".black_overlay").hide();
            alert("后台报错" + data)
        }
    })
}


