//工具模块
var Util = (function(util){
    util = util||function(){};
    var utl = util.prototype;
    //得到常驻节点
    utl.getPerNode = function(NodeName){
      return cc.director.getScene().getChildByName(NodeName);
    };
    //播放加载动画
    utl.showLoading = function(){
      this.getPerNode('PerNode').getChildByName('ReqAni').active = true;
    };
    //关闭加载动画
    utl.hideLoading = function(){
      this.getPerNode('PerNode').getChildByName('ReqAni').active = false;
    };
    //显示小提示
    utl.showTips = function(str){
      this.getPerNode('PerNode').getChildByName('LittleTip').getComponent('LittleTip').setContent(str);
    };
    //显示确认对话框
    utl.showConDia = function(msg,fn1,fn2){
      this.getPerNode('PerNode').getComponent('PerNode').showConDia(msg,fn1,fn2);
    };
    //验证手机号格式
    utl.verMobileReg = function(mobile){
        let mobileNum = /^(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;//手机号正则
        return mobileNum.test(mobile);
    };
    //银行卡正则
    utl.verBankCard = function(backCard){
      let reg = /^([1-9]{1})(\d{14}|\d{18})$/;
      return reg.test(backCard);
    };
    //验证中文姓名
    utl.verUserName = function(userName){
      let reg = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9])*$/;
      return reg.test(userName);
    };
    //身份证号验证
    utl.verIdCard = function(idCard){
      let reg = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
      return reg.test(idCard);
    };
    //清除字符串空格
    utl.trim = function(str){
      return str.trim();
    };
    //生成uuid
    utl.createUUID = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    };
    //时间戳生成日期
    utl.formatTimeForH5 = function (now) {
        var year = new Date(now).getFullYear();
        var month = new Date(now).getMonth() + 1 >= 10 ? new Date(now).getMonth() + 1 : '0' + (new Date(now).getMonth() + 1);
        var date = new Date(now).getDate() >= 10　? new Date(now).getDate() :　'0' + new Date(now).getDate();
        var hour = new Date(now).getHours();
        var minute = new Date(now).getMinutes();
        var second = new Date(now).getSeconds();

        return [year + "-" + month + "-" + date,(hour == '0' ? '00' : hour)
        + ":" + (minute == '0' ? '00' : minute)  + ":" + (second == '0' ? '00' : second)];
    };
    //得到时间戳是昨天还是今天time->指定时间戳
    utl.compareDay = function(time){
        var _now  = new Date().getTime();//当前时间戳
        var _nowYear = new Date().getFullYear();//当前年份
        var _nowMonth = new Date().getMonth()+1;//当前月份
        var _nowDay = new Date().getDate();//指定天

        var _year = new Date(time).getFullYear();//指定年份
        var _month = new Date(time).getMonth()+1;//指定月份
        var _day = new Date(time).getDate();//指定天

        if(_nowYear==_year&&_nowMonth==_month&&_nowDay==_day){//同一天
            return '今天';
        }else if(_nowYear==_year&&_nowMonth==_month&&_nowDay-1==_day){
            return '昨天';
        }else{
            var m =  _month>10?_month:'0'+_month;
            var d = _day>10?_day:'0'+_day;
            return m+'-'+d;
        }
    };
    utl.formatTime = function(){
        Date.prototype.Format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
    };
    //根据时间戳得到日期是今天或昨天
    utl.getDate = function(time){
        var d = this.compareDay(time);
        var hour = new Date(time).getHours();//得到小时
        var minute = new Date(time).getMinutes();//得到分钟
        var second = new Date(time).getSeconds();//得到秒数
        return{
            date:d,
            time:(hour+1 >10 ? hour :'0' + hour)
            + ":" + (minute+1 > 10 ? minute : '0' + minute)
            + ":" + (second+1 > 10 ? second :'0'+ second)
        }
    };
    //得到现在到未来某个时间点的倒计时
    utl.getCountDown = function(future){
        var now = new Date().getTime();
        var nextStatus = future
        var nextStatusText = (nextStatus-now)/1000;
        //console.log(nextStatusText);
        var days=Math.floor(nextStatusText/3600/24);
        var hours=Math.floor((nextStatusText-days*24*3600)/3600);
        var mins=Math.floor((nextStatusText-days*24*3600-hours*3600)/60);
        var secs=Math.floor((nextStatusText-days*24*3600-hours*3600-mins*60));

        //console.log(days,hours,mins,secs);
        if(hours<=0){
            hours = 0;
        }
        if(mins<=0){
            mins = 0;
        }
        if(secs<=0){
            secs = 0;
        }
        //var time = hours+"小时"+mins+"分钟"+secs+"秒";
        var time = hours+":"+mins+":"+secs;
        return time;
    };
    //得到某个范围内随机整数
    utl.getRandInt = function(n,m){
        var c = m-n+1;
        return Math.floor(Math.random() * c + n);
    };
    //得到当前土地的种植详情->有则返回种植详情否者返回false
    utl.getCurPlantDetail = function(pdId,allDetails){//传入当前土地pdId和全部种植详情
        //cc.log(pdId,allDetails);
        var curDetails = null;
        for(var i = 0;i<allDetails.length;i++){
            if(allDetails[i].id==pdId){
                curDetails = allDetails[i];
                break;
            }
        }
        return curDetails;
    };
    //通过植物的下一次状态时间定时触发任务
    /**
     @param now->现在时间;
     @param future->下一个状态的时间;
     @param task->需要执行的函数;
     */
        //后台会给倒计时时间 未来时间减去现在时间()
    utl.updateStatusByNextStatusTime = function(now,future,task){
        //后台传递数据有问题 暂不解决
        var now = now||new Date().getTime();
        var future = future||new Date().getTime();
        if(now>=future) return;
        var time = future-now+1000;
        var timeOut = setTimeout(()=>{
            //alert(1);
            task();
            //alert(2);
        },time)
    };
    //得到一个Obj[]中所有的nextStsTime并压入数组
    /**
     * @arrList ->所有种植详情
     * */
    utl.getNextStsTimeFromArr = function(arrList){
        var arr = [];
        if(arrList.length>0){
            for(let i = 0;i<arrList.length;i++){
                if(arrList[i].nextStsTime){
                    arr.push(arrList[i].nextStsTime);
                }
            }
        };
        return arr;
    };
    //得到一个数组中所有大于某一个值的数值
    utl.getAllThatThanParam = function(param,arr){
        var arr = arr||[new Date().getTime()];
        var param = param||new Date().getTime();
        var newArr = [];
        if(arr.length>0){
            for(let i = 0;i<arr.length;i++){
                if(arr[i]>param){
                    newArr.push(arr[i]);
                }
            }
            if(newArr.length<1){
                return [new Date().getTime()];
            }
            return newArr;
        }
        return [new Date().getTime()];
    };
    //得到数组中最小的数
    utl.getMinFromArr = function(arr){
        if(arr.length>0){
           return Math.min(...arr);
           //Math.min.apply(null,arr);
        }
        return new Date().getTime();
    };
    //拆分字符串
    utl.splitStr = function(str){
        return str.split('_')[1];
    };
    //得到url查询参数
    utl.getQueryString = function(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)return unescape(r[2]);
        return null;
    };
    //iphoneX适配
    //dele 节点的挂载的对象
    utl.iphoneXAdapter = function(dele){
        if(cc.sys.isNative && cc.sys.platform == cc.sys.IPHONE){
            var size = cc.view.getFrameSize();
            var isIphoneX = (size.width == 2436 && size.height == 1125)
                   ||(size.width == 1125 && size.height == 2436);
            if(isIphoneX){
                var cvs = dele.node.getComponent(cc.Canvas);
                cvs.fitHeight = true;
                cvs.fitWidth = true;
            }
         }
    };
    //检验品台
    utl.checkEquipment = function () {
      var ua = window.navigator.userAgent.toLowerCase();//微信
      var u = navigator.userAgent;//手机类型android或ios
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {//微信
        return 'WX';
      } else if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
        return 'android';
      } else if (u.indexOf('iPhone') > -1) {//苹果手机
        return 'ios';
      } else {//其他设备
        return 'other';
      }
    },
    //验证平台
    utl.getPlatform = function(){
        if(cc.sys.isNative && cc.sys.platform == cc.sys.IPHONE){
            return 'IOS';//ios原生环境
        }
        if(cc.sys.isNative && cc.sys.os == "Android"){
            return 'Android';//android原生环境
        }
        if(!cc.sys.isNative){
            return 'Browser';//浏览器环境;
        }
    };
    //localStorage
    utl.setItem = function (key,val) {
        return cc.sys.localStorage.setItem(key,val);
    };
    utl.getItem = function (key) {
        return cc.sys.localStorage.getItem(key);
    };
    utl.removeItem = function (key) {
        cc.sys.localStorage.removeItem(key);
    };
    return new util;
})(Util);

module.exports = Util;
