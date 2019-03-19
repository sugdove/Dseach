/**
 * Created by suge on 2018/4/2
 */

(function () {
    let dtype = getType();
    afterGetType(dtype);
    let $body = $("body");
    let driverClazz = getDriverClazz(dtype);
    let id;
    showAddDatabase(dtype);
    goDetailMeassage(dtype);
    getDatabaseList(dtype, "other", driverClazz);
    validate("0", driverClazz);
    clickToTestAddDatabase(driverClazz);
    $body.on("click", ".showChangeModel", function () {
        id = $(this).parent().parent("tr").data("id");
        getDetailsData(id, dtype);
        $("#myModal2").modal('show');
        validate2(id, "0", driverClazz);
    });
    $('#test2').click(function () {
        changeDatabase(id,"1", driverClazz, getModeldata2()[0], getModeldata2()[1], getModeldata2()[2], getModeldata2()[3], getModeldata2()[4], getModeldata2()[5]);
    });
    clickToDeleteTask(driverClazz)
}());

/**
 * 获取数据库类型传参
 */

function getType(){
    let Type;//用户选择的类型
    let URL = decodeURI(document.URL);
    //判断是否有?字符串
    if(URL.indexOf("?")===-1){
     Type = "Oracle"
    }
    else{
        Type =(URL.split("?")[1]).split('=')[1];
    }
    return Type;
}

/**
 * 获取到了数据库类型后的相关界面显示操作
 */

function afterGetType(dtype){
   //给左边相对应导航项目高亮
    $('.dataBaseJump').each(function () {
        if($(this).text()===dtype){
            $(this).parent('li').addClass('current-page');
            return false;
        }
    });
    //添加或者修改的数据类型select框改变
    $('.selectType').html("<option value='"+dtype+"' selected>"+dtype+"</option>");
   //title改变
    $('title').text(dtype+"数据库采集")
    //其他三处文本改变
    $('.dataBaseTypeText').text(dtype);
}

/**
 * 获取driverclazz参数
 */
function getDriverClazz(dtype) {
    let driverClazz;
    $.ajax({
        cache: true,
        async: false,
        url: "http://" + localhost + "/extension/getDatabaseDriver",
        type: "post",
        success: function (data2) {
            let data = JSON.parse(data2);
            driverClazz = data['body'][dtype];
        },
        error: function (data) {
            alert("系统错误" + data);
        }
    });
    return driverClazz;
}

/**
 * 获取数据库采集任务列表
 */
function getDatabaseList(dtype, databaseType, driverClazz) {
    $.ajax({
        async: false,
        cache: true,
        url: "http://" + localhost + "/database/list",
        type: "post",
        data: {dtype: dtype, databaseType: databaseType, driverClazz: driverClazz},
        success: function (data2) {
            $("#datatable-checkbox").dataTable().fnDestroy();
            let data = JSON.parse(data2);
            let pageContent = data['body']['pageContent'];
            let str = "";
            for (let key in pageContent) {
                let taskname = pageContent[key]['taskName'];   //任务名
                let id = pageContent[key]['id'];   //id
                let account = pageContent[key]['account'];  //用户名
                let connectparam = pageContent[key]['connectparam'];  //连接参数
                let databaseurl = pageContent[key]['databaseurl'];  //数据库链接URL
                let driverclazz = pageContent[key]['driverclazz'];  //数据库驱动
                let password = pageContent[key]['password'];   //密码
                str += "<tr data-id='" + id + "'><td class='overhide' title='"+taskname+"'>" + taskname + "</td><td>" + account + "</td><td>"+dtype+"</td><td>" + databaseurl + "</td><td><a href='javascript:void(0)' class='btn btn-primary btn-xs showChangeModel'><i class='fa fa-wrench'></i> 修改 </a><a href='javascript:void(0)' class='btn btn-info btn-xs detailMessage'><i class='fa fa-search'></i> 详情 </a><a href='javascript:void(0)' class='btn btn-danger btn-xs deleteTask'><i class='fa fa-remove'></i> 删除 </a></td></tr>"
            }
            $("#datatable-checkbox-tbody").html(str);
            dataDatable($("#datatable-checkbox"));
        },
        error: function (data) {
            alert("系统错误" + data);
        }
    });
}

/**
 * 添加数据库采集任务
 */

function addDatabase(test, driverClazz, dtype, taskName, databaseUrl, account, password, connectParam) {
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost + "/database/add",
        data: {
            dtype: dtype,
            test: test,
            taskName: taskName,
            driverClazz: driverClazz,
            databaseUrl: databaseUrl,
            account: account,
            password: password,
            connectParam: connectParam,
        },
        async: false,
        success: function (data2) {
            let data = JSON.parse(data2);
            if(test==="0"){
                $("#datatable-checkbox").dataTable().fnDestroy();
                StatusHandle(data);
                getDatabaseList(dtype, "other", driverClazz);
                $("#myModal").modal('hide');
            }
            else if(test==="1"){
                $.confirm({
                    confirmButtonClass: 'btn btn-info',
                    cancelButtonClass: 'btn-danger',
                    confirmButton:'确认',
                    cancelButton:'取消',
                    animation: 'zoom',
                    closeAnimation: 'rotateXR',
                    title: '测试结果！',
                    content: data['body']['msg']+'（此确认框会在5秒后消失）',
                    autoClose: '确认|5000',
                    buttons: {
                        确认: function () {

                        },
                    }
                });
            }

        },
        error: function (data) {
            alert("系统错误" + data);
        }
    })
}

/**
 * 点击测试添加数据库采集任务
 */

function clickToTestAddDatabase(driverClazz){
    $('#test').click(function () {
        addDatabase("1", driverClazz, getModeldata()[0], getModeldata()[1], getModeldata()[2], getModeldata()[3], getModeldata()[4], getModeldata()[5]);
    })
}

/**
 * 修改数据库采集任务
 */

function changeDatabase(id, test, driverClazz, dtype, taskName, databaseUrl, account, password, connectParam) {
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost + "/database/editDo",
        data: {
            id: id,
            dtype: dtype,
            test: test,
            taskName: taskName,
            driverClazz: driverClazz,
            databaseUrl: databaseUrl,
            account: account,
            password: password,
            connectParam: connectParam,
        },
        async: false,
        success: function (data2) {
            let data = JSON.parse(data2);
            if(test==="0"){
                $("#datatable-checkbox").dataTable().fnDestroy();
                StatusHandle(data);
                getDatabaseList(dtype, "other", driverClazz);
                $("#myModal2").modal('hide');
            }
            else if(test==="1"){
                $.confirm({
                    confirmButtonClass: 'btn btn-info',
                    cancelButtonClass: 'btn-danger',
                    confirmButton:'确认',
                    cancelButton:'取消',
                    animation: 'zoom',
                    closeAnimation: 'rotateXR',
                    title: '测试结果！',
                    content: data['body']['msg']+'（此确认框会在5秒后消失）',
                    autoClose: '确认|5000',
                    buttons: {
                        确认: function () {

                        },
                    }
                });
            }

        },
        error: function (data) {
            alert("系统错误" + data);
        }
    })
}

/**
 * 点击测试添加数据库采集任务
 */

function clickToTestChangeDatabase(id,driverClazz){
    $('#test2').click(function () {
        changeDatabase(id,"1", driverClazz, getModeldata2()[0], getModeldata2()[1], getModeldata2()[2], getModeldata2()[3], getModeldata2()[4], getModeldata2()[5]);
    })
}

/**
 *获取模态框1数据
 */

function getModeldata() {
    $param = $(".param");
    let dtype = $param.eq(0).val();
    let taskName = $param.eq(1).val();
    let databaseUrl = $param.eq(2).val();
    let account = $param.eq(3).val();
    let password = $param.eq(4).val();
    let connectParam = $param.eq(5).val();
    return [dtype, taskName, databaseUrl, account, password, connectParam];

}

/**
 *获取模态框2数据
 */

function getModeldata2() {
    $param = $(".param2");
    let dtype = $param.eq(0).val();
    let taskName = $param.eq(1).val();
    let databaseUrl = $param.eq(2).val();
    let account = $param.eq(3).val();
    let password = $param.eq(4).val();
    let connectParam = $param.eq(5).val();
    return [dtype, taskName, databaseUrl, account, password, connectParam];

}

/**
 * validate表单拦截(添加)
 */
function validate(test, driverClazz) {
    $("#database-form").validate({
        submitHandler: function () {
            console.log($(this).attr("id"));
            addDatabase(test, driverClazz, getModeldata()[0], getModeldata()[1], getModeldata()[2], getModeldata()[3], getModeldata()[4], getModeldata()[5]);
        }
    });
}

/**
 * validate表单拦截(修改)
 */
function validate2(id, test, driverClazz) {
    $("#database-form2").validate({
        submitHandler: function () {
            changeDatabase(id, test, driverClazz, getModeldata2()[0], getModeldata2()[1], getModeldata2()[2], getModeldata2()[3], getModeldata2()[4], getModeldata2()[5]);
        }
    });
}

/**
 * 获取某一个任务的详情
 */

function getDetailsData(id, dtype) {
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost + "/database/edit",
        data: {
            id: id,
            dtype: dtype,
        },
        async: false,
        success: function (data2) {
            let data = JSON.parse(data2)['body'];
            let taskname = data['taskname'];
            let driverclazz = data['driverclazz'];
            let databaseurl = data['databaseurl'];
            let account = data['account'];
            let password = data['password'];
            let connectparam = data['connectparam'];
            let $param = $(".param2");
            $param.eq(0).val(dtype);
            $param.eq(1).val(taskname);
            $param.eq(2).val(databaseurl);
            $param.eq(3).val(account);
            $param.eq(4).val(password);
            $param.eq(5).val(connectparam);
        }
    })
}

/**
 * 点击创建任务清空taskname值
 */

function showAddDatabase(dtype) {
    $("#showAddDatabase").click(function () {
        let $param = $(".param");
        $param.val("");
        $param.eq(0).val(dtype);
        switch(dtype){
            case "MySQL":
                $param.eq(2).val("jdbc:mysql://[ip]:[port]/[database]");
                break;
            case "Oracle":
                $param.eq(2).val("jdbc:oracle:thin:@[ip]:[port]:[database]");
                break;
        }
    })
}

/**
 * 点击详情跳转到数据表详情页面
 */

function goDetailMeassage(dtype) {
    $("#datatable-checkbox-tbody").on('click', '.detailMessage', function () {
        let id = $(this).parent().parent('tr').data('id');
        let taskname = $(this).parent().parent('tr').children('td').eq(0).text();
        window.location.href = encodeURI("dataBase_details.html?id=" + id + "&taskname=" + taskname+"&Type="+dtype)
    })
}

/**
 * 删除某一任务方法
 */

function deleteTask(id, driverClazz) {
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost + "/database/rm",
        data: {
            id: id,
            driverClazz: driverClazz,
        },
        async: false,
        success: function (data2) {
            let data = JSON.parse(data2);
            StatusHandle(data);
            getDatabaseList('oracle', 'other', driverClazz)
        }
    })
}

/**
 * 点击删除某一任务方法
 */

function clickToDeleteTask(driverClazz) {
    $('body').on('click', '.deleteTask', function () {
        let id = $(this).parent().parent('tr').data('id');
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
                        deleteTask(id, driverClazz)
                    }
                },
                否: function () {

                },
            }
        });
    })
}

/**
 * 测试
 */