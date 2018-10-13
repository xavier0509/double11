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
                type: "get",
                async: true,
                url: adressIp + "/light/active/tv/source",
                data: {MAC:macAddress,cChip:TVchip,cModel:TVmodel,cEmmcCID:emmcId,cUDID:activityId,cSize:message.panel,cChannel:"coocaa",aSdk:message.androidsdk,cTcVersion:message.version.replace(/\.*/g,""),cBrand:message.brand},
                dataType: "jsonp",
                jsonp: "callback",
                // timeout: 20000,
                success: function(data) {
                    console.log("返回状态：" + JSON.stringify(data));
                    if(data.code == 0){
                        movieSource = data.data.source;
                        if(movieSource == "tencent"){
                            needQQ = true;
                        }
                    }
                    // hasLogin(needQQ,true);
                    //
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
    startmarquee(400, 30, 0, 1); //滚动获奖名单
    initBtn();
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
                x="0";
                break;
            case 3:case 4:case 5:
                x="180";
                break;
            case 6:case 7:case 8:
                x="360";
                break;
            case 9:case 10:case 11:
                x="360";
                break;
        }
        $("#mainbox").css("transform", "translate3D(0, -" + x + "px, 0)");
    })

    $("#rule").unbind("itemClick").bind("itemClick",function () {
        $("#mainbox").hide();
        $("#rulePage").show();
        map = new coocaakeymap($("#rulePage"),null, "btnFocus", function() {}, function(val) {}, function(obj) {});
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

//获奖名单滚动效果
function startmarquee(lh, speed, delay, index) {
    var t;
    var p = false;
    var o = document.getElementById("awardlist");
    o.innerHTML += o.innerHTML;
    o.scrollTop = 0;

    function start() {
        t = setInterval(scrolling, speed);
        if (!p) { o.scrollTop += 1; }
    }

    function scrolling() {
        if (o.scrollTop % lh != 0) {
            o.scrollTop += 1;
            if (o.scrollTop >= o.scrollHeight / 2) o.scrollTop = 0;
        } else {
            clearInterval(t);
            setTimeout(start, delay);
        }
    }
    setTimeout(start, delay);
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

function initGameStatus() {
    console.log("has Light city=="+lightCity);
    $("#strategy").attr("upTarget","");
    $("#myGift").attr("upTarget","");
    $("#myGift").attr("upTarget","");
    if(gameStatus == "end"){
        $("#mainMap").hide();
        $("#endPage").show();
        $("#myGift2").show();
        initBtn();
        map = new coocaakeymap($("#myGift2"), $("#myGift2"), "btnFocus", function() {}, function(val) {}, function(obj) {});
    }else{
        $("#mainMap").show();
        $("#lefttips").show();
        $("#endPage").hide();
        for(var i=0; i<15; i++){
            $("#city"+i).removeClass("hasLight");
            $("#cityCard"+i+" .cityBtn").html("我要点亮");
            $("#cityCard"+i+" .cityBtn").attr("leftTarget","#city"+i);
            $("#cityCard"+i+" .cityWord").html("<span class='word1'><b>欢迎来到</b></span><br>"+_powerData["city"+(i+1)].name);
            if(lightCity.indexOf("city"+i) != -1){
                forNum += 1 ;
                console.log("---------"+i);
                $("#city"+i).addClass("hasLight");
                $("#cityCard"+i+" .cityBtn").addClass("hasLight");
                $("#cityCard"+i+" .cityBtn").html("继续点亮");
                $("#cityCard"+(i)+" .cityImg img").attr("src",_powerData["city"+(i+1)].lightimg);
                if(cityNum<3){
                    $("#cityCard"+i+" .cardTitle").html("累计点亮3张");
                    $("#cityCard"+i+" .cityBottom").html("<span class='lightmoney'>有机会领1000元现金！</span>");
                }else if(cityNum>=7){
                    $("#cityCard"+i+" .cardTitle").html("累计点亮15张");
                    $("#cityCard"+i+" .cityBottom").html("<span class='lightmoney'>有机会领10000元现金！</span>");
                }else{
                    $("#cityCard"+i+" .cardTitle").html("累计点亮7张");
                    $("#cityCard"+i+" .cityBottom").html("<span class='lightmoney'>有机会领5000元现金！</span>");
                }

            }else{
                $("#cityCard"+(i)+" .cityImg img").attr("src",_powerData["city"+(i+1)].img);
                if(needRememberFocus){
                    setFocusFirst = true;
                    needRememberFocus = false;
                    initMap(rememberFocus);
                }else{
                    if(!setFocusFirst){
                        setFocusFirst = true;
                        initMap(".city:eq("+i+")");
                    }else{

                    }
                }
            }
        }
        if(remainNum == 0){
            $(".cityBtn").html("更多景点卡");
            $(".cardTitle").html("今日点亮机会已用完");
            $(".cityBottom").html("<span class='nochancename'>快获得更多机会，冲刺万元现金大奖！</span>");
        }

        if(totalNum == 0){
            $(".cityBtn").html("我要点亮");
            $(".cardTitle").html("点亮景点可领现金/实物奖励");
            $(".cityBottom").html("<span class='immediatelyname'>累计点亮3张还有机会赢1000元大奖！</span>");
        }
        if(forNum == 15){
            $(".cardTitle").html("即刻抽取万元现金");
            $(".cityBottom").html("<span class='finishlightname'>获得赢取10000元现金的机会！</span>");
            $(".cityBtn").html("抽万元现金");
            initMap("#city0");
            initMap("#gotoLottery");
        }
        if(needShowWindow){
            needShowWindow = false;
            $("#blackbg").show();
            $("#toast2").show();
            $("#nowhave").html(cityNum);
            map = new coocaakeymap($(".toastbtn"),null,"btnFocus", function() {}, function(val) {}, function(obj) {});
        }
        if(gameStatus == "wait"){
            $("#gotoLottery").hide();
            $("#morecard").hide();
            $("#myGift").hide();
            $("#cityNum").hide();
            $("#remainNum").hide();
            $("#strategy").show();
            $("#strategy").attr("upTarget","#strategy");
            $(".cityBtn").html("29日0点开启");
            $(".cardTitle").html("点亮景点可领现金/实物奖励");
            $(".cityBottom").html("<span class='finishlightname'>活动即将开启，敬请期待~</span>");
            $("#mainMap").css("background","url('http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/waitbg.jpg')")
        }else{
            $("#gotoLottery").show();
            $("#morecard").show();
            $("#myGift").show();
            $("#strategy").show();
            $(".cityBtn").attr("rightTarget","#gotoLottery");
        }
    }
}

//页面初始化或刷新
function showPage(first,resume) {
    console.log("$$$$$$$$$$$$$$$$$$===="+first+"==========="+resume)
    if(first){
        if(getUrlParam("goto")=="shop"){
            needgotoshop = true;
            exitWeb = true;
        }
    }else if(resume){
        initType = "all";
    }else{
        initType = "no";
    }
    setFocusFirst = false;
    forNum = 0;
    lightCity = [];
    $(".cityBtn").removeClass("hasLight");
    console.log("---"+macAddress+"------"+TVchip+"-----"+TVmodel+"------"+emmcId+"--------"+activityId + "---------"+initType+"-------"+cOpenId);
    $.ajax({
        type: "GET",
        async: true,
        url: adressIp + "/light/active/"+actionId+"/init",
        data: {id:actionId, MAC:macAddress,cChip:TVchip,cModel:TVmodel,cEmmcCID:emmcId,cUDID:activityId,initType:initType,cOpenId:cOpenId,source:movieSource},
        dataType: "jsonp",
        jsonp: "callback",
        success: function(data) {
            console.log("------------init----result-------------"+JSON.stringify(data));
            if (data.code == 50100) {
                cityNum = data.data.userLightCity.lightNumber;
                totalNum = data.data.userChance.allOperation;
                remainNum = data.data.userChance.overNumber;
                nowTime = data.data.sysTime;
                beginTime = data.data.active.activeBeginTime;
                endTime = data.data.active.activeEndTime;
                giveCard = data.data.lightByDay;
                if(giveCard != undefined){
                    if(giveCard.lightNumber > 0){
                        needShowWindow = true;
                    }
                }
                if(nowTime > beginTime && nowTime < endTime){
                    gameStatus = "start";
                    if(first && getUrlParam("goto")!="shop"){
                        var landstatus = 0;
                        if(loginstatus == "true"){landstatus = 1;}
                        sentLog("web_page_show_new",'{"page_name":"nalm_main_activity_page","activity_status":"1","login_status":"'+landstatus+'"}')
                    }
                }
                for(var i=1;i<=15;i++){
                    var checkCity = "city"+i;
                    if(data.data.userLightCity.cityInfo[checkCity]!=undefined){
                        lightCity.push("city"+(i-1));
                    }
                    $("#cityCard"+(i-1)+" .cityBtn").attr("missionType",data.data.cityTask[checkCity].type);
                    $("#cityCard"+(i-1)+" .cityBtn").attr("missionId",data.data.cityTask[checkCity].id);
                    $("#cityCard"+(i-1)+" .cityBtn").attr("missionUrl",data.data.cityTask[checkCity].url);
                    $("#cityCard"+(i-1)+" .cityBottom").html("<span class='missionName' style='font-weight: bold'>"+data.data.cityTask[checkCity].name+"</span>");
                    if(data.data.cityTask[checkCity].type == "video"){
                        $("#cityCard"+(i-1)+" .cardTitle").html("点亮景点可领现金/实物奖励");
                    }else{
                        $("#cityCard"+(i-1)+" .cardTitle").html("点亮景点可领现金/实物奖励");
                    }
                }
            } else if(data.code == 50002){
                gameStatus = "wait";
                if(first && getUrlParam("goto")!="shop"){
                    var landstatus = 0;
                    if(loginstatus == "true"){landstatus = 1;}
                    sentLog("web_page_show_new",'{"page_name":"nalm_main_activity_page","activity_status":"0","login_status":"'+landstatus+'"}')
                }
            // }else if(data.code == 50003){
            }else{
                gameStatus = "end";
                if(first && getUrlParam("goto")!="shop"){
                    var landstatus = 0;
                    if(loginstatus == "true"){landstatus = 1;}
                    sentLog("web_page_show_new",'{"page_name":"nalm_main_activity_page","activity_status":"2","login_status":"'+landstatus+'"}')
                }
            }

            initGameStatus();
            $("#cityNum").html(cityNum);
            $("#remainNum").html(remainNum);
        },
        error: function(error) {
            console.log("--------访问失败" + JSON.stringify(error));
        }
    });
}