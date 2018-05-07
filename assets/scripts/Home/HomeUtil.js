let Util = require('Util');
let Net = require('Net');
const HomeUtil = (function(){
  var hu = {};
  //通过市场或游戏的token获取Qa的token
  let getQaTokenUrl = '/login/getQaToken';
  hu.getQaToken = function(token){
    let prs = new Promise((resolve,reject)=>{
      Net.get(getQaTokenUrl,!1,token,(res)=>{
        resolve(res);
      },(err)=>{
        reject(false);
      })
    });
    return prs;
  };
  //游客登录
  let visitorLoginUrl = '/login/visitorlogin';
  hu.visitorToken = function(datas){
    datas = datas||null;
    let prs = new Promise((resolve,reject)=>{
      Net.get(visitorLoginUrl,!1,datas,(res)=>{
        resolve(res);
      },(err)=>{
        reject(false);
      })
    });
    return prs;
  };

  //用户登录
  let loginUrl = '/login/userlogin';
  hu.toLogIn = function(datas){
    let prs = new Promise((resolve,reject)=>{
      Net.post(loginUrl,1,datas,(res)=>{
        resolve(res);
      },(err)=>{
        reject(false);
      })
    });
    return prs;
  };
  //首页数据
  let indexUrl = '/question/index';
  hu.getIndexData = function(){
    let prs = new Promise((resolve,reject)=>{
      Net.get(indexUrl,1,null,(res)=>{
        resolve(res);
      },(err)=>{
        reject(false);
      })
    });
    return prs;
  };
  //获取绑定短信验证码
  let getMsgCodeUrl = '/sms/sendQaBindSms';
  hu.getMsgCode = function(datas){
    let prs = new Promise((resolve,reject)=>{
      Net.post(getMsgCodeUrl,!1,datas,(res)=>{
        resolve(res);
      },(err)=>{
        reject(false);
      })
    });
    return prs;
  };
  //提交用户绑定数据
  let bindUrl = '/user/bind';
  hu.subBindData = function(datas){
    let prs = new Promise((resolve,reject)=>{
      Net.post(bindUrl,1,datas,(res)=>{
        resolve(res);
      },(err)=>{
        reject(false);
      })
    });
    return prs;
  };

  //获取市场的token
  let getTokenUrl = '/user/getMarketToken';
  hu.getMarketToken = function(){
    let prs = new Promise((resolve,reject)=>{
      Net.get(getTokenUrl,1,null,(res)=>{
        resolve(res);
      },(err)=>{
        reject(false);
      })
    });
    return prs;
  };
  //检查任务
  let testTaskUrl = '/user/testtask';
  hu.testTask = function(){
    let prs = new Promise((resolve,reject)=>{
      Net.get(testTaskUrl,1,null,(res)=>{
        resolve(res);
      },(err)=>{
        reject(false);
      })
    });
    return prs;
  };
  //获取当前绿能价格
  let greenPriceUrl = '/getTranInfo?proId=4001';
  hu.greenPrice = function(){
    let prs = new Promise((resolve,reject)=>{
      Net.get(greenPriceUrl,1,null,(res)=>{
        resolve(res);
      },(err)=>{
        reject(false);
      })
    })
    return prs;
  };

  //用户提现接口
  //let cashUrl = '/user/cash';
  //hu.toCash = function(datas){
  //  let prs = new Promise((resolve,reject)=>{
  //    Net.post(cashUrl,1,datas,(res)=>{
  //      resolve(res);
  //    },(err)=>{
  //      reject(false);
  //    })
  //  });
  //  return prs;
  //};

  return hu;
})();

module.exports = HomeUtil;
