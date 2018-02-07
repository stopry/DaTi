let Net = require('Net');
const Req = (function () {
  let req = {};

  //获取用户信息
  let getUserInfoUrl = '/get/userInfo';
  req.getUserInfo = function () {
    let pro = new Promise((resolve,reject)=>{
      Net.get(getUserInfoUrl,1,null,(res)=>{
        if(!res.success){
          reject(res);
        }else{
          resolve(res.obj);
        }
      },(err)=>{
        reject(false);
      });
    });
    return pro;
  };
  //调用
  /*
  req.getUserInfo().then((res)=>{

  });
  */

  return req;
})();

module.exports = Req;
