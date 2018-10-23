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

        console.log("来自排行榜登录============" + click_login);//===================zy
        if(click_login == "true"){
            click_login = "false";
            hasLogin(needQQ,"ranking");
        }

        if(needSentUserLog){
            needSentUserLog = false;
            hasLogin(needQQ,false);
        }

        if(resumeAndFresh){
            resumeAndFresh = false;
            showPage(false,true);
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
            $("#mainbox").show();
            $("#freePage").hide();
            map = new coocaakeymap($(".coocaabtn"), $("#freeList"), "btnFocus", function() {}, function(val) {}, function(obj) {});
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
                            gameChance = data.data;
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
                $("#rankbox").hide();
                showPage(false,false);
            }else{
                $("#mainbox").show();
                $("#rankbox").hide();
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
                    hasLogin(needQQ,true);

                    listenUser();
                    listenPay();
                    listenCommon();
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
        if (message.presultstatus == 0) {//支付完成~~~~~~
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
        $("#mainbox").hide();
        $("#rulePage").show();
        map = new coocaakeymap($("#rulePage"),null, "btnFocus", function() {}, function(val) {}, function(obj) {});
    })

    $("#myaward").unbind("itemClick").bind("itemClick",function () {
        resumeAndFresh = true;
        coocaaosapi.startNewBrowser2(awardurl,function(){},function(){});
    })

    $("#freeList").unbind("itemClick").bind("itemClick",function () {
        $("#mainbox").hide();
        $("#freePage").show();
        $(".freshList").html("");
        $("#freeDiv").css("transform", "translate3D(0, -0px, 0)");
        if(countDay == 9){
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
            if($(this).attr("pageType") == "1"){
                coocaaosapi.startAppShopDetail($(this).attr("pageid"),function(){},function(){});
            }else{
                if(loginstatus == "true"){
                    order($(this).attr("product_id"),$(this).attr("price"));
                }else{
                    startLogin(needQQ);
                }
            }
        })
        map = new coocaakeymap($(".coocaabtn"),$(".product:eq(0)"), "btnFocus", function() {}, function(val) {}, function(obj) {});
    })


    $("#gameing,#waitgame").unbind("itemClick").bind("itemClick",function () {
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
                                coocaaosapi.startRedGame(function(){console.log("success")},function(err){console.log("--------------openGameError"+err)});
                            }else{
                                //todo show windown for mission or qrcode
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
                                    if(isTaskOver == taskList.length){
                                        $("#mission2").trigger("itemClick");
                                    }else{
                                        $("#mission1").trigger("itemClick");
                                    }
                                })
                                $("#helpFriend").unbind("itemClick").bind("itemClick",function () {
                                    $("#nochancebox").hide();
                                    $("#helpQrcode").show();
                                    $("#qrcodeBox").html("");
                                    var qrcode = new QRCode(document.getElementById("qrcodeBox"),{width:200,height:200});
                                    qrcode.makeCode("?activeId="+actionId+"&macAddress="+macAddress+"&emmcId="+emmcId+"&cUDID"+activityId+"&cOpenId"+cOpenId);
                                })

                            }
                        }else{
                            $("#msgToast").html("&nbsp&nbsp&nbsp当前不在游戏期内，先去做任务可以获得额外机会哦&nbsp&nbsp&nbsp");
                            $("#msgToastBox").show();
                            setTimeout("document.getElementById('msgToastBox').style.display = 'none'", 3000);
                        }
                    } else{
                        $("#msgToast").html("&nbsp&nbsp&nbsp当前不在游戏期内，先去做任务可以获得额外机会哦&nbsp&nbsp&nbsp");
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

    $("#again_btn,#start_game,#free_btn").unbind("itemClick").bind("itemClick",function () {
        needgotoRankList = true;
        console.log("++++++++++"+gameVersion);
        $("#gameing").trigger("itemClick");
    })

    $("#mission1").unbind("itemClick").bind("itemClick",function () {
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
                coocaaosapi.startMovieMemberCenter("1","",function(){},function(){});
                break;
                case "movieEquity"://产品包页面
                var pageid = $(obj).attr("pageid");
                coocaaosapi.startMovieMemberCenter("0",pageid,function(){},function(){});
                break;
            }
        }
        var _this = this;
        console.log("--------"+_this);
        if(isTaskOver == taskList.length){
            startMission1(_this);
        }else{
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
        var _this = this;
        if(movieSource == "tencent"){
            coocaaosapi.startHomeCommonList("102829",function(msg){exit()},function(error){});
        }else{
            coocaaosapi.startHomeCommonList("102830",function(msg){exit()},function(error){});
        }
    })
    $(".module").unbind("itemClick").bind("itemClick",function () {
        var _this = this;
        // console.log("------------startOperate-------- "+$(_this).attr("missionparam")+"========"+JSON.parse($(_this).attr("missionparam")).params);
        startOperate(_this);
    })

    //======================zy===================
    $("#login_btn").unbind("itemClick").bind("itemClick",function () {
        click_login = "true";
        startLogin(needQQ)
    })

    $("#rank_btn,#11_rank_btn").unbind("itemClick").bind("itemClick",function () {//做任务
        if(isTaskOver == taskList.length){
            $("#mission2").trigger("itemClick");
        }else{
            $("#mission1").trigger("itemClick");
        }
    })

    $("#awardlist").unbind("itemClick").bind("itemClick",function () {
        rankingList();
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
        // url: "https://api-business.skysrt.com/v3/order/genOrderByJsonp.html?data=" + data1, //需改
        url: "http://172.20.132.182:8090/v3/order/genOrderByJsonp.html?data=" + data1, //需改
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
        // case "goodsVideoDetail"://商品视频详情页
        //     var pageid = $(obj).attr("pageid");
        //     var pageurl = $(obj).attr("pageurl");
        //     var pagename = $(obj).attr("pagename");
        //     coocaaosapi.startAppShopVideo(pageid,pageurl,pagename,function(){},function(){});
        //     break;
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
        // case "movieTopic":case "eduTopic"://普通专题
        //     var pageid = $(obj).attr("pageid");
        //     coocaaosapi.startMovieHomeSpecialTopic(pageid,function(){},function(){});
        //     break;
        case "movieTurnTopic":case "eduTurnTopic"://轮播专题
            var pageid = $(obj).attr("pageid");
            coocaaosapi.startVideospecial(pageid,function(){},function(){});
            break;
        // case "tvmallTopic"://商品专题
        //     var pageid = $(obj).attr("pageid");
        //     coocaaosapi.startAppShopDetail(pageid,function(){},function(){});
        //     break;
        case "layout"://版面
            var pageid = $(obj).attr("pageid");
            coocaaosapi.startHomeCommonList(pageid,function(msg){exit()},function(error){});
            break;
        case "eduEquity":case "movieEquity"://产品包页面
            var pageid = $(obj).attr("pageid");
            coocaaosapi.startMovieMemberCenter("0",pageid,function(){},function(){});
            break;
    }
}

function initGameStatus(resume) {
    if(actionStatus == "end"){

    }else if(actionStatus == "start"){
        if(timePart.ifStart){
            gameStatus = "start";
            $("#waitgame").hide();
            $("#gameing").show();
            $("#opacityBg1").show();
            $("#opacityBg2").hide();
            beginTime = new Date(timePart.beginTime).getHours();
            endTime = new Date(timePart.endTime).getHours();
            $("#gameing .gametime").html("本场游戏时间："+beginTime+":00--"+endTime+":00");
            $("#startbtn span").html(gameResult.chance);
            $(".todayscore").html(gameResult.todayMaxScore);
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
                        for(var i=0;i<listlength;i++){
                            var list = document.createElement("li");
                            list.innerHTML=data.data.awardNews[i].cNickName+"&nbsp;&nbsp;获得&nbsp;&nbsp;"+data.data.awardNews[i].awardName;
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
            gameStatus = "wait";
            $("#waitgame").show();
            $("#gameing").hide();
            $("#opacityBg2").show();
            $("#opacityBg1").hide();
            $("#waitOvertimes span").html(gameResult.chance);
            $("#waitBest span").html(gameResult.todayMaxScore);
            if(loginstatus == "true" && gameResult.todayMaxScore > 0 ){
                $("#waitTop").show();
                if(gameResult.userRanking > 100){
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
    }else{

    }
//获取运营位
    $.ajax({
        type: "get",
        async: true,
        url: adressIp + "/light/task/"+actionId+"/banner",
        data: {cNickName:nick_name,id:actionId,source:movieSource},
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
                //判断任务一是否完成
                if(isTaskOver == taskList.length){
                    initMap("#mission2");
                }else{
                    initMap("#mission1");
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
                       $("[bannerType="+type+"] .module1 .coupon").html("还有"+name+"尚未使用！！！！")
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
    click_login = "false";
    clearInterval(setInterv2);
    clearInterval(setInterv1);
    if(first){
        if(getUrlParam("goto")=="shop"){
            needgotoshop = true;
        }else if(getUrlParam("goto")=="game"){
            $("#mainbox").show();
            needgotogame = true;
        }else{
            $("#mainbox").show();
        }
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
                userRanking = gameResult.userRanking;//===================zy
                rankingArea = gameResult.rankingArea;//===================zy
                todayMaxScore = gameResult.todayMaxScore;//===================zy
                rankifStart = timePart.ifStart//===================zy
                double11 = data.data.double11;//===================zy
                zy_beginTime = new Date(timePart.nextTimePart.beginTime).getHours();//===================zy
                zy_endTime = new Date(timePart.nextTimePart.endTime).getHours();//===================zy
                // console.log("*****************"+typeof (taskList[isTaskOver==taskList.length?isTaskOver-1:isTaskOver])+"___________"+JSON.stringify( (taskList[isTaskOver==taskList.lengrh?isTaskOver-1:isTaskOver])));
                $("#mission1").attr("pageid", taskList[isTaskOver==taskList.length?isTaskOver-1:isTaskOver].id);
                $("#mission1").attr("taskType", taskList[isTaskOver==taskList.length?isTaskOver-1:isTaskOver].taskType);
                $("#mission1").html(taskList[isTaskOver==taskList.length?isTaskOver-1:isTaskOver].name);
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
                            $("#awardul").html("<img src='http://beta.webapp.skysrt.com/games/webapp/double11/dev/css/t1.jpg'>");
                        }else{
                            if(data.data.rankingList.length == 0){
                                console.log("----------------显示免单榜");
                                $("#listDiv .title").html('<img src="http://sky.fs.skysrt.com/statics/webvip/webapp/double11/mainpage/miandanbang.png">');
                                var listlength = data.data.freeList.length;
                                var box = document.getElementById("awardul");
                                for(var i=0;i<listlength;i++){
                                    var list = document.createElement("li");
                                    list.innerHTML='<span class="li_s1">'+(i+1)+'</span><span class="li_s2">'+data.data.freeList[i].cNickName+'</span><span class="li_s3">'+data.data.freeList[i].score+'个</span>';
                                    box.appendChild(list);
                                }
                            }else{
                                console.log("----------------显示排行榜");
                                $("#listDiv .title").html('<img src="http://sky.fs.skysrt.com/statics/webvip/webapp/double11/mainpage/top10.png">');
                                var listlength = data.data.rankingList.length;
                                var box = document.getElementById("awardul");
                                for(var i=0;i<listlength;i++){
                                    var list = document.createElement("li");
                                    list.innerHTML='<span class="li_s1">'+(i+1)+'</span><span class="li_s2">'+data.data.rankingList[i].cNickName+'</span><span class="li_s3">'+data.data.rankingList[i].score+'个</span>';
                                    box.appendChild(list);
                                }
                            }
                            showAwardlist("#awardlist","#awardul",setInterv2);
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
    if(rankifStart == false){//游戏还未开始
        document.getElementById("notBegin").style.display = "block";
        document.getElementById("begin").style.display = "none";
        document.getElementById("double11").style.display = "none";
        $(".text2 span").html(zy_beginTime+":00--"+zy_endTime+":00");
        map = new coocaakeymap($(".coocaabtn"), $("#task_btn"), "btnFocus", function() {}, function(val) {}, function(obj) {});
    }else if(double11 == true){
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
                        for (var i = 0; i < num1; i++) {
                            var list = ' <li><span class="order o_'+i+'">'+i+'</span><span class="name">'+data.data.freeList[i].cNickName+'</span><span class="coin">红包：'+data.data.freeList[i].score+'个</span><span>'+data.data.freeList[i].gameTimeKey+'</span></li>';
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
                "id":actionId,
            },
            dataType: "json",
            success: function(data) {
                console.log("双十一今日免单榜"+JSON.stringify(data));
                if(data.code == 50100){
                    document.getElementById("11_rank").innerHTML = "";
                    if(data.data.length != 0){//免单榜
                        document.getElementById("11_rank").style.display = "block";
                        if(data.data.length >= 10){
                            num = 10;
                        }else{
                            num = data.data.length;
                        }
                        if(data.data.length != 0){//免单榜
                            for (var i = 0; i < num; i++) {
                                n = i+1;
                                if(data.data[i].cNickName == null){
                                    cNickName = "匿名用户";
                                }else{
                                    cNickName = data.data[i].cNickName;
                                }
                                var list = ' <li><span class="order o_'+n+'">'+n+'</span><span class="name" style="width:380px">'+cNickName+'</span><span>'+data.data[i].timeKey+'</span></li>';
                                $("#11_rank").append(list);
                            }
                        }else{
                            document.getElementById("11_rankNull").style.display = "block";
                        }
                        $(".o_1").addClass('icon first')
                        $(".o_2").addClass('icon two')
                        $(".o_3").addClass('icon three')
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
                    $("#exemption .title").html(month+"月"+day+"日免单榜");
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
                        for (var i = 0; i < num2; i++) {
                            var list = ' <li><span class="order o_'+i+'">'+i+'</span><span class="name">'+data.data.rankingList[i].cNickName+'</span><span class="coin">红包：'+data.data.rankingList[i].score+'个</span><span>'+data.data.rankingList[i].gameTimeKey+'</span></li>';
                            $("#rank").append(list);
                        }
                        $(".o_0").addClass('icon first')
                        $(".o_1").addClass('icon two')
                        $(".o_2").addClass('icon three')
                    }else{
                        document.getElementById("rankNull").style.display = "block";
                    }

                    if(data.data.freeList.length != 0){//免单榜
                        document.getElementById("exemption_rank").style.display = "block";
                        for (var i = 0; i < num3; i++) {
                            var list = ' <li><span class="order o_'+i+'">'+i+'</span><span class="name">'+data.data.freeList[i].cNickName+'</span><span class="coin">红包：'+data.data.freeList[i].score+'个</span><span>'+data.data.freeList[i].gameTimeKey+'</span></li>';
                            $("#exemption_rank").append(list);
                        }
                        $(".o_0").addClass('icon first')
                        $(".o_1").addClass('icon two')
                        $(".o_2").addClass('icon three')
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
            }
            document.getElementById("rank_Get").style.display = "inline-block";
            map = new coocaakeymap($(".coocaabtn"), $("#rank_btn"), "btnFocus", function() {}, function(val) {}, function(obj) {});
        }else{
            if(rankingArea == 2){//排名是否在100以内
                $(".rank_todaylistnum").html(userRanking);
            }else{
                $(".rank_todaylistnum").html("100+");
            }
            $(".rank_todayscore").html(todayMaxScore);
            if(loginstatus == "false"){
                $(".foot2").html("◎ 登录后成绩才能计入榜单哦~请马上登录~ ◎");
                document.getElementById("login_Get").style.display = "inline-block";
            }else{
                document.getElementById("user_td_rank").style.display = "inline-block";
                document.getElementById("login_Get").style.display = "none";
                if(userRanking == 1){
                    $(".foot2").html("◎ 继续坚持，免单机会就是你的~ ◎");
                }else if(1 < userRanking &&  userRanking <= 10){
                    $(".foot2").html("◎ 快被追上啦，马上玩游戏刷新纪录~ ◎");
                }else{
                    $(".foot2").html("◎ 别灰心，再玩一次，免单机会就在前方！ ◎");
                }
            }
            if(todayMaxScore != 0){//最好成绩不为0，说明已玩过游戏
                document.getElementById("again_Get").style.display = "inline-block";
                map = new coocaakeymap($(".coocaabtn"), $("#again_btn"), "btnFocus", function() {}, function(val) {}, function(obj) {});
            }else{
                document.getElementById("start_Get").style.display = "inline-block";
                map = new coocaakeymap($(".coocaabtn"), $("#start_game"), "btnFocus", function() {}, function(val) {}, function(obj) {});
            }
        }

    }
}