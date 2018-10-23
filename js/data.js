var accountVersion = ""; // 账户版本
var cAppVersion = ""; //影视版本
var deviceInfo = null; //设备信息
var macAddress = null; //mac
var TVmodel = null; //机型	
var TVchip = null; //机芯
var activityId = null; //激活id
var emmcId = null;//emmcid;
var loginstatus = null; //登录状态-string
var tencentWay = null; //腾讯源机器调用登录的要求（both,qq,weixin)
var user_flag = null; //下单传递用户标识1-token；2-openid
var access_token = null; //token值
var login_type = null; //下单拓展信息 0-手机；1-qq;2-weixin
var vuserid = null; //vuserid
var showFlag = null; //用于判断当前账户是否发生改变，防止多次监听到账户变化多次刷新页面
var cOpenId = null;
var nick_name = null;
var movieSource = null;
var needQQ = false;

var gameVersion = 0;
var showprogress = 0;
var waitApkInstallFunc = null;
var downToast = "";
var downGameFalse = false;

var needgotoshop = false;
var needgotogame = false;
var exitWeb = false;

var actionStatus = "start";
var gameStatus = "start";

var countDay = 0;//活动开始的第几天
var timePart = null;//活动的时段信息
var gameResult = null;//用户排名信息
var todayMaxScore = 0;
var gameChance = 0 ;
var taskList = null;
var beginTime = null;
var endTime = null;

var movieBanner = null;
var tvMallBanner = null;
var eduBanner = null;
var apkBanner = null;
var isTaskOver = 0;
var arrBanner = [];
var bannerNanme = [];
var needInit = false;

var adressIp = "http://beta.restful.lottery.coocaatv.com";
// var adressIp = "https://restful.skysrt.com";
var actionId = "150";
// var actionId = "55";

//普通场奇异
var _freeList = {
    "pkg1":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"10579","name":"飞利浦除螨吸尘器","type":"1","product_id":"","price":""},
    "pkg2":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"10545","name":"艾美特全自动食品真空包装机","type":"1","product_id":"","price":""},
    "pkg3":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"16883","name":"膳魔师小红帽系列保温杯","type":"1","product_id":"","price":""},
    "pkg4":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"16847","name":"怡万家马卡龙保鲜盒九件套","type":"1","product_id":"","price":""},
    "pkg5":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"16843","name":"双立人多用刀具2件套","type":"1","product_id":"","price":""},
    "pkg6":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"16845","name":"巴拉利煎炒锅","type":"1","product_id":"","price":""},
    "pkg7":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"","name":"教育超级VIP","type":"2","product_id":"1194","price":"49900"},
    "pkg8":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"","name":"影视VIP年卡","type":"2","product_id":"1203","price":"24900"}
}
//普通场腾讯
var _freeList2 = {
    "pkg1":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"10579","name":"飞利浦除螨吸尘器","type":"1","product_id":"","price":""},
    "pkg2":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"10545","name":"艾美特全自动食品真空包装机","type":"1","product_id":"","price":""},
    "pkg3":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"16883","name":"膳魔师小红帽系列保温杯","type":"1","product_id":"","price":""},
    "pkg4":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"16847","name":"怡万家马卡龙保鲜盒九件套","type":"1","product_id":"","price":""},
    "pkg5":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"16843","name":"双立人多用刀具2件套","type":"1","product_id":"","price":""},
    "pkg6":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"16845","name":"巴拉利煎炒锅","type":"1","product_id":"","price":""},
    "pkg7":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"","name":"教育超级VIP","type":"2","product_id":"1194","price":"49900"},
    // "pkg8":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"","name":"影视VIP年卡","type":"2","product_id":"1201","price":"18000"}
    "pkg8":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"","name":"影视VIP年卡","type":"2","product_id":"1","price":"1"}
}
//双十一场
var _freeList3 = {
    "pkg1":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"16846","name":"双立人百年经典厨具套","type":"1","product_id":"","price":""},
    "pkg2":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"17142","name":"先锋智能电暖器","type":"1","product_id":"","price":""},
    "pkg3":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"13208","name":"飞利浦焕亮眼部按摩护眼仪（女士）","type":"1","product_id":"","price":""},
    "pkg4":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"13207","name":"飞利浦眼部能量按摩护眼仪（男士）","type":"1","product_id":"","price":""},
    "pkg5":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"13254","name":"飞利浦空气净化器（除甲醛雾霾烟）","type":"1","product_id":"","price":""},
    "pkg6":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"13253","name":"飞利浦空气净化器（PM25四重过滤）","type":"1","product_id":"","price":""},
    "pkg7":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"13247","name":"飞利浦手持式除螨仪吸尘器","type":"1","product_id":"","price":""},
    "pkg8":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/double11/free/testproduct.png","id":"15243","name":"飞利浦深层导入美容滋养仪","type":"1","product_id":"","price":""}
}

var needgotoRankList = false;
var needSentUserLog = false;
var resumeAndFresh = false;
var click_login = "false"; //==============zy
var startActionReplace = "coocaa.intent.action.HOME";

var setInterv1 = null;
var setInterv2 = null;

var awardurl = "https://beta.webapp.skysrt.com/lxw/example/index.html?part=award";

// var awardurl = "http://beta.webapp.skysrt.com/lxw/gq/index.html?part=award&source=main&status=";









