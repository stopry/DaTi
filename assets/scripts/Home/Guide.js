let HomeUtil = require('HomeUtil');
let Util = require('Util');
cc.Class({
  extends:cc.Component,
  properties:{
    persistNode:cc.Node
  },
  onLoad(){
    //添加常驻节点用户不同场景传参
    cc.game.addPersistRootNode(this.persistNode);
    this.setSid();
    //无限机会
    cc.sys.localStorage.removeItem('token');
  },
  //存sid
  setSid(){
    if(!cc.sys.isNative){
      let sid = Util.getQueryString('sid');
      if(sid){
        cc.sys.localStorage.setItem('sid',sid);
      }
    }
  },
  //去答题页面
  toGamePage(){
    //HomeUtil.visitorToken(null).then((res)=>{
    //  if(!res.success){
    //    Util.showTips(res.msg);
    //  }else{
    //    let obj = res.obj;
    //    let token = obj.tokenType+' '+obj.accessToken;
    //    cc.sys.localStorage.setItem('token',token);
    //    cc.director.loadScene('Home',()=>{
    //
    //    });
    //  }
    //});
    //return;
    //检测本地是否储存有用户token 如果没有调用游客登录接口 有则使用本地token请求用户信息
    if(cc.sys.localStorage.getItem('token')){
      cc.director.loadScene('Home',()=>{

      });
    }else{
      HomeUtil.visitorToken(null).then((res)=>{
        if(!res.success){
          Util.showTips(res.msg);
        }else{
          let obj = res.obj;
          let token = obj.tokenType+' '+obj.accessToken;
          cc.sys.localStorage.setItem('token',token);
          cc.director.loadScene('Home',()=>{

          });
        }
      });
    }

  },
  //获取用户信息 并储存在常驻节点的datas属性上
  loadPlayer(){

  },
  //去登录页面
  toLoginPage(){
    cc.director.loadScene('LogIn',()=>{

    });
  },
  onDestroy(){

  }
});
