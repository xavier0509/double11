var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", this.handleBackButton, false);
        document.addEventListener("backbuttondown", this.handleBackButtonDown, false);
        document.addEventListener("resume", this.handleresume, false);
        document.addEventListener("pause", this.handlepause, false);
    },
    handleresume: function() {

        console.log("zy============" + click_login);//===================zy

        if(click_login&&jr_loginChange){
            click_login = false;
            jr_loginChange = false;
            sentLog("landing_result",'{"last_page_name":"排行榜页面","page_name":"双十一登录弹窗","activity_name":"双十一活动--购物街","landing_result":"登录成功"}');
            hasLogin(needQQ,"ranking",false);
        }else if(click_login){
            click_login = false;
            jr_loginChange = false;
            sentLog("landing_result",'{"last_page_name":"排行榜页面","page_name":"双十一登录弹窗","activity_name":"双十一活动--购物街","landing_result":"登录失败"}');
        }

        if(jr_loginClick&&jr_loginChange){
            jr_loginClick = false;
            jr_loginChange = false;
            sentLog("landing_result",'{"last_page_name":"免单页面","page_name":"双十一登录弹窗","activity_name":"双十一活动--购物街","landing_result":"登录成功"}');
            fromFreeAndFresh = true;
            hasLogin(needQQ,false,false);
        }else if(jr_loginClick){
            jr_loginClick = false;
            jr_loginChange = false;
            sentLog("landing_result",'{"last_page_name":"免单页面","page_name":"双十一登录弹窗","activity_name":"双十一活动--购物街","landing_result":"登录失败"}');
        }else{

        }

        if(resumeAndFresh){
            $("#nochancebox").hide();
            $("#blackBg").hide();
            resumeAndFresh = false;
        //    showPage(false,true);
            hasLogin(needQQ,true,false);//===========zy从获奖界面退出需要判断是否有登录
        }
    },
    handlepause: function() {
        console.log("===========================pause==========");
    },
    handleBackButton: function() {

    },
    handleBackButtonDown: function() {
        if($("#rulePage").css("display")=="block"){
            $("#mainbox").show();
            $("#rulePage").hide();
            map = new coocaakeymap($(".coocaabtn"), $("#rule"), "btnFocus", function() {}, function(val) {}, function(obj) {});
        }else if($("#freerule").css("display")=="block"){
            $("#freerule").hide();
            $("#blackBg").hide();
            map = new coocaakeymap($(".coocaabtn"), $("#freebtn"), "btnFocus", function() {}, function(val) {}, function(obj) {});
        }else if($("#freePage").css("display")=="block"){
            if(freeexit == "exit"){
                exit();
            }else{
                $("#mainbox").show();
                $("#freePage").hide();
                map = new coocaakeymap($(".coocaabtn"), $("#freeList"), "btnFocus", function() {}, function(val) {}, function(obj) {});
            }
        }else if($("#nochancebox").css("display")=="block"){
            $("#nochancebox").hide();
            $("#blackBg").hide();
            if($("#rankbox").css("display")=="block"){
              //=======================================
                rankingList();
            }else{
                $("#mainbox").show();
                map = new coocaakeymap($(".coocaabtn"), $("#gameing"), "btnFocus", function() {}, function(val) {}, function(obj) {});
            }
        }else if($("#helpQrcode").css("display")=="block"){
            $("#helpQrcode").hide();
            $("#blackBg").hide();
            console.log("------------------"+$("#rankbox").css("display"))
            if($("#rankbox").css("display")=="block"){
                //=======================================
                $.ajax({
                    type: "GET",
                    async: true,
                    url: adressIp+"/light/eleven/get-chance",
                    data: {cNickName:nick_name,activeId:actionId, MAC:macAddress,cChip:TVchip,cModel:TVmodel,cEmmcCID:emmcId,cUDID:activityId,cOpenId:cOpenId,source:movieSource},
                    dataType: "json",
                    success: function(data) {
                        if(data.code == 50100){
                            console.log("------------init----result-------------"+JSON.stringify(data));
                            gameChance = data.data;
                            rankingList();
                        }else{
                            console.log("------------init----result-------------"+JSON.stringify(data));
                            rankingList();
                        }
                    },
                    error: function() {
                        console.log("error");
                    }
                });

            }else{
                $("#mainbox").show();
                showPage(false,false);
            }
        }
        else if($("#rankbox").css("display")=="block"){//=================zy============
            if(needInit){
                needInit = false;
                $("#mainbox").show();
                document.getElementById("rankbox").style.display = "none";
                showPage(false,false);
            }else{
                $("#mainbox").show();
                document.getElementById("rankbox").style.display = "none";
                map = new coocaakeymap($(".coocaabtn"), $("#awardlist"), "btnFocus", function() {}, function(val) {}, function(obj) {});
            }

        } else{
            exit()
        }
    },

    onDeviceReady: function() {
        cordova.require("coocaaosapi");
        app.receivedEvent('deviceready');
        app.triggleButton();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelectorAll('.received');
        // listeningElement.setAttribute('style', 'display:none;');
        for (var i = 0, j = receivedElement.length; i < j; i++) {
            // receivedElement[i].setAttribute('style', 'display:block;');
        }
        /*receivedElement.setAttribute('style', 'display:block;');*/

        console.log('Received Event: ' + id);
        if(gameVersion<101044){
            appDown.listenApp();
            appDown.createDownloadTask("http://apk.sky.fs.skysrt.com/uploads/20181030/20181030114924347482.apk", "1D4CB3A15516FA1A102C4116B3F9A2D1", "红包游戏", "com.coocaa.ie", "101044", "http://img.sky.fs.skysrt.com//uploads/20170415/20170415110115834369.png");
        }
        coocaaosapi.getDeviceInfo(function(message) {
            deviceInfo = message;
            if (deviceInfo.version < '6') {
                android.getPropertiesValue("persist.service.homepage.pkg", function(data) {
                    var val = data.propertiesValue;
                    if ("com.tianci.movieplatform" == val) {
                        startActionReplace = "coocaa.intent.action.HOME.Translucent";
                    } else {
                        startActionReplace = "coocaa.intent.movie.home";
                    }
                });
            }
            console.log("deviceinfo=============="+JSON.stringify(deviceInfo))
            macAddress = message.mac;
            TVmodel = message.model;
            TVchip = message.chip;
            activityId = message.activeid;
            if (message.emmcid ==""||message.emmcid==null) {
                emmcId = "123456";
            } else{
                emmcId = message.emmcid;
            }
            var a ={MAC:macAddress,cChip:TVchip,cModel:TVmodel,cEmmcCID:emmcId,cUDID:activityId,cSize:message.panel,cChannel:"coocaa"};
            console.log("data====="+JSON.stringify(a))
            $.ajax({
                type: "post",
                async: true,
                url: adressIp + "/light/active/tv/source",
                data: {cNickName:nick_name,MAC:macAddress,cChip:TVchip,cModel:TVmodel,cEmmcCID:emmcId,cUDID:activityId,cSize:message.panel,cChannel:"coocaa",aSdk:message.androidsdk,cTcVersion:message.version.replace(/\.*/g,""),cBrand:message.brand},
                dataType: "json",
                // timeout: 20000,
                success: function(data) {
                    console.log("返回状态：" + JSON.stringify(data));
                    if(data.code == 0){
                        movieSource = data.data.source;
                        if(movieSource == "tencent"){
                            needQQ = true;
                        }
                    }
                    hasLogin(needQQ,true,true);

                    listenUser();
                    listenPay();
                    // listenCommon();
                },
                error: function(error) {
                    console.log("-----------访问失败---------"+JSON.stringify(error));
                }
            });
        }, function(error) { console.log("get deviceinfo error") })
    },
    triggleButton: function() {
        cordova.require("coocaaosapi");
    }
};


app.initialize();


function exit() {
    navigator.app.exitApp();
}
var appDown = {
    //移除监听
    removeApklisten: function() {
        coocaaosapi.removeAppTaskListener(function(message){});
    },
    //监听下载状态
    listenApp:function(){
        coocaaosapi.addAppTaskListener(function(message) {
            console.log("msg.status ==" + message.status + "======url======" + message.url + "=========num=====" + showprogress);
            if (message.status == "ON_DOWNLOADING") {
                if (showprogress != message.progress) {
                    showprogress = message.progress;
                }
            }
            else if (message.status == "ON_COMPLETE") {
                waitApkInstallFunc =  setTimeout('appDown.downFail()', 120000);
            } else if (message.status == "ON_STOPPED") {
                appDown.downFail()
            } else if (message.status == "ON_REMOVED"&& message.url == "http://apk.sky.fs.skysrt.com/uploads/20181030/20181030114924347482.apk") {
                clearTimeout(waitApkInstallFunc);
                var a = '{ "pkgList": ["com.coocaa.ie"] }'
                coocaaosapi.getAppInfo(a, function(message) {
                    console.log("getAppInfo====" + message);
                    var b = "com.coocaa.ie";
                    gameVersion = JSON.parse(message)[b].versionCode;
                }, function(error) {
                    console.log("getAppInfo----error" + JSON.stringify(error))
                });
                appDown.removeApklisten();
            }
        });
    },

    //下载安装失败
    downFail: function() {
        downToast = "游戏加载失败，正在重试...";
        downGameFalse = true;
        clearTimeout(waitApkInstallFunc);
        appDown.removeApklisten();
    },

    //下载安装apk
    createDownloadTask: function(apkurl, md5, title, pkgname, appid, iconurl) {
        coocaaosapi.createDownloadTask(
            apkurl, md5, title, pkgname, appid, iconurl,
            function(message) {
               downToast = "游戏正在努力加载中~请在加载完毕后再次点击进入";
            },
            function(error) {
                console.log(error);
                console.log("调用失败");
            }
        )
    },
}

//监听账户状态变化
function listenUser() {
    coocaaosapi.addUserChanggedListener(function(message) {
        console.log("账户状态变化")
        //刷新前的逻辑判断
        needSentUserLog = true;
        jr_loginChange = true;
    });
}

//监听支付状态
function listenPay() {
    coocaaosapi.addPurchaseOrderListener(function(message) {
        console.log("xjr----------->startpurcharse message  支付结果 " + JSON.stringify(message));
        if (message.presultstatus == 0) {//支付完成~~~~~~
            sentLog("free_wares_pay_succsse",'{"page_name":"免单专区页面","activity_name":"双十一活动--购物街","product_name":"'+rememberGood+'"}');
        }else{
            sentLog("nalm_buy_for_view_card_pay_result",'{"pay_result":"0"}');
        }
    });
}

//通用播放器监听
function listenCommon() {
    coocaaosapi.addCommonListener(function(message) {
        console.log("addCommonListener==" + JSON.stringify(message));
        if(message.web_player_event == "on_complete") {

        }
    })
}

function initMap(setFocus) {
    initBtn();

    map = new coocaakeymap($(".coocaabtn"), $(setFocus), "btnFocus", function() {}, function(val) {}, function(obj) {});
    // $(setFocus).trigger("itemFocus");
    if(needgotoshop){
        needgotoshop = false;
        $("#freeList").trigger("itemClick");
    }else if(needgotogame){
        needgotogame = false;
        if(gameStatus == "start"){
            $("#gameing").trigger("itemClick");
        }else{
            console.log("----------------从弹窗进入，但不在游戏期内，不触发点击----------------");
        }
    }
}
function initBtn() {
    $(".module").unbind("itemFocus").bind("itemFocus",function () {
        var num = $(".module").index($(this));
        var x = 0;
        switch (num)
        {
            case 0:case 1:case 2:
                x="270";
                break;
            case 3:case 4:case 5:
                x="540";
                break;
            case 6:case 7:case 8:
                x="810";
                break;
            case 9:case 10:case 11:
                if(gameStatus == "start"){
                    x="1100"
                }else{x="920";}
                break;
        }
        $("#mainbox").css("transform", "translate3D(0, -" + x + "px, 0)");
    })
    $(".module").unbind("itemBlur").bind("itemBlur",function () {
        $("#mainbox").css("transform", "translate3D(0, -" + 0 + "px, 0)");
    })

    $("#freebtn").unbind("itemFocus").bind("itemFocus",function () {
        $(".fbtnfocus").show();
    })
    $("#freebtn").unbind("itemBlur").bind("itemBlur",function () {
        $(".fbtnfocus").hide();
    })
    $("#freebtn").unbind("itemClick").bind("itemClick",function () {
        $("#freerule").show();
        $("#blackBg").show();
        map = new coocaakeymap($("#freerule"),null, "btnFocus", function() {}, function(val) {}, function(obj) {});
        $("#freerule").unbind("itemClick").bind("itemClick",function () {
            $("#freerule").hide();
            $("#blackBg").hide();
            map = new coocaakeymap($(".coocaabtn"),$("#freebtn"), "btnFocus", function() {}, function(val) {}, function(obj) {});
        })
    })

    $("#rule").unbind("itemClick").bind("itemClick",function () {
        if(gameStatus == "start"){page_type = "游戏进行中"}
        sentLog("shopping_mall_page_button_click",'{"button_name":"游戏规则","page_name":"活动主页面","activity_name":"双十一活动--购物街","page_type":"'+page_type+'"}');
        $("#mainbox").hide();
        $("#rulePage").show();
        sentLog("free_wares_page_show",'{"page_name":"活动规则","activity_name":"双十一活动--购物街"}');
        map = new coocaakeymap($("#ruleInner"),null, "btnFocus", function() {}, function(val) {}, function(obj) {});
    })

    $("#myaward").unbind("itemClick").bind("itemClick",function () {
        if(gameStatus == "start"){page_type = "游戏进行中"}
        sentLog("shopping_mall_page_button_click",'{"button_name":"我的奖励","page_name":"活动主页面","activity_name":"双十一活动--购物街","page_type":"'+page_type+'"}');
        resumeAndFresh = true;
        coocaaosapi.startNewBrowser2(awardurl,function(){},function(){});
    })

    $("#freeList").unbind("itemClick").bind("itemClick",function () {
        if(gameStatus == "start"){page_type = "游戏进行中"}
        sentLog("shopping_mall_page_button_click",'{"button_name":"免单专区入口","page_name":"活动主页面","activity_name":"双十一活动--购物街","page_type":"'+page_type+'"}');
        $("#mainbox").hide();
        $("#freePage").show();
        sentLog("free_wares_page_show",'{"page_name":"免单专区页面","activity_name":"双十一活动--购物街"}');
        $(".freshList").html("");
        $("#freeDiv").css("transform", "translate3D(0, -0px, 0)");
        if(countDay >= 9){
            $("#specialFree").show();
            var specialbox = document.getElementById("specialList");
            for(var i=1;i<=8;i++){
                var pkg = "pkg"+i;
                var specialli = document.createElement("div");
                specialli.setAttribute("class","product coocaabtn");
                specialli.setAttribute("price",_freeList3[pkg].price);
                specialli.setAttribute("product_id",_freeList3[pkg].product_id);
                specialli.setAttribute("pageid",_freeList3[pkg].id);
                specialli.setAttribute("pagename",_freeList3[pkg].name);
                specialli.setAttribute("pageType",_freeList3[pkg].type);
                specialli.style.background = "url("+_freeList3[pkg].img+")";
                specialbox.appendChild(specialli);
            }
        }else{
            $("#normalFree").css("top","0");
        }
        var normalbox = document.getElementById("normalList");
        for(var i=1;i<=8;i++){
            var pkg = "pkg"+i;
            var freelist = null;
            var normalli = document.createElement("div");
            normalli.setAttribute("class","product coocaabtn");
            if(movieSource == "tencent"){
                freelist = _freeList2;
            }else{
                freelist = _freeList;
            }
            normalli.setAttribute("price",freelist[pkg].price);
            normalli.setAttribute("product_id",freelist[pkg].product_id);
            normalli.setAttribute("pageid",freelist[pkg].id);
            normalli.setAttribute("pagename",freelist[pkg].name);
            normalli.setAttribute("pageType",freelist[pkg].type);
            normalli.style.background = "url("+freelist[pkg].img+")";
            normalbox.appendChild(normalli);
        }
        $(".product").unbind("itemFocus").bind("itemFocus",function () {
            var changeY = 0;
            var specialnum = $("#specialList .product").index($(this));
            var normalnum = $("#normalList .product").index($(this));
            if($("#specialFree").css("display") == "none"){
                changeY = Math.floor(normalnum/5)*398;
            }else{
                if(specialnum!=-1){
                    changeY = Math.floor(specialnum/5)*398;
                }else{
                    changeY = Math.floor(normalnum/5)*398 + Math.ceil($("#specialList .product").length/5)*398;
                }
            }
            $("#freeDiv").css("transform", "translate3D(0, -" + changeY + "px, 0)");
        })
        $(".product").unbind("itemClick").bind("itemClick",function () {
            var _this = this;
            rememberGood = $(_this).attr("pagename");
            sentLog("free_wares_click",'{"product_name":"'+$(_this).attr("pagename")+'","page_name":"免单专区页面","activity_name":"双十一活动--购物街"}');
            if($(this).attr("pageType") == "1"){
                coocaaosapi.startAppShopDetail($(this).attr("pageid"),function(){},function(){});
            }else{
                if(loginstatus == "true"){
                    order($(this).attr("product_id"),$(this).attr("price"));
                }else{
                    jr_loginClick = true;
                    sentLog("landing_page_show",'{"last_page_name":"免单页面","page_name":"双十一登录弹窗","activity_name":"双十一活动--购物街"}');
                    startLogin(needQQ);
                }
            }
        })
        map = new coocaakeymap($(".coocaabtn"),$(".product:eq(0)"), "btnFocus", function() {}, function(val) {}, function(obj) {});
    })


    $("#gameing,#waitgame").unbind("itemClick").bind("itemClick",function () {
        console.log("rank_to_game============"+rank_to_game);
        if(gameStatus == "start"){page_type = "游戏进行中"}
        if(rank_to_game == "again"){
            rank_to_game = "";
            sentLog("top_list_page_button_click",'{"button_name":"再玩一次","page_name":"排行榜页面","activity_name":"双十一活动--购物街","page_type":"'+page_type+'"}');
        }else if(rank_to_game == "start"){
            rank_to_game = "";
            sentLog("top_list_page_button_click",'{"button_name":"开启红包雨","page_name":"排行榜页面","activity_name":"双十一活动--购物街","page_type":"'+page_type+'"}');
        }else if(rank_to_game == "free"){
            rank_to_game = "";
            sentLog("top_list_page_button_click",'{"button_name":"我要赢免单","page_name":"排行榜页面","activity_name":"双十一活动--购物街","page_type":"'+page_type+'"}');
        }else{
            sentLog("shopping_mall_page_button_click",'{"button_name":"游戏入口","page_name":"活动主页面","activity_name":"双十一活动--购物街","page_type":"'+page_type+'"}');
        }
        console.log("++++++++++"+gameVersion);
        if(gameVersion < 101044){
            console.log("+++++++++++++++++"+downToast);
            $("#msgToast").html("&nbsp&nbsp&nbsp"+downToast+"&nbsp&nbsp&nbsp");
            $("#msgToastBox").show();
            setTimeout("document.getElementById('msgToastBox').style.display = 'none'", 3000);
            if(downGameFalse){
                downGameFalse = false;
                appDown.listenApp();
                appDown.createDownloadTask("http://apk.sky.fs.skysrt.com/uploads/20180206/20180206103450797932.apk", "98B59D6C52B8BFEA17D250D5D9FF3F1D", "优选购物", "com.coocaa.mall", "26040", "http://img.sky.fs.skysrt.com//uploads/20170415/20170415110115834369.png");
            }
        }else{
            console.log("+++++++++++已安装最新版游戏");
            //判断是否在游戏期内；是否还有游戏机会；
            //增加接口，点击时判断是否在游戏期内
            $.ajax({
                type: "get",
                async: true,
                url: adressIp + "/light/eleven/game-start",
                data: {cNickName:nick_name,activeId:actionId},
                dataType: "json",
                success: function(data) {
                    console.log("------------ifStart----result-------------"+JSON.stringify(data));
                    if (data.code == 50100) {
                        if(data.data.ifStart){
                            if(gameChance > 0){
                                //todo Start Game------
                                resumeAndFresh = true;
                                document.getElementById("rankbox").style.display = "none";
                                coocaaosapi.startRedGame(""+gameChance,userKeyIdinit,function(){
                                    console.log("success");
                                    sentLog("money_rain_page_show",'{"page_name":"红包雨游戏页面","activity_name":"双十一活动--购物街"}');
                                },function(err){console.log("--------------openGameError"+err)});
                            }else{
                                //todo show windown for mission or qrcode
                                sentLog("get_game_go_on_page_show",'{"page_name":"获取游戏机会弹窗","activity_name":"双十一活动--购物街"}');
                                $("#nochancebox").show();
                                $("#blackBg").show();
                                $("#gotoMissionborder").show();
                                $("#helpFriendborder").hide();
                                map = new coocaakeymap($(".coocaabtn2"),null, "btnFocus", function() {}, function(val) {}, function(obj) {});
                                $("#gotoMission").unbind("itemFocus").bind("itemFocus",function () {
                                    $("#gotoMissionborder").show();
                                    $("#helpFriendborder").hide();
                                })
                                $("#helpFriend").unbind("itemFocus").bind("itemFocus",function () {
                                    $("#gotoMissionborder").hide();
                                    $("#helpFriendborder").show();
                                })
                                $("#gotoMission").unbind("itemClick").bind("itemClick",function () {
                                    sentLog("get_game_go_on_button_click",'{"button_name":"做任务","page_name":"获取游戏机会弹窗","activity_name":"双十一活动--购物街"}');
                                    if(isTaskOver == taskList.length){
                                        $("#mission2").trigger("itemClick");
                                    }else{
                                        $("#mission1").trigger("itemClick");
                                    }
                                })
                                $("#helpFriend").unbind("itemClick").bind("itemClick",function () {
                                    sentLog("get_game_go_on_button_click",'{"button_name":"求助好友","page_name":"获取游戏机会弹窗","activity_name":"双十一活动--购物街"}');
                                    $("#nochancebox").hide();
                                    $("#helpQrcode").show();
                                    sentLog("get_game_go_on_page_show",'{"page_name":"分享二维码弹窗","activity_name":"双十一活动--购物街"}');
                                    $("#qrcodeBox").html("");
                                    var qrcode = new QRCode(document.getElementById("qrcodeBox"),{width:200,height:200,correctLevel: 3});
                                    qrcode.makeCode(helpurl+"?activeId="+actionId+"&macAddress="+macAddress+"&emmcId="+emmcId+"&cUDID="+activityId+"&cOpenId="+cOpenId);
                                })

                            }
                        }else{
                            if(actionStatus == "end"|| (timePart.nextTimePart == null&& !timePart.ifStart)){
                                $("#msgToast").html("&nbsp&nbsp&nbsp本次活动已结束，快去“我的奖励”页面查看你的战利品吧&nbsp&nbsp&nbsp");
                            }else{
                                $("#msgToast").html("&nbsp&nbsp&nbsp抱歉，游戏未开始~可先做任务提前累积游戏机会哦&nbsp&nbsp&nbsp");
                            }
                            $("#msgToastBox").show();
                            setTimeout("document.getElementById('msgToastBox').style.display = 'none'", 3000);
                        }
                    } else{
                        if(actionStatus == "end"|| (timePart.nextTimePart == null&& !timePart.ifStart)){
                            $("#msgToast").html("&nbsp&nbsp&nbsp本次活动已结束，快去“我的奖励”页面查看你的战利品吧&nbsp&nbsp&nbsp");
                        }else{
                            $("#msgToast").html("&nbsp&nbsp&nbsp抱歉，游戏未开始~可先做任务提前累积游戏机会哦&nbsp&nbsp&nbsp");
                        }
                        $("#msgToastBox").show();
                        setTimeout("document.getElementById('msgToastBox').style.display = 'none'", 3000);
                    }
                },
                error: function(error) {
                    console.log("--------访问失败" + JSON.stringify(error));
                }
            });
        }
    })

    $("#again_btn").unbind("itemClick").bind("itemClick",function () {
        needgotoRankList = true;
        rank_to_game = "again";
        $("#gameing").trigger("itemClick");
    })

    $("#start_game").unbind("itemClick").bind("itemClick",function () {
        needgotoRankList = true;
        rank_to_game = "start";
        $("#gameing").trigger("itemClick");
    })
    $("#free_btn").unbind("itemClick").bind("itemClick",function () {
        needgotoRankList = true;
        rank_to_game = "free";
        $("#gameing").trigger("itemClick");
    })
    $("#mission1").unbind("itemClick").bind("itemClick",function () {
        if(clickFast){
            setTimeout(setClickFast,5000);
            return;
        }else {
            clickFast = true;
        }
        function setClickFast() {
            clickFast = false;
        }
        if(actionStatus == "end"|| (timePart.nextTimePart == null&& !timePart.ifStart)){
            $("#msgToast").html("&nbsp&nbsp&nbsp本次活动已结束，快去“我的奖励”页面查看你的战利品吧&nbsp&nbsp&nbsp");
            $("#msgToastBox").show();
            setTimeout("document.getElementById('msgToastBox').style.display = 'none'", 3000);
            return;
        }

        resumeAndFresh = true;
        function startMission1(obj) {
            var startType = $(obj).attr("taskType");
            switch (startType)
            {
                case "movieDetail"://影视详情页
                    var pageid = $(obj).attr("pageid");
                    coocaaosapi.startMovieDetail(pageid,function(){},function(){});
                    break;
                case "layout"://版面
                    var pageid = $(obj).attr("pageid");
                    coocaaosapi.startHomeCommonList(pageid,function(msg){exit()},function(error){});
                    break;
                case "eduEquity"://产品包页面
                    var pageid = $(obj).attr("pageid");
                    coocaaosapi.startMovieMemberCenter("1",pageid,function(){},function(){});
                    break;
                case "movieEquity"://产品包页面
                    var pageid = $(obj).attr("pageid");
                    coocaaosapi.startMovieMemberCenter("0",pageid,function(){},function(){});
                    break;
                case "tvmallTopic"://购物专题
                    var pageid = $(obj).attr("pageid");
                    coocaaosapi.startAppShopZone2(pageid,function(){},function(){});
                    break;
                case "movieTopic"://影视专题
                    var pageid = $(obj).attr("pageid");
                    coocaaosapi.startMovieSomePage(pageid,function(){},function(){});
                    break;
            }
        }
        var _this = this;
        if(gameStatus == "start"){page_type = "游戏进行中"}
        if(rank_to_tast == "true"){
            rank_to_tast = "false";
            sentLog("top_list_page_button_click",'{"button_name":"做任务","page_name":"排行榜页面","activity_name":"双十一活动--购物街","page_type":"'+page_type+'"}');
        }else{
            sentLog("shopping_mall_page_button_click",'{"button_type":"'+$(_this).attr("taskname")+'","button_name":"任务一","page_name":"活动主页面","activity_name":"双十一活动--购物街","page_type":"'+page_type+'"}');
        }

        console.log("--------"+_this);
        if(isTaskOver == taskList.length){
            sentLog("shopping_mall_taskone_result",'{"button_type":"'+$(_this).attr("taskname")+'","task_result":"任务一完成","activity_name":"双十一活动--购物街","page_type":"'+page_type+'"}');
            startMission1(_this);
        }else{
            sentLog("shopping_mall_taskone_result",'{"button_type":"'+$(_this).attr("taskname")+'","task_result":"任务一未完成","activity_name":"双十一活动--购物街","page_type":"'+page_type+'"}');
            $.ajax({
                type: "post",
                async: true,
                url: adressIp + "/light/eleven/add-chance",
                data: {cNickName:nick_name,activeId:actionId, MAC:macAddress,cChip:TVchip,cModel:TVmodel,cEmmcCID:emmcId,cUDID:activityId,cOpenId:cOpenId,source:movieSource,chanceSource:3},
                dataType: "json",
                success: function(data) {
                    console.log("------------accChance----result-------------"+JSON.stringify(data));
                    if (data.code == 50100) {
                        startMission1(_this);
                    } else{
                        startMission1(_this);
                    }
                },
                error: function(error) {
                    console.log("--------访问失败" + JSON.stringify(error));
                }
            });
        }
    })

    $("#mission2").unbind("itemClick").bind("itemClick",function () {
        if(gameStatus == "start"){page_type = "游戏进行中"}
        if(rank_to_tast == "true"){
            rank_to_tast = "false";
            sentLog("top_list_page_button_click",'{"button_name":"做任务","page_name":"排行榜页面","activity_name":"双十一活动--购物街","page_type":"'+page_type+'"}');
        }else{
            sentLog("shopping_mall_page_button_click",'{"button_name":"任务二","page_name":"活动主页面","activity_name":"双十一活动--购物街","page_type":"'+page_type+'"}');
        }
        var _this = this;
        if(actionStatus == "end"|| (timePart.nextTimePart == null&& !timePart.ifStart)){
            $("#msgToast").html("&nbsp&nbsp&nbsp本次活动已结束，快去“我的奖励”页面查看你的战利品吧&nbsp&nbsp&nbsp");
            $("#msgToastBox").show();
            setTimeout("document.getElementById('msgToastBox').style.display = 'none'", 3000);
        }else{
            if(movieSource == "tencent"){
                coocaaosapi.startMovieHomeSpecialTopic("102829",function(msg){exit()},function(error){});
            }else{
                coocaaosapi.startMovieHomeSpecialTopic("102830",function(msg){exit()},function(error){});
            }
        }
    })
    $(".module").unbind("itemClick").bind("itemClick",function () {
        var _this = this;
        remembernum = $(".module").index($(this));
        var remembernum123 = $(".module").index($(this))+"";
        // console.log(remembernum+"****************"+(_this).parentNode.getAttribute("bannerType"));
        var business = (_this).parentNode.getAttribute("bannerType");
        var block_bussiness_type=null,block_order=null,block_name=null;
        switch (business){
            case "movie":
                block_bussiness_type = "影视";
                break;
            case "edu":
                block_bussiness_type = "教育";
                break;
            case "mall":
                block_bussiness_type = "购物";
                break;
            case "apk":
                block_bussiness_type = "应用";
                break;
            default:
                block_bussiness_type = "影视";
                break;
        }
        switch (remembernum123){
            case "0":case "3":case "6":case "9":
                block_order = "入口一";
                break;
            case "1":case "4":case "7":case "10":
                block_order = "入口二";
                break;
            case "2":case "5":case "8":case "11":
                block_order = "入口三";
                break;
            default:
                block_order = "入口一";
                break;
        }
        // console.log(remembernum+"****************"+(_this).parentNode.getAttribute("bannerType"));
        console.log("=======block_order======="+block_order);
        block_name = $(_this).attr("missionname");
        if(gameStatus == "start"){page_type = "游戏进行中"};
        sentLog("shopping_mall_page_button_click",'{"block_bussiness_type":"'+block_bussiness_type+'","block_order":"'+block_order+'","block_name":"'+block_name+'","button_name":"各业务入口","page_name":"活动主页面","activity_name":"双十一活动--购物街","page_type":"'+page_type+'"}');
        // console.log("------------startOperate-------- "+$(_this).attr("missionparam")+"========"+JSON.parse($(_this).attr("missionparam")).params);
        startOperate(_this);
    })

    //======================zy===================
    $("#login_btn").unbind("itemClick").bind("itemClick",function () {
        click_login = true;
        sentLog("top_list_page_button_click",'{"button_name":"立即登录","page_name":"排行榜页面","activity_name":"双十一活动--购物街","page_type":"'+page_type+'"}');
        startLogin(needQQ)
    })

    $("#rank_btn,#11_rank_btn,#task_btn").unbind("itemClick").bind("itemClick",function () {//做任务
        rank_to_tast = "true";
        if(isTaskOver == taskList.length){
            $("#mission2").trigger("itemClick");
        }else{
            $("#mission1").trigger("itemClick");
        }
    })

    $("#awardlist").unbind("itemClick").bind("itemClick",function () {
        if(gameStatus == "start"){page_type = "游戏进行中"}
        sentLog("shopping_mall_page_button_click",'{"button_name":"排行榜、免单榜","page_name":"活动主页面","activity_name":"双十一活动--购物街","page_type":"'+page_type+'"}');

        if(actionStatus == "end" || (timePart.nextTimePart == null&& !timePart.ifStart)){
            $("#msgToast").html("&nbsp&nbsp&nbsp本次活动已结束，快去“我的奖励”页面查看你的战利品吧&nbsp&nbsp&nbsp");
            $("#msgToastBox").show();
            setTimeout("document.getElementById('msgToastBox').style.display = 'none'", 3000);
        }else{
            rankingList();
        }
    })
}

function order(productid,price) {
    console.log("-------------"+productid+"============"+price);
    var data = JSON.stringify({
        user_id: access_token, //accesstoken
        user_flag: 1,
        third_user_id: qqtoken,
        product_id: productid, //需改
        movie_id: "",
        node_type: "res",
        client_type: 1,
        title: "双十一产品包",
        price: price, //需改
        count: 1,
        discount_price: "", //需改
        coupon_codes: "",
        auth_type: 0,
        mac: macAddress,
        chip: TVchip,
        model: TVmodel,
        extend_info: { "login_type": login_type, "wx_vu_id": vuserid },
    })
    var data1 = encodeURIComponent(data);
    console.log(data);
    $.ajax({
        type: "get",
        async: true,
        url: orderUrl + data1, //需改
        dataType: "jsonp",
        jsonp: "callback",
        timeout: 20000,
        success: function(data) {
            console.log("返回状态：" + JSON.stringify(data));
            if (data.code == 0) {
                orderId = data.data.orderId;
                console.log("订单编号1：" + orderId);
                coocaaosapi.purchaseOrder2(data.data.appcode, data.data.orderId, data.data.orderTitle, data.data.back_url, data.data.total_pay_fee, "虚拟", "com.webviewsdk.action.pay", "pay", access_token, mobile,
                    function(success){console.log("----------startpaysuccess------------" + success);},
                    function(error){console.log(error);});
            } else {
                console.log("-----------异常---------" + data.msg);
            }
        },
        error: function() {
            console.log("-----------访问失败---------");
        }
    });
}

function showAwardlist(box,inner,name) {
    var boxHeight = $(box).height();
    var listHeight = $(inner).height();
    var screenNum = Math.ceil(listHeight/boxHeight);
    var a=1;
    if(screenNum>1){
       name =  setInterval(marquee,3000);
    }
    function marquee() {
        $(inner).css("transform", "translate3D(0, -" + a * boxHeight + "px, 0)");
        a++;
        if(a==screenNum){a=0}
    }
}

function startOperate(obj) {
    var startType = $(obj).attr("missionType");
    switch (startType)
    {
        case "movieDetail"://影视详情页
            var pageid = $(obj).attr("pageid");
            coocaaosapi.startMovieDetail(pageid,function(){},function(){});
            break;
        case "goodsImgDetail"://商品图文详情页
            var pageid = $(obj).attr("pageid");
            coocaaosapi.startAppShopDetail(pageid,function(){},function(){});
            break;
        case "apkDetail"://应用
            var pageid = $(obj).attr("pageid");
            var pkgname = JSON.parse($(obj).attr("missionparam")).packagename;
            var bywhat = JSON.parse($(obj).attr("missionparam")).bywhat;
            var byvalue = JSON.parse($(obj).attr("missionparam")).byvalue;
            var a = '{ "pkgList": ["'+pkgname+'"] }';
            var param1="",param2="",param3="",param4="",param5="";
            var str = "[]";
            coocaaosapi.getAppInfo(a, function(message) {
                console.log("getAppInfo====" + message);
                if(JSON.parse(message)[pkgname].status == -1){
                    coocaaosapi.startAppStoreDetail(pageid,function(){},function(){});
                }else{
                    if(bywhat == "activity"||bywhat == "class"){
                        param1 = pkgname;
                        param2 = byvalue;
                    }else if(bywhat == "uri"){
                        param1 = pkgname;
                        param5 = byvalue
                    }else if(bywhat == "pkg"){
                        param1 = pkgname;
                    }
                    if(JSON.stringify(JSON.parse($(obj).attr("missionparam")).params) != "{}"){
                        str = '['+JSON.stringify(JSON.parse($(obj).attr("missionparam")).params).replace(/,/g,"},{")+']'
                    }
                    coocaaosapi.startCommonNormalAction(param1,param2,param3,param4,param5,str,function(){},function(){});
                }
            }, function(error) {
                console.log("getAppInfo----error" + JSON.stringify(error));
                coocaaosapi.startAppStoreDetail(pageid,function(){},function(){});
            });
            break;
        case "movieTurnTopic"://轮播专题
            var pageid = $(obj).attr("pageid");
            if(cAppVersion < 3300000){
                $("#needUpdate").show();
                map = new coocaakeymap($("#needUpdate"), $("#needUpdate"), "btnFocus", function() {}, function(val) {}, function(obj) {});
                setTimeout(hideToast,3000);
            }else{
                coocaaosapi.startVideospecial(pageid,function(){},function(){});
            }

            break;
        case "eduTurnTopic": //教育轮播
            var pageid = $(obj).attr("pageid");
            console.log("=========================="+pageid);
            if(cAppVersion < 3300000){
                $("#needUpdate").show();
                map = new coocaakeymap($("#needUpdate"), $("#needUpdate"), "btnFocus", function() {}, function(val) {}, function(obj) {});
                setTimeout(hideToast,3000);
            }else{
                coocaaosapi.startVideospecial2(pageid,function(){},function(){});
            }
            break;
        case "layout"://版面
            var pageid = $(obj).attr("pageid");
            coocaaosapi.startHomeCommonList(pageid,function(msg){exit()},function(error){});
            break;
        case "mallHome"://购物主页
            var pageid = $(obj).attr("pageid");
            coocaaosapi.startAppShop(function(msg){},function(error){});
            break;
        case "movieEquity"://产品包页面
            var pageid = $(obj).attr("pageid");
            coocaaosapi.startMovieMemberCenter("0",pageid,function(){},function(){});
            break;
        case "eduEquity"://产品包页面
            var pageid = $(obj).attr("pageid");
            coocaaosapi.startMovieMemberCenter("1",pageid,function(){},function(){});
            break;
        case "movieTopic"://影视专题
            var pageid = $(obj).attr("pageid");
            coocaaosapi.startMovieSomePage(pageid,function(){},function(){});
            break;
    }
}

function hideToast() {
    $("#needUpdate").hide();
    map = new coocaakeymap($(".coocaabtn"), $(".module:eq("+remembernum+")"), "btnFocus", function() {}, function(val) {}, function(obj) {});
}

function initGameStatus(resume) {
    if(actionStatus == "end"){
        $("#waitgame").show();
        $("#gameing").hide();
        $("#movebanner").hide();
        $("#opacityBg2").show();
        $("#opacityBg1").hide();
        $("#waitInfo").hide();
        $("#endbtn").show();
        $("#waitgame .gametime").hide();
        $("#waitgame").css("background","url('http://sky.fs.skysrt.com/statics/webvip/webapp/double11/mainpage/endbanner.jpg')");
        $("#freeList").css('background','url("http://sky.fs.skysrt.com/statics/webvip/webapp/double11/mainpage/freebanner2.png")');
        $("#mission1").html("活动已结束")
    }else if(actionStatus == "start"){
        if(timePart.ifStart){
            gameStatus = "start";
            if(sentMainpageLog){
                sentMainpageLog = false;
                sentLog("shopping_mall_page_show",'{"page_name":"活动主页面","activity_name":"双十一活动--购物街","page_type":"游戏进行中"}');
            }
            $("#waitgame").hide();
            $("#gameing").show();
            $("#movebanner").show();
            $("#opacityBg1").show();
            $("#opacityBg2").hide();
            beginTime = new Date(timePart.beginTime).getHours();
            endTime = new Date(timePart.endTime).getHours();
            $("#gameing .gametime").html("本场游戏时间："+beginTime+":00--"+endTime+":00");
            $("#startbtn span").html(gameResult.chance);
            if(double11 == false){
                if(zy_todayMaxScore != 0){
                    document.getElementById("todayrecord").style.display = "block";
                    $(".todayscore").html(gameResult.todayMaxScore);
                }else{
                    document.getElementById("todayrecord").style.display = "none";
                    $(".todayscore").html("");
                }
            }

            if(loginstatus == "true" && gameResult.todayMaxScore > 0){
                $(".todaylistnum").show();
                if(gameResult.userRanking <= 100){
                    $(".todaylistnum").html("排名："+gameResult.userRanking);
                }else{
                    $(".todaylistnum").html("排名：100+");
                }
            }

            $.ajax({
                type: "get",
                async: true,
                url: adressIp + "/light/eleven/news",
                data: {cNickName:nick_name,activeId:actionId},
                dataType: "json",
                success: function(data) {
                    console.log("------------todayAward----result-------------"+JSON.stringify(data));
                    if (data.code == 50100) {
                        $("#todayawardul").html("");
                        var listlength = data.data.awardNews.length;
                        var box = document.getElementById("todayawardul");
                        var maxwidth=4;
                        var maxwidth1=6;
                        for(var i=0;i<listlength;i++){
                            if(data.data.awardNews[i].cNickName == null || data.data.awardNews[i].cNickName == ""){
                                cNickName = "匿名用户";
                            }else{
                                cNickName = data.data.awardNews[i].cNickName;

                                 if(cNickName.length>maxwidth){
                                    cNickName = cNickName.substring(0,maxwidth);
                                    cNickName = cNickName + '...';
                                }
                            }
                            awardName = data.data.awardNews[i].awardName;
                            if(awardName.length>maxwidth1){
                                awardName = awardName.substring(0,maxwidth1);
                                awardName = awardName + '...';
                            }
                            var list = document.createElement("li");
                            list.innerHTML=cNickName+"&nbsp;&nbsp;获得&nbsp;&nbsp;"+awardName;
                            box.appendChild(list);
                        }
                        showAwardlist("#todaymarquee","#todayawardul",setInterv1);
                    }
                    else{}
                },
                error: function(error) {
                    console.log("--------访问失败" + JSON.stringify(error));
                }
            });


        }else{
            if(timePart.nextTimePart == null){
                $("#waitgame").show();
                $("#gameing").hide();
                $("#movebanner").hide();
                $("#opacityBg2").show();
                $("#opacityBg1").hide();
                $("#waitInfo").hide();
                $("#endbtn").show();
                $("#waitgame .gametime").hide();
                $("#waitgame").css("background","url('http://sky.fs.skysrt.com/statics/webvip/webapp/double11/mainpage/endbanner.jpg')");
                $("#freeList").css('background','url("http://sky.fs.skysrt.com/statics/webvip/webapp/double11/mainpage/freebanner2.png")');
                $("#mission1").html("活动已结束")
            }else{
                gameStatus = "wait";
                if(sentMainpageLog){
                    sentMainpageLog = false;
                    sentLog("shopping_mall_page_show",'{"page_name":"活动主页面","activity_name":"双十一活动--购物街","page_type":"游戏未开始"}');
                }
                $("#waitgame").show();
                $("#gameing").hide();
                $("#movebanner").hide();
                $("#opacityBg2").show();
                $("#opacityBg1").hide();
                $("#waitOvertimes span").html(gameResult.chance);
                $("#waitBest span").html(gameResult.todayMaxScore);
                if(loginstatus == "true" && gameResult.todayMaxScore > 0 ){
                    $("#waitTop").show();
                    if(gameResult.userRanking < 100){
                        $("#waitTop span").html(gameResult.userRanking)
                    }else{
                        $("#waitTop span").html("100+")
                    }
                }else{
                    $("#waitTop").hide();
                }
                beginTime = new Date(timePart.nextTimePart.beginTime).getHours();
                endTime = new Date(timePart.nextTimePart.endTime).getHours();
                if(timePart.nextTimePart.ifNextDay){
                    $("#waitgame .gametime").html("下一场游戏时间：明天"+beginTime+":00--"+endTime+":00");
                }else{
                    $("#waitgame .gametime").html("下一场游戏时间："+beginTime+":00--"+endTime+":00");
                }
            }

        }
    }else{

    }
//获取运营位
    console.log("========================"+adressIp + "/light/task/"+actionId+"/banner")
    $.ajax({
        type: "get",
        async: true,
        url: adressIp + "/light/task/"+actionId+"/banner",
        data: {source:movieSource},
        dataType: "json",
        success: function(data) {
            console.log("------------getBanner----result-------------"+JSON.stringify(data));
            if (data.code == 50100) {
                $(".listbox").html("");
                apkBanner = data.data.apkBanner;
                eduBanner = data.data.eduBanner;
                tvMallBanner = data.data.tvMallBanner;
                movieBanner = data.data.movieBanner;
                var pagefrom = getUrlParam("from");
                switch (pagefrom){
                    case "edu":
                        arrBanner.push(eduBanner);
                        arrBanner.push(movieBanner);
                        arrBanner.push(tvMallBanner);
                        arrBanner.push(apkBanner);
                        bannerNanme.push("eduBanner");
                        bannerNanme.push("movieBanner");
                        bannerNanme.push("tvMallBanner");
                        bannerNanme.push("apkBanner");
                        $("#list1").attr("bannerType","edu");
                        $("#list2").attr("bannerType","movie");
                        $("#list3").attr("bannerType","mall");
                        $("#list4").attr("bannerType","apk");
                        break;
                    case "mall":
                        arrBanner.push(tvMallBanner);
                        arrBanner.push(movieBanner);
                        arrBanner.push(eduBanner);
                        arrBanner.push(apkBanner);
                        bannerNanme.push("tvMallBanner");
                        bannerNanme.push("movieBanner");
                        bannerNanme.push("eduBanner");
                        bannerNanme.push("apkBanner");
                        $("#list1").attr("bannerType","mall");
                        $("#list2").attr("bannerType","movie");
                        $("#list3").attr("bannerType","edu");
                        $("#list4").attr("bannerType","apk");
                        break;
                    case "apk":
                        arrBanner.push(apkBanner);
                        arrBanner.push(movieBanner);
                        arrBanner.push(eduBanner);
                        arrBanner.push(tvMallBanner);
                        bannerNanme.push("apkBanner");
                        bannerNanme.push("movieBanner");
                        bannerNanme.push("eduBanner");
                        bannerNanme.push("tvMallBanner");
                        $("#list1").attr("bannerType","apk");
                        $("#list2").attr("bannerType","movie");
                        $("#list3").attr("bannerType","edu");
                        $("#list4").attr("bannerType","mall");
                        break;
                    default :
                        arrBanner.push(movieBanner);
                        arrBanner.push(eduBanner);
                        arrBanner.push(tvMallBanner);
                        arrBanner.push(apkBanner);
                        bannerNanme.push("movieBanner");
                        bannerNanme.push("eduBanner");
                        bannerNanme.push("tvMallBanner");
                        bannerNanme.push("apkBanner");
                        $("#list1").attr("bannerType","movie");
                        $("#list2").attr("bannerType","edu");
                        $("#list3").attr("bannerType","mall");
                        $("#list4").attr("bannerType","apk");
                        break;
                }
                for(var i=0;i<4;i++){
                    var bannerBox = document.getElementById("list"+(i+1));
                    for (var j=1;j<=3;j++){
                        var bannerNum=bannerNanme[i]+""+j;
                        var bannerDiv = document.createElement("div");
                        var bannerImg = document.createElement("img");
                        var bannerCouponDiv = document.createElement("div");
                        bannerImg.setAttribute("src",arrBanner[i][bannerNum].imgUrl);
                        bannerCouponDiv.setAttribute("class","coupon");
                        bannerCouponDiv.innerHTML="&nbsp";
                        bannerDiv.setAttribute('class', 'coocaabtn module module'+j);
                        bannerDiv.setAttribute('missionType', arrBanner[i][bannerNum].taskType);
                        bannerDiv.setAttribute('missionName', arrBanner[i][bannerNum].name);
                        bannerDiv.setAttribute('pageid', arrBanner[i][bannerNum].id);
                        bannerDiv.setAttribute('missionUrl', arrBanner[i][bannerNum].url);
                        bannerDiv.setAttribute('missionbusinessType', arrBanner[i][bannerNum].businessType);
                        bannerDiv.setAttribute('missionparam', arrBanner[i][bannerNum].param);
                        // bannerDiv.setAttribute('pkgname', arrBanner[i][bannerNum].param == null?"":JSON.parse(arrBanner[i][bannerNum].param).packagename);
                        bannerDiv.appendChild(bannerImg);
                        bannerDiv.appendChild(bannerCouponDiv);
                        bannerBox.appendChild(bannerDiv);
                    }
                }
            } else{

            }
            if(getUrlParam("from")!=null&&getUrlParam("from")!=undefined&&!resume){
                initMap("#list1 .module:eq(0)");
                $("#mainbox").css("transform", "translate3D(0, -270px, 0)");
            }else if(gameStatus == "start"){
                initMap("#gameing");
            }else {
                if(actionStatus == "end"){
                    initMap(null);
                }else{
                    //判断任务一是否完成
                    if(isTaskOver == taskList.length){
                        initMap("#mission2");
                    }else{
                        initMap("#mission1");
                    }
                }
            }
        },
        error: function(error) {
            console.log("--------运营位访问失败" + JSON.stringify(error));
        }
    });
    //获取优惠券展示{"code":"50100","msg":"成功","data":{"tvmallCoupon":["购物10元优惠券"],"eduCoupon":["教育40元优惠券"],"movieCoupon":["影视30元优惠券"]}}
    $.ajax({
        type: "get",
        async: true,
        url: adressIp + "/light/eleven/"+actionId+"/u-coupon",
        data: {cNickName:nick_name,activeId:actionId, MAC:macAddress,cChip:TVchip,cModel:TVmodel,cEmmcCID:emmcId,cUDID:activityId},
        dataType: "json",
        success: function(data) {
            console.log("------------showCoupon----result-------------"+JSON.stringify(data));
            if (data.code == 50100) {
               var showEdu = data.data.eduCoupon[0];
               var showMall = data.data.tvmallCoupon[0];
               var showMovie = data.data.movieCoupon[0];
               showcoupon(showEdu,"edu");
               showcoupon(showMall,"mall");
               showcoupon(showMovie,"movie");
               function showcoupon(name,type) {
                   if(name!=""&&name!=null){
                       $("[bannerType="+type+"] .module1 .coupon").html("<span class='konw'>已获<span class='couponname'>"+name+"</span>优惠券,可马上使用</span>").addClass('zy_coupon');
                   }
               }
            }
            else{}
        },
        error: function(error) {
            console.log("--------访问失败" + JSON.stringify(error));
        }
    });
}

//页面初始化或刷新
function showPage(first,resume) {
    console.log("$$$$$$$$$$$$$$$$$$===="+first+"==========="+resume);
    click_login = false;
    clearInterval(setInterv2);
    clearInterval(setInterv1);
    document.getElementById("rankbox").style.display = "none";
    if(first){
        freeexit = getUrlParam("exit");
        if(getUrlParam("goto")=="shop"){
            needgotoshop = true;
        }else if(getUrlParam("goto")=="game"){
            $("#mainbox").show();
            sentMainpageLog = true;
            needgotogame = true;
        }else{
            sentMainpageLog = true;
            $("#mainbox").show();
        }
    }else{
        $("#mainbox").show();
    }
    console.log("---"+macAddress+"------"+TVchip+"-----"+TVmodel+"------"+emmcId+"--------"+activityId + "---------"+access_token+"-------"+cOpenId);
    $.ajax({
        type: "post",
        async: true,
        url: adressIp + "/light/eleven/init",
        data: {cNickName:nick_name,activeId:actionId, MAC:macAddress,cChip:TVchip,cModel:TVmodel,cEmmcCID:emmcId,cUDID:activityId,accessToken:access_token,cOpenId:cOpenId,source:movieSource},
        dataType: "json",
        success: function(data) {
            console.log("------------init----result-------------"+JSON.stringify(data));
            if (data.code == 50100) {
                actionStatus = "start";
                gameResult = data.data.gameResult;
                gameChance = gameResult.chance;
                timePart = data.data.timePart;
                countDay = data.data.countDay;
                todayMaxScore = gameResult.gameResult;
                taskList = data.data.taskList;
                isTaskOver = data.data.isTaskOver;
                userKeyIdinit = gameResult.userKeyId;
                userRanking = gameResult.userRanking;//===================zy
                rankingArea = gameResult.rankingArea;//===================zy
                zy_todayMaxScore = gameResult.todayMaxScore;//===================zy
                rankifStart = timePart.ifStart;//===================zy
                pastTimePart = timePart.pastTimePart;//===================zy
                double11 = data.data.double11;//===================zy
                if(double11 == false){
                    zy_beginTime = new Date(timePart.nextTimePart.beginTime).getHours();//===================zy
                    zy_endTime = new Date(timePart.nextTimePart.endTime).getHours();//===================zy
                }
                if(gameResult.packageNumberNew>0){
                    $("#msgToast").html("&nbsp&nbsp&nbsp通过任务二获得"+gameResult.packageNumberNew+"次机会&nbsp&nbsp&nbsp");
                    $("#msgToastBox").show();
                    setTimeout("document.getElementById('msgToastBox').style.display = 'none'", 3000);
                }else{}
                // console.log("*****************"+typeof (taskList[isTaskOver==taskList.length?isTaskOver-1:isTaskOver])+"___________"+JSON.stringify( (taskList[isTaskOver==taskList.lengrh?isTaskOver-1:isTaskOver])));
                $("#mission1").attr("pageid", taskList[isTaskOver==taskList.length?isTaskOver-1:isTaskOver].id);
                $("#mission1").attr("taskType", taskList[isTaskOver==taskList.length?isTaskOver-1:isTaskOver].taskType);
                $("#mission1").attr("taskname", taskList[isTaskOver==taskList.length?isTaskOver-1:isTaskOver].name);
                if(isTaskOver == taskList.length){
                    $("#mission1").html(taskList[isTaskOver==taskList.length?isTaskOver-1:isTaskOver].name+"<img id='finishimg' src='http://sky.fs.skysrt.com/statics/webvip/webapp/double11/mainpage/finish.png'>");
                }else{
                    $("#mission1").html(taskList[isTaskOver==taskList.length?isTaskOver-1:isTaskOver].name);
                }
                if(countDay < 5 ){
                    $("#freeList").css('background','url("http://sky.fs.skysrt.com/statics/webvip/webapp/double11/mainpage/freebanner1.png")')
                }else if(countDay<9){
                    $("#freeList").css('background','url("http://sky.fs.skysrt.com/statics/webvip/webapp/double11/mainpage/freebanner3.png")')
                }else{
                    $("#freeList").css('background','url("http://sky.fs.skysrt.com/statics/webvip/webapp/double11/mainpage/freebanner2.png")')
                    $("#gameing").css('background','url("http://sky.fs.skysrt.com/statics/webvip/webapp/double11/mainpage/gameingbanner.jpg")')
                    $("#waitgame").css('background','url("http://sky.fs.skysrt.com/statics/webvip/webapp/double11/mainpage/waitbanner.jpg")')
                    $("#opacityBg2").css('background','url("http://sky.fs.skysrt.com/statics/webvip/webapp/double11/mainpage/opacityw.png")')
                    $("#opacityBg1").css('background','url("http://sky.fs.skysrt.com/statics/webvip/webapp/double11/mainpage/opacitying.png")')
                }
            } else if(data.code == 50002){
                actionStatus = "wait";
            }else{
                actionStatus = "end";
            }
            $.ajax({
                type: "get",
                async: true,
                url: adressIp + "/light/eleven/get-ranking",
                data: {cNickName:nick_name,activeId:actionId},
                dataType: "json",
                success: function(data) {
                    console.log("------------rank----result-------------"+JSON.stringify(data));
                    if (data.code == 50100) {
                        $("#awardul").html("");
                        if(countDay == 1 && timePart.pastTimePart == null){
                            $("#awardlist").css('background',' url("http://sky.fs.skysrt.com/statics/webvip/webapp/double11/mainpage/nostartlist.png")');
                        }else if(actionStatus == "end"){
                            $("#awardlist").css('background',' url("http://sky.fs.skysrt.com/statics/webvip/webapp/double11/mainpage/nostartlist.png")');
                        }
                        else{
                            $("#awardlist").css('background',' url("http://sky.fs.skysrt.com/statics/webvip/webapp/double11/mainpage/mission3.png")');
                            if(data.data.rankingList.length == 0){
                                console.log("----------------显示免单榜");
                                $("#listDiv .title").html('<img src="http://sky.fs.skysrt.com/statics/webvip/webapp/double11/mainpage/miandanbang.png">');
                                var listlength = data.data.freeList.length;
                                var box = document.getElementById("awardul");
                                for(var i=0;i<listlength;i++){
                                    if(data.data.freeList[i].cNickName == null || data.data.freeList[i].cNickName == ""){
                                       var free_cNickName = "匿名用户";
                                    }else{
                                       var free_cNickName = data.data.freeList[i].cNickName;
                                    }
                                    var list = document.createElement("li");
                                    list.innerHTML='<span class="li_s1">'+(i+1)+'</span><span class="li_s2">'+free_cNickName+'</span><span class="li_s3">'+data.data.freeList[i].score+'个</span>';
                                    box.appendChild(list);
                                }
                                showAwardlist("#awardlist","#awardul",setInterv2);
                            }else{
                                if(countDay >= 9){
                                    if(actionStatus == "end"){
                                        $("#listDiv .title").html('<img src="http://sky.fs.skysrt.com/statics/webvip/webapp/double11/window/todayfreeend123.png">');
                                    }else{
                                        $("#listDiv .title").html('<img src="http://sky.fs.skysrt.com/statics/webvip/webapp/double11/window/todayfreeend123.png">');
                                    }

                                    $.ajax({
                                        type: "get",
                                        async: true,
                                        url: adressIp + "/light/eleven/free",
                                        data: {cNickName:nick_name,activeId:actionId, MAC:macAddress,cChip:TVchip,cModel:TVmodel,cEmmcCID:emmcId,cUDID:activityId},
                                        dataType: "json",
                                        success: function(data) {
                                            console.log("------------showFreeDayList----result-------------"+JSON.stringify(data));
                                            if (data.code == 50100) {
                                                var listLength = data.data.length;
                                                var box = document.getElementById("awardul");
                                                for(var i=0;i<listLength;i++){
                                                    if(data.data[i].cNickName == null || data.data[i].cNickName == ""){
                                                        var free_cNickName = "匿名用户";
                                                    }else{
                                                        var free_cNickName = data.data[i].cNickName;
                                                    }
                                                    var list = document.createElement("li");
                                                    list.innerHTML='<span class="li_s1">'+(i+1)+'</span><span class="li_s2">'+free_cNickName+'</span><span class="li_s3">免单</span>';
                                                    box.appendChild(list);
                                                }
                                                showAwardlist("#awardlist","#awardul",setInterv2);
                                            }
                                            else{}
                                        },
                                        error: function(error) {
                                            console.log("--------访问失败" + JSON.stringify(error));
                                        }
                                    });
                                }else{
                                    console.log("----------------显示排行榜");
                                    $("#listDiv .title").html('<img src="http://sky.fs.skysrt.com/statics/webvip/webapp/double11/mainpage/newtop10.png">');
                                    var listlength = data.data.rankingList.length;
                                    var box = document.getElementById("awardul");
                                    for(var i=0;i<listlength;i++){
                                        if(data.data.rankingList[i].cNickName == null || data.data.rankingList[i].cNickName == ""){
                                            var rank_cNickName = "匿名用户";
                                        }else{
                                            var rank_cNickName = data.data.rankingList[i].cNickName;
                                        }
                                        var list = document.createElement("li");
                                        list.innerHTML='<span class="li_s1">'+(i+1)+'</span><span class="li_s2">'+rank_cNickName+'</span><span class="li_s3">'+data.data.rankingList[i].score+'个</span>';
                                        box.appendChild(list);
                                    }
                                }
                                showAwardlist("#awardlist","#awardul",setInterv2);
                            }
                            // showAwardlist("#awardlist","#awardul",setInterv2);
                        }
                    } else{}
                    initGameStatus(resume);
                },
                error: function(error) {
                    console.log("--------访问失败" + JSON.stringify(error));
                }
            });
        },
        error: function(error) {
            console.log("--------访问失败" + JSON.stringify(error));
        }
    });
}



//排行榜
function rankingList(){
    console.log("游戏是否开始："+rankifStart);
    document.getElementById("rankbox").style.display = "block";
    document.getElementById("mainbox").style.display = "none";
    if(countDay == 1 && pastTimePart == null && rankifStart == false){//第一天第一场游戏还未开始
        sentLog("top_list_page_show",'{"page_name":"排行榜页面","activity_name":"双十一活动--购物街","page_type":"游戏未开始"}');
        document.getElementById("notBegin").style.display = "block";
        document.getElementById("begin").style.display = "none";
        document.getElementById("double11").style.display = "none";
        $(".text2 span").html(zy_beginTime+":00--"+zy_endTime+":00");
        map = new coocaakeymap($(".coocaabtn"), $("#task_btn"), "btnFocus", function() {}, function(val) {}, function(obj) {});
    }else{
        if(rankifStart == false){
            sentLog("top_list_page_show",'{"page_name":"排行榜页面","activity_name":"双十一活动--购物街","page_type":"游戏未开始"}');
        }else{
            sentLog("top_list_page_show",'{"page_name":"排行榜页面","activity_name":"双十一活动--购物街","page_type":"游戏进行中"}');
        }
        if(double11 == true){
            document.getElementById("begin").style.display = "none";
            document.getElementById("notBegin").style.display = "none";
            document.getElementById("double11").style.display = "block";
            $.ajax({
                type: "GET",
                async: true,
                url: adressIp+"/light/eleven/get-ranking",
                data: {
                    cNickName:nick_name,
                    "activeId":actionId,
                },
                dataType: "json",
                success: function(data) {
                    console.log("双十一昨日排行榜"+JSON.stringify(data));
                    if(data.code == 50100){
                        var str = JSON.stringify(data.data.theDayBefore);
                        month = str.substring(6, 8);
                        day = str.substring(9, 11);
                        $("#11_exemption .title").html(month+"月"+day+"日免单榜");
                        document.getElementById("11_exemption_rank").innerHTML = "";
                        if(data.data.freeList.length >= 10){
                            num1 = 10;
                        }else{
                            num1 = data.data.freeList.length;
                        }
                        if(data.data.freeList.length != 0){//免单榜
                            document.getElementById("11_exemption_rank").style.display = "block";
                            document.getElementById("11_exemptionNull").style.display = "none";
                            for (var i = 0; i < num1; i++) {
                                n = i+1;
                                var list = ' <li><span class="order o_'+i+'">'+n+'</span><span class="name">'+data.data.freeList[i].cNickName+'</span><span class="coin">红包：'+data.data.freeList[i].score+'个</span><span>'+data.data.freeList[i].aGameTimeKey+'</span></li>';
                                $("#11_exemption_rank").append(list);
                            }
                            $(".o_0").addClass('icon first')
                            $(".o_1").addClass('icon two')
                            $(".o_2").addClass('icon three')
                        }else{
                            document.getElementById("11_exemptionNull").style.display = "block";
                        }

                    }
                },
                error: function() {
                    console.log("error");
                }
            });
            $.ajax({
                type: "GET",
                async: true,
                url: adressIp+"/light/eleven/free",
                data: {
                    cNickName:nick_name,
                    activeId:actionId,
                },
                dataType: "json",
                success: function(data) {
                    console.log("双十一今日免单榜"+JSON.stringify(data));
                    if(data.code == 50100){
                        document.getElementById("11_rank").innerHTML = "";
                        if(data.data.length != 0){//免单榜
                            document.getElementById("11_rank").style.display = "block";
                            document.getElementById("11_rankNull").style.display = "none";
                            if(data.data.length >= 10){
                                num = 10;
                            }else{
                                num = data.data.length;
                            }
                            for (var i = 0; i < num; i++) {
                                n = i+1;
                                if(data.data[i].cNickName == null || data.data[i].cNickName == ""){
                                    cNickName = "匿名用户";
                                }else{
                                    cNickName = data.data[i].cNickName;
                                }
                                var list = ' <li><span class="order o_'+i+'">'+n+'</span><span class="name" style="width:380px">'+cNickName+'</span><span>'+data.data[i].timeKey+'</span></li>';
                                $("#11_rank").append(list);
                            }
                            $(".o_0").addClass('icon first')
                            $(".o_1").addClass('icon two')
                            $(".o_2").addClass('icon three')
                        }else{
                            document.getElementById("11_rankNull").style.display = "block";
                        }

                    }
                },
                error: function() {
                    console.log("error");
                }
            });
            if(gameStatus == "wait"){
                $(".foot3").html("◎ 免单红包雨未开始，先去做任务累积游戏机会吧！ ◎");
                document.getElementById("11_rank_Get").style.display = "inline-block";
                map = new coocaakeymap($(".coocaabtn"), $("#11_rank_btn"), "btnFocus", function() {}, function(val) {}, function(obj) {});
            }else{
                $(".foot3").html("◎ 免单红包雨正在进行中，福利限时12小时，快去赢你的免单机会吧！ ◎");
                document.getElementById("free_Get").style.display = "inline-block";
                map = new coocaakeymap($(".coocaabtn"), $("#free_btn"), "btnFocus", function() {}, function(val) {}, function(obj) {});
            }
        }else{
            document.getElementById("begin").style.display = "block";
            document.getElementById("notBegin").style.display = "none";
            document.getElementById("double11").style.display = "none";
            $.ajax({
                type: "GET",
                async: true,
                url: adressIp+"/light/eleven/get-ranking",
                data: {
                    cNickName:nick_name,
                    "activeId":actionId,
                },
                dataType: "json",
                success: function(data) {
                    console.log("第几天"+countDay+"；登录状态"+loginstatus+"；游戏状态"+gameStatus+"；排行榜"+JSON.stringify(data));
                    if(data.code == 50100){
                        var str = JSON.stringify(data.data.theDayBefore);
                        month = str.substring(6, 8);
                        day = str.substring(9, 11);
                        if(countDay == 1){
                            $("#exemption .title").html("11月3日免单榜");
                        }else{
                            $("#exemption .title").html(month+"月"+day+"日免单榜");
                        }
                        document.getElementById("rank").innerHTML = "";
                        document.getElementById("exemption_rank").innerHTML = "";
                        if(data.data.rankingList.length >= 10){
                            num2 = 10;
                        }else{
                            num2 = data.data.rankingList.length;
                        }
                        if(data.data.freeList.length >= 10){
                            num3 = 10;
                        }else{
                            num3 = data.data.freeList.length;
                        }
                        if(data.data.rankingList.length != 0){//实时排行榜
                            document.getElementById("rank").style.display = "block";
                            document.getElementById("rankNull").style.display = "none";
                            for (var i = 0; i < num2; i++) {
                                n1 = i+1;
                                var list = ' <li><span class="order oa_'+i+'">'+n1+'</span><span class="name">'+data.data.rankingList[i].cNickName+'</span><span class="coin">红包：'+data.data.rankingList[i].score+'个</span><span>'+data.data.rankingList[i].aGameTimeKey+'</span></li>';
                                $("#rank").append(list);
                            }
                            $(".oa_0").addClass('icon first')
                            $(".oa_1").addClass('icon two')
                            $(".oa_2").addClass('icon three')
                        }else{
                            document.getElementById("rankNull").style.display = "block";
                        }

                        if(data.data.freeList.length != 0){//免单榜
                            document.getElementById("exemption_rank").style.display = "block";
                            document.getElementById("exemptionNull").style.display = "none";
                            for (var i = 0; i < num3; i++) {
                                n3 = i+1;
                                var list = ' <li><span class="order ob_'+i+'">'+n3+'</span><span class="name">'+data.data.freeList[i].cNickName+'</span><span class="coin">红包：'+data.data.freeList[i].score+'个</span><span>'+data.data.freeList[i].aGameTimeKey+'</span></li>';
                                $("#exemption_rank").append(list);
                            }
                            $(".ob_0").addClass('icon first')
                            $(".ob_1").addClass('icon two')
                            $(".ob_2").addClass('icon three')
                        }else{
                            document.getElementById("exemptionNull").style.display = "block";
                        }

                    }
                },
                error: function() {
                    console.log("error");
                }
            });
            if(gameStatus == "wait"){
                $(".foot2").html("◎ 游戏还未开始，可完成任务提前累积游戏机会哦！ ◎");
                if(loginstatus == "false"){
                    document.getElementById("login_Get").style.display = "inline-block";
                    sentLog("landing_page_show",'{"last_page_name":"排行榜页面","page_name":"双十一登录弹窗","activity_name":"双十一活动--购物街"}');
                }else{
                    document.getElementById("login_Get").style.display = "none";
                }
                document.getElementById("rank_Get").style.display = "inline-block";
                map = new coocaakeymap($(".coocaabtn"), $("#rank_btn"), "btnFocus", function() {}, function(val) {}, function(obj) {});
            }else{
                if(loginstatus == "false"){
                    $(".foot2").html("◎ 登录后成绩才能计入榜单哦~请马上登录~ ◎");
                    document.getElementById("login_Get").style.display = "inline-block";
                    sentLog("landing_page_show",'{"last_page_name":"排行榜页面","page_name":"双十一登录弹窗","activity_name":"双十一活动--购物街"}');
                }else{
                    document.getElementById("user_td_rank").style.display = "inline-block";
                    document.getElementById("user_td_red").style.display = "inline-block";
                    if(rankingArea == 2){//排名是否在100以内
                        $(".rank_todaylistnum").html(userRanking);
                    }else{
                        $(".rank_todaylistnum").html("100+");
                    }
                    $(".rank_todayscore").html(zy_todayMaxScore);

                    document.getElementById("login_Get").style.display = "none";
                    if(userRanking == 1){
                        $(".foot2").html("◎ 继续坚持，免单机会就是你的~ ◎");
                    }else if(1 < userRanking &&  userRanking <= 10){
                        $(".foot2").html("◎ 快被追上啦，马上玩游戏刷新纪录~ ◎");
                    }else{
                        $(".foot2").html("◎ 别灰心，再玩一次，免单机会就在前方！ ◎");
                    }
                }
                if(zy_todayMaxScore != 0){//最好成绩不为0，说明已玩过游戏
                    document.getElementById("again_Get").style.display = "inline-block";
                    map = new coocaakeymap($(".coocaabtn"), $("#again_btn"), "btnFocus", function() {}, function(val) {}, function(obj) {});
                }else{
                    document.getElementById("start_Get").style.display = "inline-block";
                    map = new coocaakeymap($(".coocaabtn"), $("#start_game"), "btnFocus", function() {}, function(val) {}, function(obj) {});
                }
            }

        }
    }
}