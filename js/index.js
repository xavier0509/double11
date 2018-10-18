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
        }else if($("#freePage").css("display")=="block"){
            $("#mainbox").show();
            $("#freePage").hide();
            map = new coocaakeymap($(".coocaabtn"), $("#freeList"), "btnFocus", function() {}, function(val) {}, function(obj) {});
        }else{
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
        if(gameVersion<30400033){
            appDown.listenApp();
            appDown.createDownloadTask("http://apk.sky.fs.skysrt.com/uploads/20180206/20180206103450797932.apk", "98B59D6C52B8BFEA17D250D5D9FF3F1D", "优选购物", "com.coocaa.mall", "26040", "http://img.sky.fs.skysrt.com//uploads/20170415/20170415110115834369.png");
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
                data: {MAC:macAddress,cChip:TVchip,cModel:TVmodel,cEmmcCID:emmcId,cUDID:activityId,cSize:message.panel,cChannel:"coocaa",aSdk:message.androidsdk,cTcVersion:message.version.replace(/\.*/g,""),cBrand:message.brand},
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
                    hasLogin(needQQ,true);

                    // listenUser();
                    // listenPay();
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
            } else if (message.status == "ON_REMOVED"&& message.url == "http://apk.sky.fs.skysrt.com/uploads/20180206/20180206103450797932.apk") {
                clearTimeout(waitApkInstallFunc);
                var a = '{ "pkgList": ["com.coocaa.mall"] }'
                coocaaosapi.getAppInfo(a, function(message) {
                    console.log("getAppInfo====" + message);
                    var b = "com.coocaa.mall";
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
        downToast = "模块加载失败，正在重试...";
        downGameFalse = true;
        clearTimeout(waitApkInstallFunc);
        appDown.removeApklisten();
    },

    //下载安装apk
    createDownloadTask: function(apkurl, md5, title, pkgname, appid, iconurl) {
        coocaaosapi.createDownloadTask(
            apkurl, md5, title, pkgname, appid, iconurl,
            function(message) {
               downToast = "模块加载中，请稍后...";
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
    });
}

//监听支付状态
function listenPay() {
    coocaaosapi.addPurchaseOrderListener(function(message) {
        console.log("xjr----------->startpurcharse message  支付结果 " + JSON.stringify(message));
        if (message.presultstatus == 0) {
            sentLog("nalm_buy_for_view_card_pay_result",'{"pay_result":"1"}');
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
            lightCityApi(_listenObj,_listenNum,_listenType,_listenParent);
        }
    })
}

function initMap(setFocus) {
    initBtn();
    showAwardlist();
    map = new coocaakeymap($(".coocaabtn"), $(setFocus), "btnFocus", function() {}, function(val) {}, function(obj) {});
    $(setFocus).trigger("itemFocus");
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

    $("#rule").unbind("itemClick").bind("itemClick",function () {
        $("#mainbox").hide();
        $("#rulePage").show();
        map = new coocaakeymap($("#rulePage"),null, "btnFocus", function() {}, function(val) {}, function(obj) {});
    })

    $("#freeList").unbind("itemClick").bind("itemClick",function () {
        $("#mainbox").hide();
        $("#freePage").show();
        map = new coocaakeymap($("#freePage"),null, "btnFocus", function() {}, function(val) {}, function(obj) {});
    })

    $("#gameing").unbind("itemClick").bind("itemClick",function () {
        console.log("++++++++++"+gameVersion);
        if(gameVersion < 30400033){
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
        title: "国庆套餐包",
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
        url: "https://api-business.skysrt.com/v3/order/genOrderByJsonp.html?data=" + data1, //需改
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

function showAwardlist() {
    var boxHeight = $("#awardlist").height();
    var listHeight = $("#awardul").height();
    var screenNum = Math.ceil(listHeight/boxHeight);
    var a=1;
    setInterval(marquee,3000);
    function marquee() {
        $("#awardul").css("transform", "translate3D(0, -" + a * boxHeight + "px, 0)");
        a++;
        if(a==screenNum){a=0}
    }
}

function startMission(obj) {
    if($(obj).attr("missionType") == "page"){
        if(cAppVersion < 3300001){
            coocaaosapi.startHomeCommonList($(obj).attr("missionId"),function(msg){exit()},function(error){});
        }else{
            coocaaosapi.startHomeTab(startActionReplace,$(obj).attr("missionId"),function(msg){exit()},function(error){})
        }
    }else  if($(obj).attr("missionType") == "video"){
        coocaaosapi.startCommonWebview("", $(obj).attr("missionUrl"), "观看精彩视频点亮城市卡", "", "", "", "视频广告", "", function(message) {
            console.log(message);
        }, function(error) {
            console.log("commonTask----error")
        });
    }
}

function startOperate(obj) {
    var startType = $(obj).attr("missionType");
    switch (startType)
    {
        case 1://影视详情页
            var pageid = $(obj).attr("pageid");
            coocaaosapi.startMovieDetail(pageid,function(){},function(){});
            break;
        case 2://商品图文详情页
            var pageid = $(obj).attr("pageid");
            coocaaosapi.startAppShopDetail(pageid,function(){},function(){});
            break;
        case 3://商品视频详情页
            var pageid = $(obj).attr("pageid");
            var pageurl = $(obj).attr("pageurl");
            var pagename = $(obj).attr("pagename");
            coocaaosapi.startAppShopVideo(pageid,pageurl,pagename,function(){},function(){});
            break;
        case 4://应用
            var pageid = $(obj).attr("pageid");
            var pkgname = $(obj).attr("pkgname");
            var a = '{ "pkgList": ["'+pkgname+'"] }';
            coocaaosapi.getAppInfo(a, function(message) {
                console.log("getAppInfo====" + message);
                if(JSON.parse(message)[pkgname].status == -1){
                    coocaaosapi.startAppStoreDetail(pageid,function(){},function(){});
                }else{
                    coocaaosapi.startByPackName(pkgname,function(){},function(){});
                }
            }, function(error) {
                console.log("getAppInfo----error" + JSON.stringify(error));
                coocaaosapi.startByPackName(pkgname,function(){},function(){});
            });
            break;
        case 5://普通专题
            var pageid = $(obj).attr("pageid");
            coocaaosapi.startMovieHomeSpecialTopic(pageid,function(){},function(){});
            break;
        case 6://轮播专题
            var pageid = $(obj).attr("pageid");
            coocaaosapi.startVideospecial(pageid,function(){},function(){});
            break;
        case 7://商品专题
            var pageid = $(obj).attr("pageid");
            coocaaosapi.startAppShopDetail(pageid,function(){},function(){});
            break;
        case 8://商品版面
            var pageid = $(obj).attr("pageid");
            coocaaosapi.startAppShopDetail(pageid,function(){},function(){});
            break;
        case 9://产品包页面
            var pageid = $(obj).attr("pageid");
            coocaaosapi.startAppShopDetail(pageid,function(){},function(){});
            break;
    }
}

function initGameStatus() {
    if(actionStatus == "end"){

    }else if(actionStatus == "start"){
        if(timePart.ifStart){
            gameStatus = "start";
            beginTime = new Date(timePart.beginTime).getHours();
            endTime = new Date(timePart.endTime).getHours();
            $("#gameing .gametime").html("本场游戏时间："+beginTime+":00--"+endTime+":00");
            $("#startbtn span").html(gameResult.chance);
            $(".todayscore").html(gameResult.todayMaxScore);
            if(loginstatus == "true"){
                $(".todaylistnum").show();
                if(gameResult.userRanking > 100){
                    $(".todaylistnum").html(gameResult.userRanking)
                }else{
                    $(".todaylistnum").html("100+")
                }
            }
        }else{
            gameStatus = "wait";
            $("#waitOvertimes span").html(gameResult.chance);
            $("#waitBest span").html(gameResult.todayMaxScore);
            if(loginstatus == "true"){
                $("#waitTop").show();
                if(gameResult.userRanking > 100){
                    $("#waitTop span").html(gameResult.userRanking)
                }else{
                    $("#waitTop span").html("100+")
                }
            }
            beginTime = new Date(timePart.nextTimePart.beginTime).getHours();
            endTime = new Date(timePart.nextTimePart.endTime).getHours();
            if(timePart.ifNextDay){
                $("#waitgame .gametime").html("下一场游戏时间：明天"+beginTime+":00--"+endTime+":00");
            }else{
                $("#waitgame .gametime").html("下一场游戏时间："+beginTime+":00--"+endTime+":00");
            }
        }
    }else{

    }

    $.ajax({
        type: "get",
        async: true,
        url: adressIp + "/light/task/"+actionId+"/banner",
        data: {id:actionId,source:movieSource},
        dataType: "json",
        success: function(data) {
            console.log("------------getBanner----result-------------"+JSON.stringify(data));
            if (data.code == 50100) {
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
                        break;
                    case "mall":
                        arrBanner.push(tvMallBanner);
                        arrBanner.push(movieBanner);
                        arrBanner.push(eduBanner);
                        arrBanner.push(apkBanner);
                        break;
                    case "apk":
                        arrBanner.push(apkBanner);
                        arrBanner.push(movieBanner);
                        arrBanner.push(eduBanner);
                        arrBanner.push(tvMallBanner);
                        break;
                    default :
                        arrBanner.push(movieBanner);
                        arrBanner.push(eduBanner);
                        arrBanner.push(tvMallBanner);
                        arrBanner.push(apkBanner);
                        break;
                }
                for(var i=0;i<4;i++){
                    var bannerBox = document.getElementById("list"+(i+1));
                    for (var j=1;j<=3;j++){
                        var bannerDiv = document.createElement("div");
                        var bannerImg = document.createElement("img");
                        var bannerCouponDiv = document.createElement("div");
                        bannerDiv.setAttribute('id', 'bgDiv' + i);
                        bannerDiv.setAttribute('class', 'bgDiv');
                        bannerDiv.appendChild(bannerImg);
                        bannerDiv.appendChild(bannerCouponDiv);
                        bannerBox.appendChild(bannerDiv);
                    }
                }
            } else{

            }
        },
        error: function(error) {
            console.log("--------运营位访问失败" + JSON.stringify(error));
        }
    });
}

//页面初始化或刷新
function showPage(first,resume) {
    console.log("$$$$$$$$$$$$$$$$$$===="+first+"==========="+resume)
    if(first){
        if(getUrlParam("goto")=="shop"){
            needgotoshop = true;
            exitWeb = true;
        }
    }
    console.log("---"+macAddress+"------"+TVchip+"-----"+TVmodel+"------"+emmcId+"--------"+activityId + "---------"+access_token+"-------"+cOpenId);
    $.ajax({
        type: "post",
        async: true,
        url: adressIp + "/light/eleven/init",
        data: {activeId:actionId, MAC:macAddress,cChip:TVchip,cModel:TVmodel,cEmmcCID:emmcId,cUDID:activityId,accessToken:access_token,cOpenId:cOpenId,source:movieSource},
        dataType: "json",
        success: function(data) {
            console.log("------------init----result-------------"+JSON.stringify(data));
            if (data.code == 50100) {
                actionStatus = "start";
                gameResult = data.data.gameResult;
                timePart = data.data.timePart;
                countDay = data.data.countDay;
            } else if(data.code == 50002){
                actionStatus = "wait";
            }else{
                actionStatus = "end";
            }
            initGameStatus();
        },
        error: function(error) {
            console.log("--------访问失败" + JSON.stringify(error));
        }
    });
}