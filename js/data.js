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
var exitWeb = false;

var actionStatus = "start";
var gameStatus = "start";

var countDay = 0;//活动开始的第几天
var timePart = null;//活动的时段信息
var gameResult = null;//用户排名信息
var gameChance = 0 ;
var beginTime = null;
var endTime = null;

var movieBanner = null;
var tvMallBanner = null;
var eduBanner = null;
var apkBanner = null;
var arrBanner = [];
var bannerNanme = [];

var adressIp = "http://beta.restful.lottery.coocaatv.com";
// var adressIp = "https://restful.skysrt.com";
var actionId = "150";
// var actionId = "55";















var _listenObj = null;
var _listenNum = null;
var _listenType = null;

var comefrom = 0; //影视：0；教育：1；购物：2[任务版面]

var needSentUserLog = false;
var startActionReplace = "coocaa.intent.action.HOME";

var drawurl = "https://webapp.skysrt.com/national/lottery/index.html?part=draw&source=main";
var awardurl = "https://webapp.skysrt.com/national/lottery/index.html?part=award&source=main&status=";
var mainurl = "https://webapp.skysrt.com/national/main/index.html";

// var drawurl = "http://beta.webapp.skysrt.com/lxw/gq/index.html?part=draw&source=main";
// var awardurl = "http://beta.webapp.skysrt.com/lxw/gq/index.html?part=award&source=main&status=";
// var mainurl = "http://beta.webapp.skysrt.com/games/yure/index.html";
