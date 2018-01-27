let Util = require('Util');
let Net = require('Net');
const HomeUtil = (function(){
  var hu = {};
  //获取绑定短信验证码
  let getMsgCodeUrl = '/get/msg';
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
  let bindUrl = '/get/bind';
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
  //用户登录
  let loginUrl = '/get/logIn';
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
  //用户提现接口
  let cashUrl = '/user/cash';
  hu.toCash = function(datas){
    let prs = new Promise((resolve,reject)=>{
      Net.post(cashUrl,1,datas,(res)=>{
        resolve(res);
      },(err)=>{
        reject(false);
      })
    });
    return prs;
  };

  return hu;
})();

module.exports = HomeUtil;
