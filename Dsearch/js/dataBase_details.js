/**
 * Created by suge on 2018/4/2
 */

(function () {
    let paramId;//此id为通过点击taskname名传递
    let databaseID = decodeURI(((document.URL.split("?")[1]).split("&")[0]).split("=")[1]);
    let taskName = decodeURI(((document.URL.split("?")[1]).split("&")[1]).split("=")[1]);
    let dtype;
    try{
        dtype = decodeURI(((document.URL.split("?")[1]).split("&")[2]).split("=")[1]);
    }
    catch(error){
        dtype = 'Oracle';
    }
    afterGetDtype(dtype);
    getTaskNameTitle(taskName);
    getAllTables(databaseID);
    getTableTypes(databaseID);
    toggleTableSQL();
    addFromSubmit(databaseID);
    cleanParam();
    clickDeleteTable(databaseID);
    clickStartTable(databaseID);
    getdetailMessage(databaseID);
    showProperties();
    changeFromSubmit(databaseID);
    clickToDeleteTabProper();
    clickResetTable(databaseID);
    clickToUpdateIndexField();
    clickToBooleanKeyWords();
    toggleCheckbox();
    clickStopTable(databaseID);
    clickToBooleanTimestamp();
    clickToChangeplugins();
    clickToGetPluginParam();
    clickToUpdatePluginParam();
}());

/**
 * 获取库下所有表
 */

function getAllTables(databaseID) {
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost + "/database/dataTableList",
        data: {
            databaseID: databaseID,
        },
        async: false,
        success: function (data2) {
            let data = JSON.parse(data2)['body'];
            let dataTableList = data['dataTableList'];
            //当有数据时的操作
            if(dataTableList.length!==0){
                let str = "";
                let firstTableName;
                if(dataTableList[0]['tablename']==='sql'){
                    firstTableName = dataTableList[0]['sql']
                }
                else{
                    firstTableName = dataTableList[0]['tablename'];
                }
                $('#taskNameTitle2').text(firstTableName);
                //数据表列表
                for (let key in dataTableList) {
                    let choosed = "";
                    if (key === "0") {
                        choosed = "eee";
                    }
                    let id = dataTableList[key]['id'];
                    let taskname = dataTableList[key]['taskname'];
                    let taskstatus = dataTableList[key]['taskstatus'];
                    let statusinfo = dataTableList[key]['statusinfo'];
                    let tablename = dataTableList[key]['tablename'];
                    if(tablename==='sql'){
                        tablename = dataTableList[key]['sql'];
                    }
                    let status ="";
                    let button ="";
                    if(taskstatus==="1"||taskstatus==="2"){
                        status = "<span class='label label-info status'>运行中</span>";
                        button = "<button class='btn btn-info btn-xs resetTask' title='"+statusinfo+"'><i class='fa fa-rotate-left'></i></button><button class='btn btn-primary btn-xs stopTask' title='停止'><i class='fa fa-stop'></i></button><button class='btn btn-danger btn-xs deleteTable' title='删除表'><i class='fa fa-remove'></i></button>";
                    }
                    else{
                        if(statusinfo.indexOf("未执行")!==-1){
                            status = "<span class='label label-primary status'>未初始</span>";
                            button = "<button class='btn btn-info btn-xs resetTask' disabled title='"+statusinfo+"'><i class='fa fa-rotate-left'></i></button><button class='btn btn-primary btn-xs runTask' title='启动任务'><i class='fa fa-play'></i></button><button class='btn btn-danger btn-xs deleteTable' title='删除表'><i class='fa fa-remove'></i></button>";
                        }
                        else{
                            status = "<span class='label label-success status'>已完成</span>";
                            button = "<button class='btn btn-info btn-xs resetTask' title='"+statusinfo+"'><i class='fa fa-rotate-left'></i></button><button class='btn btn-primary btn-xs runTask' title='启动任务'><i class='fa fa-play'></i></button><button class='btn btn-danger btn-xs deleteTable' title='删除表'><i class='fa fa-remove'></i></button>";
                        }

                    }
                    str += "<article class='media event media2 " + choosed + "' data-id ='" + id + "' data-tablename='" + tablename + "'><a class='pull-left date' style='background: none'><div><img src='images/database.png' alt='database' style='width: 42px;height: 46px;'></div></a><div class='media-body'><a class='title taskname' href='javascript:void(0)'>" + taskname + "</a><p class='m10'>"+button+status+"</p></div></article>";
                }
                $("#leftMainDetails").html(str);
             /*   //判断是否有运行中的表数据如果有5S刷新一次
                $('.status').each(function () {
                   if($(this).text()==="运行中"){
                       setTimeout(getAllTables(databaseID),5000);
                       return false;
                   }
                });*/
                //数据字段列表

                tableFieldList(data)
            }
            //当数据为空时的操作
            else {
                $('#leftMainDetails').html("<div class='alert alert-danger'>暂无表,请新建表</div>");
                $("#tableFiledList").html("<tr><td colspan='7' style='text-align: center'>该表暂无数据</td></tr>");
                $('#taskNameTitle2').text("");
            }

        },
        error: function (data) {
            alert("系统出错" + data)
        }
    })
}

/**
 * 数据列表处理方法
 */
function tableFieldList(data) {
    //数据表字段列表
    let tableFieldList = data['tableFieldList'];
    let str2 = "";
    for (let key in tableFieldList) {
        let datatype = tableFieldList[key]['datatype'];
        let id = tableFieldList[key]['id'];
        let name = tableFieldList[key]['name'];
        let pk = tableFieldList[key]['pk'];
        let pluginArr = tableFieldList[key]['pluginArr'];
        let indexFieldArr = tableFieldList[key]['indexFieldArr'];
        let timeStampCheckbox = "";
        let ArrStr1 = "";
        for (let Arrkey in indexFieldArr) {

            let id = indexFieldArr[Arrkey]['id'];
            let name = indexFieldArr[Arrkey]['name'];
            if (indexFieldArr[Arrkey]['select'] === "true") {
                ArrStr1 += "<option value='" + id + "' selected>" + name + "</option>";
            }
            else {
                ArrStr1 += "<option value='" + id + "'>" + name + "</option>";
            }
        }
        let dateFieldArr = tableFieldList[key]['dateFieldArr'];
        let ArrStr2 = "";
        let cog = "";
        for (let Arrkey in pluginArr) {
            let id = pluginArr[Arrkey]['id'];
            let name = pluginArr[Arrkey]['name'];
            let selected = pluginArr[Arrkey]['select'];
            if (selected==='true'&&name==='dp.Blob'){
                cog = "<i class='fa fa-cog fa-lg plugin-cog'></i>";
            }
            if(selected==='true'){
                ArrStr2 += "<option value='" + id + "' data-index='"+key+"' selected>" + name + "</option>";
            }
            else{
                ArrStr2 += "<option value='" + id + "' data-index='"+key+"'>" + name + "</option>";
            }

        }
        if(datatype==="DATE"||datatype==="DATETIME"||datatype==="date"||datatype==="datetime"){
        if(dateFieldArr==="0"){
            timeStampCheckbox = "<input type='checkbox' name='timeStamp' value='' class='flat timeStamp'>";
        }
        else if(dateFieldArr==="1"){
            timeStampCheckbox ="<input type='checkbox' name='timeStamp' value='' class='flat timeStamp' checked>"
        }
        }
        if(pk==="1"){
            str2 += " <tr data-id='" + id + "'>\n" +
                "                    <td>\n" +
                "                          <input type=\"checkbox\" class=\"flat flatzz\" value='" + id + "'>\n" +
                "                    </td>\n" +
                "                    <td>" + name + "</td>\n" +
                "                    <td>" + datatype + "</td>\n" +
                "                    <td>\n" +
                "                      <select class=\"indexFieldArr\" name=\"indexFieldArr\">\n" + ArrStr1 +
                "                      </select>\n" +
                "                    </td>\n" +
                "                    <td><input type=\"checkbox\" name=\"keyWords\" value=\"\" class=\"flat keyWords\" checked></td>\n" +
                "                    <td>"+timeStampCheckbox+"</td>\n" +
                "                    <td>\n" +
                "                      <select class=\"dateFieldArr\" name=\"dateFieldArr\">\n" + ArrStr2 +
                "                      </select>\n" + cog +
                "                    </td>\n" +
                "                  </tr>"
        }
        else if(pk==="0"){
            str2 += " <tr data-id='" + id + "'>\n" +
                "                    <td>\n" +
                "                          <input type=\"checkbox\" class=\"flat flatzz\" value='" + id + "'>\n" +
                "                    </td>\n" +
                "                    <td>" + name + "</td>\n" +
                "                    <td>" + datatype + "</td>\n" +
                "                    <td>\n" +
                "                      <select class=\"indexFieldArr\" name=\"indexFieldArr\">\n" + ArrStr1 +
                "                      </select>\n" +
                "                    </td>\n" +
                "                    <td><input type=\"checkbox\" name=\"keyWords\" value=\"\" class=\"flat keyWords\"></td>\n" +
                "                    <td>"+timeStampCheckbox+"</td>\n" +
                "                    <td>\n" +
                "                      <select class=\"dateFieldArr\" name=\"dateFieldArr\">\n" + ArrStr2 +
                "                      </select>\n" + cog +
                "                    </td>\n" +
                "                  </tr>"
        }

    }
    if (str2 === "") {
        str2 = "<tr><td colspan='7' style='text-align: center'>该表暂无数据</td></tr>"
    }
    $("#tableFiledList").html(str2);
    if ($("input.flat")[0]) {
        $(document).ready(function () {
            $('input.flat').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });
        });
    }
    $('#check-all').iCheck('uncheck');
}

/**
 * 添加数据表Table类型下的option数据填充
 */

function getTableTypes(databaseID) {
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost + "/database/getTables",
        data: {
            databaseID: databaseID,
        },
        async: false,
        success: function (data2) {
            let data = JSON.parse(data2)['body'];
            let tables = data['tables'];
            let str = "";
            //数据表列表
            for (let key in tables) {
                str += "<option value='" + tables[key] + "'>" + tables[key] + "</option>"
            }
            $("#tableType").html(str);

        },
        error: function (data) {
            alert("系统出错" + data)
        }
    })
}

/**
 * 点击添加清除taskName
 */

function cleanParam() {
    $("#showAddTableModelBtn").click(function () {
        $("#taskName").val("")
    })

}

/**
 * 控制Table和SQL对应展现
 */

function toggleTableSQL() {
    $("#switch").change(function () {
        if ($(this).prop("checked") === true) {
            $('#tableType').show();
            $('#message').hide();
        }
        else {
            $('#tableType').hide();
            $('#message').show();
        }
    })
    $("#switch2").change(function () {
        if ($(this).prop("checked") === true) {
            $('#tableType2').show();
            $('#message2').hide();
        }
        else {
            $('#tableType2').hide();
            $('#message2').show();
        }
    })
}

/**
 * 新增数据表
 */

function addTable(databaseID, taskName, tableType, tableName, dataSql) {
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost + "/database/addTable",
        data: {
            databaseID: databaseID,
            taskName: taskName,
            tableType: tableType,
            tableName: tableName,
            dataSql: dataSql
        },
        async: false,
        success: function (data2) {
            let data = JSON.parse(data2);
            StatusHandle(data);
        },
        error: function (data) {
            alert("系统出错" + data)
        }
    })
}

/**
 * 新增数据表表单提交
 */

function addFromSubmit(databaseID) {
    $("#MySQL-form").validate({
        submitHandler: function () {
            let status=0;
            let taskName = $("#taskName").val();
            $('.taskname').each(function () {
                if($(this).text()===taskName){
                    status=1;
                    return false;
                }
            });
            if(status===0){
                let tableType;
                let dataSql;
                let tableName;
                if ($("#switch").prop("checked") === true) {
                    tableType = "1";
                    tableName = $('#tableType').val();
                    dataSql = "";
                }
                else {
                    tableType = "2";
                    tableName = "";
                    dataSql = $('#message').val();
                }
                addTable(databaseID, taskName, tableType, tableName, dataSql);
                $("#myModal").modal('hide');
                getAllTables(databaseID);
            }
            else {
                $.confirm({
                    confirmButtonClass: 'btn btn-info',
                    cancelButtonClass: 'btn-danger',
                    confirmButton:'确认',
                    cancelButton:'取消',
                    animation: 'zoom',
                    closeAnimation: 'rotateXR',
                    title: '警告！',
                    content: '该任务名已经存在（此确认框会在8秒后消失）',
                    autoClose: '确认|8000',
                    buttons: {
                        确认: function () {

                        },
                    }
                });
            }

        }
    });
}


/**
 * 重置某张数据表
 */

function resetTable(databaseID, taskid) {
    $.ajax({
        cache: true,
        type: "get",
        url: "http://" + localhost + "/database/taskrest",
        data: {
            databaseID: databaseID,
            taskID: taskid,
        },
        async: false,
        success: function (data2) {
            let data = JSON.parse(data2);
            StatusHandle(data);
            getAllTables(databaseID);
        },
        error: function (data) {
            alert("系统出错" + data)
        }
    })
}

/**
 * 点击重置操作
 */

function clickResetTable(databaseID) {
    $("#leftMainDetails").on('click', ".resetTask", function (e) {
        e.stopPropagation();
        let id = $(this).parent().parent().parent('.media2').data('id');
        $.confirm({
            confirmButtonClass: 'btn btn-info',
            cancelButtonClass: 'btn-danger',
            confirmButton: '确认',
            cancelButton: '取消',
            animation: 'zoom',
            closeAnimation: 'rotateXR',
            title: '重置？',
            content: '确认是否重置（此确认框会在8秒后消失）',
            autoClose: '否|8000',
            buttons: {
                deleteUser: {
                    text: '是',
                    action: function () {
                        resetTable(databaseID, id);
                    }
                },
                否: function () {

                },
            }
        });
    });
}

/**
 * 启动某张数据表
 */

function startTable(databaseID, id) {
    $.ajax({
        cache: true,
        type: "get",
        url: "http://" + localhost + "/database/start",
        data: {
            databaseID: databaseID,
            id: id,
        },
        async: false,
        success: function (data2) {
            let data = JSON.parse(data2);
            StatusHandle(data);
            getAllTables(databaseID);
        },
        error: function (data) {
            alert("系统出错" + data)
        }
    })
}

/**
 * 点击启动操作
 */

function clickStartTable(databaseID) {
    $("#leftMainDetails").on('click', ".runTask", function (e) {
        e.stopPropagation();
        let id = $(this).parent().parent().parent('.media2').data('id');
        $.confirm({
            confirmButtonClass: 'btn btn-info',
            cancelButtonClass: 'btn-danger',
            confirmButton: '确认',
            cancelButton: '取消',
            animation: 'zoom',
            closeAnimation: 'rotateXR',
            title: '启动？',
            content: '确认是否启动（此确认框会在8秒后消失）',
            autoClose: '否|8000',
            buttons: {
                deleteUser: {
                    text: '是',
                    action: function () {
                        startTable(databaseID, id)
                    }
                },
                否: function () {

                },
            }
        });
    });
}

/**
 * 停止某张数据表
 */

function stopTable(databaseID, id) {
    $.ajax({
        cache: true,
        type: "get",
        url: "http://" + localhost + "/database/stop",
        data: {
            databaseID: databaseID,
            id: id,
        },
        async: false,
        success: function (data2) {
            let data = JSON.parse(data2);
            StatusHandle(data);
            getAllTables(databaseID);
        },
        error: function (data) {
            alert("系统出错" + data)
        }
    })
}

/**
 * 点击停止操作
 */

function clickStopTable(databaseID) {
    $("#leftMainDetails").on('click', ".stopTask", function (e) {
        e.stopPropagation();
        let id = $(this).parent().parent().parent('.media2').data('id');
        $.confirm({
            confirmButtonClass: 'btn btn-info',
            cancelButtonClass: 'btn-danger',
            confirmButton: '确认',
            cancelButton: '取消',
            animation: 'zoom',
            closeAnimation: 'rotateXR',
            title: '停止？',
            content: '确认是否停止（此确认框会在8秒后消失）',
            autoClose: '否|8000',
            buttons: {
                deleteUser: {
                    text: '是',
                    action: function () {
                        stopTable(databaseID, id)
                    }
                },
                否: function () {

                },
            }
        });
    });
}


/**
 * 删除某张数据表
 */

function deleteTable(databaseID, id) {
    $.ajax({
        cache: true,
        type: "get",
        url: "http://" + localhost + "/database/taskrm",
        data: {
            databaseID: databaseID,
            id: id,
        },
        async: false,
        success: function (data2) {
            let data = JSON.parse(data2);
            StatusHandle(data);
            getAllTables(databaseID);
        },
        error: function (data) {
            alert("系统出错" + data)
        }
    })
}

/**
 * 点击删除操作
 */

function clickDeleteTable(databaseID) {
    $("#leftMainDetails").on('click', ".deleteTable", function (e) {
        e.stopPropagation();
        let id = $(this).parent().parent().parent('.media2').data('id');
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
                        deleteTable(databaseID, id)
                    }
                },
                否: function () {

                },
            }
        });
    });
}


/**
 * 查看某张数据表信息
 */

function detailMessage(databaseID, id) {
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost + "/database/getTables",
        data: {
            databaseID: databaseID,
            dataid: id,
        },
        async: false,
        success: function (data2) {
            let data = JSON.parse(data2)['body'];
            let tables = data['tables'];
            let selectedTable;
            $("#taskName2").val(data['taskName']);
            $('#taskName2').data('taskname',data['taskName']);
            $('#myModalLabel2').text('修改' + data['taskName'] + "任务");
            if (data['Table'] === "1") {
                $('#message2').val("");
                if($('#switch2').prop('checked')===false){
                    $('#switch2').click();
                }

                if (data['selectedTable'] !== undefined) {
                    selectedTable = data['selectedTable'];
                }

            }
            else {
                if($('#switch2').prop('checked')===true){
                    $('#switch2').click();
                };
                $('#message2').val(data['sql']);
            }
            let str = "";
            //数据表列表
            for (let key in tables) {
                if (selectedTable === tables[key]) {
                    str += "<option value='" + tables[key] + "' selected>" + tables[key] + "</option>"
                }
                else {
                    str += "<option value='" + tables[key] + "'>" + tables[key] + "</option>"
                }

            }
            $("#tableType2").html(str);
        },
        error: function (data) {
            alert("系统出错" + data)
        }
    })
}

/**
 * 点击表名查看详细信息
 */

function getdetailMessage(databaseID) {
    $('#leftMainDetails').on('click', '.taskname', function (e) {
        e.stopPropagation();
        paramId = $(this).parent().parent('.media2').data('id');
        let id = $(this).parent().parent('.media2').data('id');
        detailMessage(databaseID, id);
        $('#myModal2').modal('show');
    })
}

/**
 * 修改某张表的方法
 */

function changeTable(id, databaseID, taskName, tableType, tableName, dataSql) {
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost + "/database/editTabdo",
        data: {
            databaseID: databaseID,
            taskID: id,
            taskName: taskName,
            tableType: tableType,
            tableName: tableName,
            dataSql: dataSql
        },
        async: false,
        success: function (data2) {
            let data = JSON.parse(data2);
            StatusHandle(data);

        },
        error: function (data) {
            alert("系统出错" + data)
        }
    })
}

/**
 * 修改某表数据表单提交
 */

function changeFromSubmit(databaseID) {
    $("#MySQL-form2").validate({
        submitHandler: function () {
            let taskName = $("#taskName2").val();
            let status=0;
            $('.taskname').each(function () {
                if($(this).text()===taskName){
                    status=1;
                    return false;
                }
            });
            if(status===0||taskName===$('#taskName2').data('taskname')){
                let tableType;
                let dataSql;
                let tableName;
                if ($("#switch2").prop("checked") === true) {
                    tableType = "1";
                    tableName = $('#tableType2').val();
                    dataSql = "";
                }
                else {
                    tableType = "2";
                    tableName = "";
                    dataSql = $('#message2').val();
                }
                changeTable(paramId, databaseID, taskName, tableType, tableName, dataSql);
                $("#myModal2").modal('hide');
                getAllTables(databaseID);
            }
            else{
                $.confirm({
                    confirmButtonClass: 'btn btn-info',
                    cancelButtonClass: 'btn-danger',
                    confirmButton:'确认',
                    cancelButton:'取消',
                    animation: 'zoom',
                    closeAnimation: 'rotateXR',
                    title: '警告！',
                    content: '该任务名已经存在（此确认框会在8秒后消失）',
                    autoClose: '确认|8000',
                    buttons: {
                        确认: function () {

                        },
                    }
                });
            }

        }
    });
}

/**
 * 获取数据表字段列表方法
 */

function getTableProperties(id) {
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost + "/database/tableProperties",
        data: {
            id: id
        },
        async: false,
        success: function (data2) {
            let data = JSON.parse(data2)['body'];
            tableFieldList(data)
        },
        error: function (data) {
            alert("系统出错" + data)
        }
    })
}

/**
 * 点击数据表出现字段列表
 */

function showProperties() {
    $('body').on('click', '.media2', function () {
        let tablename = $(this).data('tablename');
        paramId2 = $(this).data('id');
        let id = $(this).data('id');
        $('#taskNameTitle2').text(tablename);
        $('.eee').removeClass('eee');
        $(this).addClass('eee');
        getTableProperties(id);
    })
}

/**
 * 选中或取消所有checkbox
 */

function checkbox() {
    $("#check-all").change(function () {

    })
}

/**
 * 删除数据表字段属性
 */

function deleteTabProper(taskID, checkID) {
    $.ajax({
        cache: true,
        type: "get",
        url: "http://" + localhost + "/database/tabProperRm",
        data: {
            taskID: taskID,
            checkID: checkID,
        },
        async: false,
        success: function (data2) {
            let data = JSON.parse(data2);
            StatusHandle(data);
        },
        error: function (data) {
            alert("系统出错" + data)
        }
    })
}

/**
 * 点击删除数据表字段属性
 */

function clickToDeleteTabProper() {
    $('#deleteDetailsParam').click(function () {
        let arr = [];
        $('.flatzz:checked').each(function () {
            arr.push($(this).val());
        });
        let checkID = arr.join(',');
        let taskID = $('.eee').data('id');
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
                        deleteTabProper(taskID, checkID);
                        getTableProperties(taskID);
                    }
                },
                否: function () {

                },
            }
        });


    })
}

/**
 * 修改数据表索引
 */

function updateIndexField(id, tId, indexFieldId) {
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost + "/database/updateIndexField",
        data: {
            id: id,
            tId: tId,
            indexFieldId: indexFieldId
        },
        async: false,
        success: function (data2) {
            let data = JSON.parse(data2);
        },
        error: function (data) {
            alert("系统出错" + data)
        }
    })
}

/**
 * 点击删除数据表字段属性
 */

function clickToUpdateIndexField() {
    $('#tableFiledList').on('change', '.indexFieldArr', function () {
        let id = $('.eee').data('id');
        let tId = $(this).parent().parent('tr').data('id');
        let indexFieldId = $(this).val();
        updateIndexField(id, tId, indexFieldId);
        //getTableProperties(id);
    });
}

/**
 * 修改主键方法
 */

function booleanKeyWords(taskID, checkID, tPk) {
    $.ajax({
        cache: true,
        type: "get",
        url: "http://" + localhost + "/database/updatePK",
        data: {
            taskID: taskID,
            checkID: checkID,
            tPk: tPk
        },
        async: false,
        success: function (data2) {
            let data = JSON.parse(data2);
        },
        error: function (data) {
            alert("系统出错" + data)
        }
    })
}

/**
 * 点击修改主键触发
 */

function clickToBooleanKeyWords() {
    let $tableFiledList = $('#tableFiledList');
    $tableFiledList.on('ifChecked', '.keyWords', function () {
        let taskID = $('.eee').data('id');
        let checkID = $(this).parent().parent().parent('tr').data('id');
        booleanKeyWords(taskID, checkID, "true");
    });
    $tableFiledList.on('ifUnchecked', '.keyWords', function () {
        let taskID = $('.eee').data('id');
        let checkID = $(this).parent().parent().parent('tr').data('id');
        booleanKeyWords(taskID, checkID, "false");
    })
}

/**
 * 修改时间戳方法
 */

function booleanTimestamp(taskID, checkID, tModits) {
    $.ajax({
        cache: true,
        type: "get",
        url: "http://" + localhost + "/database/updateModits",
        data: {
            taskID: taskID,
            chechID: checkID,
            tModits: tModits
        },
        async: false,
        success: function (data2) {
            let data = JSON.parse(data2);
        },
        error: function (data) {
            alert("系统出错" + data)
        }
    })
}

/**
 * 点击修改时间戳触发
 */

function clickToBooleanTimestamp() {
    let $tableFiledList = $('#tableFiledList');
    $tableFiledList.on('ifChecked', '.timeStamp', function () {
        let taskID = $('.eee').data('id');
        let checkID = $(this).parent().parent().parent('tr').data('id');
        booleanTimestamp(taskID, checkID, "true");
    });
    $tableFiledList.on('ifUnchecked', '.timeStamp', function () {
        let taskID = $('.eee').data('id');
        let checkID = $(this).parent().parent().parent('tr').data('id');
        booleanTimestamp(taskID, checkID, "false");
    })
}


/**
 * 修改插件方法
 */

function changeplugins(taskID, checkID, tpPluginID,index) {
    $.ajax({
        cache: true,
        type: "get",
        url: "http://" + localhost + "/database/inputParam",
        data: {
            taskID: taskID,
            checkID: checkID,
            tpPluginID: tpPluginID,
            index:index
        },
        async: false,
        success: function (data2) {
            let data = JSON.parse(data2);
        },
        error: function (data) {
            alert("系统出错" + data)
        }
    });
    $.ajax({
        cache: true,
        type: "get",
        url: "http://" + localhost + "/database/updatePlugin",
        data: {
            taskID: taskID,
            checkID: checkID,
            tpPluginID: tpPluginID
        },
        async: false,
        success: function (data2) {
            let data = JSON.parse(data2);
        },
        error: function (data) {
            alert("系统出错" + data)
        }
    });

}

/**
 * change修改插件触发
 */

function clickToChangeplugins() {
    let $tableFiledList = $('#tableFiledList');
    $tableFiledList.on('change', '.dateFieldArr', function () {
        let taskID = $('.eee').data('id');
        let checkID = $(this).parent().parent('tr').data('id');
        let tpPluginID = $(this).val();
        let index = $(this).find("option:selected").data('index');
        changeplugins(taskID, checkID, tpPluginID,index);
        //添加或者删除cog标识
       if($(this).find("option:selected").text()==='dp.Blob'){
        $(this).parent('td').append("<i class='fa fa-cog fa-lg plugin-cog'></i>")
       }
       else{
        $(this).parent('td').children('.plugin-cog').remove();
       }
    });
}

/**
 * 获取插件详细参数方法
 */

function getPluginParam(taskID,checkID,tpPluginID){
    $.ajax({
        cache: true,
        type: "get",
        url: "http://" + localhost + "/database/getPluginParam",
        data: {
            taskID: taskID,
            checkID: checkID,
            tpPluginID:tpPluginID
        },
        async: false,
        success: function (data2) {
            let data = JSON.parse(data2);
            let arr = data['body'];
            let str = "";
            for(let key in arr){
                str += "<option value='"+arr[key]+"'>"+arr[key]+"</option>";
            }
            $('#cog_param').html(str);
        },
        error: function (data) {
            alert("系统出错" + data)
        }
    })
}

/**
 * 点击cog图标调用获取插件方法出现具体值
 */

function clickToGetPluginParam(){
    $('#tableFiledList').on('click','.plugin-cog',function () {
        let taskID = $('.eee').data('id');
        let checkID = $(this).parent().parent('tr').data('id');
        let tpPluginID = $(this).parent('td').children('.dateFieldArr').val();
        getPluginParam(taskID,checkID,tpPluginID);
        $('#myModalLabel3').data('checkid',checkID);
        $('#myModal3').modal('show');
    })
}

/**
 * 修改参数方法
 */

function updatePluginParam(checkID,fileName){
    $.ajax({
        cache: true,
        type: "get",
        url: "http://" + localhost + "/database/updatePluginParam",
        data: {
            fileName: fileName,
            checkID: checkID,
        },
        async: false,
        success: function (data2) {
            let data = JSON.parse(data2);
            StatusHandle(data);
        },
        error: function (data) {
            alert("系统出错" + data)
        }
    })
}


/**
 * 点击确定触发修改参数方法
 */

function clickToUpdatePluginParam(){
$('#ChangeTableBtn3').click(function () {
    let checkID = $('#myModalLabel3').data('checkid');
    let fileName = $('#cog_param').val();
    updatePluginParam(checkID,fileName);
    $('#myModal3').modal('hide');
})
}

/**
 * checkbox全选和取消
 */

function toggleCheckbox() {
    let $body = $('body');
    $body.on('ifChecked', '#check-all', function () {
        $('.flatzz').iCheck('check');
    });
    $body.on('ifUnchecked', '#check-all', function () {
        $('.flatzz').iCheck('uncheck');
    })
}

/**
 * 获取到dtype后界面操作
 */

function afterGetDtype(dtype) {
   $('title').text(dtype+"数据表详情");//改变标题
    //文本修改
    $('.dataBaseTypeText').text(dtype);
    //左侧导航栏高亮
    $('.dataBaseJump').each(function () {
        if($(this).text()===dtype){
            $(this).parent('li').addClass('current-page');
            return false;
        }
    })
}

/**
 * 获取到taskNameTitle操作
 */

function getTaskNameTitle(taskname){
    let length = taskname.length;
    let message;
    if(length>7){
        message = taskname.substring(0,7)+"...";
    }
    else{
        message = taskname;
    }

     $('#taskNameTitle').text(message);
    $('#taskNameTitle').attr("title",taskname);
}
