let Util = require('Util');
//网络接口
let Net = {
    api:{
        is89:!1,//是否是89服务
        host:'http://192.168.19.89:8085',//host //答题接口
        //host:'',//host //答题接口
        api:'/qa',
        //marketHost:'http://192.168.19.89:8080',
        marketHost:'',
        market:'/market'
    },
    timeOut:10000,
    //请求地址、请求头、发送数据、成功回调、失败回调
    get:function(url,header,data,succCallBack,errCallBack){//get请求
        var self = this;
        var host = self.api.host;
        var xhr = new XMLHttpRequest();
        Util.showLoading();
        xhr.onreadystatechange = function () {
            self.authVerify(xhr.responseText);
            if (xhr.readyState == 4&&(xhr.status >= 200 && xhr.status < 400)) {
                Util.hideLoading();
                var response = JSON.parse(xhr.responseText);
                cc.log(response);
                succCallBack&&succCallBack(response);
            }else{
               // errCallBack&&errCallBack();
            }
        };
        url = self.api.api+url;
        xhr.open("GET", host+url+(data?this.toUrlPar(data):''), true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding","gzip,deflate");
        }
        xhr.setRequestHeader("Content-Type","application/json;charset=utf-8");
        if(header){
            //xhr.setRequestHeader('Authorization','1');
            xhr.setRequestHeader('Authorization',cc.sys.localStorage.getItem('token'));
        }
        xhr.timeout = this.timeOut;
        xhr.ontimeout = function (e) {
            Util.hideLoading();
            Util.showTips('网络超时');
            errCallBack&&errCallBack();
        };
        xhr.onerror  = function () {
            Util.hideLoading();
            Util.showTips('网络错误');
            errCallBack&&errCallBack();
        };
        xhr.send();
    },

    post:function(url,header,data,succCallBack,errCallBack){//post请求
        var self = this;
        var host = self.api.host;
        var xhr = new XMLHttpRequest();
        var self = this;
        if(url!='/question/qa'){
          Util.showLoading();
        }
        xhr.onreadystatechange = function () {
            self.authVerify(xhr.responseText);
            if (xhr.readyState == 4&&(xhr.status >= 200 && xhr.status < 400)) {
                Util.hideLoading();
                var response = JSON.parse(xhr.responseText);
                cc.log(response);
                succCallBack&&succCallBack(response);
            }else{
                //errCallBack&&errCallBack();
            }
        };
        //url = self.api.api+url;
        let uri = "";
        //短信验证码接口调用市场的
        if(url=='/sms/sendQaBindSms'){
            uri = self.api.marketHost+self.api.market+url;
        }else{
            uri = self.api.host+self.api.api+url
        }
        xhr.open("POST", uri, true);
        xhr.setRequestHeader("Content-Type","application/json;charset=utf-8");
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding","gzip,deflate");
        }
        if(header){
            xhr.setRequestHeader('Authorization',cc.sys.localStorage.getItem('token'));
        }
        xhr.timeout = this.timeOut;
        xhr.ontimeout  = function (e) {
            Util.hideLoading();
            Util.showTips('网络超时');
            errCallBack&&errCallBack();
        };
        xhr.onerror  = function () {
            Util.hideLoading();
            Util.showTips('网络错误');
            errCallBack&&errCallBack();
        };
        xhr.send(JSON.stringify(data));
    },
    authVerify:function(res){
        if(res){
            if(JSON.parse(res).code=="401"){
                Util.hideLoading();
                Util.showConDia('身份验证过期请重新登录',
                  ()=>{
                    cc.director.loadScene("Guide");
                    cc.sys.localStorage.removeItem('token');
                  },()=>{});
            }
        }
    },
    ws:function(url,openCallBack,messageCallBack,errCallBack,closeCallBack){//WebSocket
        ws = new WebSocket(url);
        ws.onopen = function (event) {
            openCallBack&&openCallBack(event);
        };
        ws.onmessage = function (event) {
            messageCallBack&&messageCallBack(event);
        };
        ws.onerror = function (event) {
            errCallBack&&errCallBack(event);
        };
        ws.onclose = function (event) {
            closeCallBack&&closeCallBack(event);
        };
        //setTimeout(function () {//发送数据
        //    if (ws.readyState === WebSocket.OPEN) {
        //        ws.send("Hello WebSocket, I'm a text message.");
        //    }
        //    else {
        //        console.log("WebSocket instance wasn't ready...");
        //    }
        //}, 3);
    },
    //js对象字面量转化为url请求参数
    toUrlPar:function(obj) {
        var s = ""
        for (var itm in obj) {
            if (obj[itm] instanceof Array == true) {
                //是数组
                s += "&" + itm + "_count=" + obj[itm].length
                for (var i = 0; i < obj[itm].length; i++) {
                    if (obj[itm][i] instanceof Array == true) {
                        s += ergodicJson2(obj[itm][i]);
                    } else if (obj[itm][i] instanceof Object == true) {
                        s += ergodicJson2(obj[itm][i]);
                    } else {
                        s += "&" + encodeURI(obj[itm][i]) + "=" + encodeURI(obj[itm][i]);
                    }
                }
            } else if (obj[itm] instanceof Object == true) {
                //是json对象。
                s += ergodicJson2(obj[itm]);
            }
            else {
                //是简单数值
                s += "&" + encodeURI(itm) + "=" + encodeURI(obj[itm]);
            }
        }
        if(s){
            s = "?"+s.substring(1,s.length);
            return s;
        }else{
            return '';
        }

    },
};

module.exports = Net;
