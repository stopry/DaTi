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
    this.resolveFromZjiayuan();
    //无限机会
    //cc.sys.localStorage.removeItem('token');

    // cc.director.loadScene('Home',()=>{
    //   //
    //      });
  },
  start(){
    registShare();
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
  //从z家园游戏中跳转过来处理
  resolveFromZjiayuan(){
    if(!cc.sys.isNative){
      let isFromGame = Util.getQueryString('isFromGame');
      let token = (decodeURI(Util.getQueryString('token'))).split(' ')[1];
      if(isFromGame&&token&&Global.isFirstFromGame){//游戏中跳转过来
        Global.isFirstFromGame = false;
        Global.isFirstCom = false;
        HomeUtil.getQaToken({token:token}).then((res)=>{
          if(!res.success){
            Util.showTips(res.msg);
          }else{
            let token = res.obj.tokenType+' '+res.obj.accessToken;
            cc.sys.localStorage.setItem('token',token);
            // this.toGamePage();
            cc.director.loadScene('Home',()=>{

            });
          }
        })
      }else{
        this.isAuth();
      }
    }
  },
  //检测是否为登陆状态 如果是则直接进入主页
  isAuth(){
    if(cc.sys.localStorage.getItem('token')&&Global.isFirstCom){
      Global.isFirstCom = false;
      Global.isFirstFromGame = false;
      Util.showLoading();
      cc.director.loadScene('Home',()=>{

      });
    }
  },
  //
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
      HomeUtil.getIndexData().then((res)=>{
        if(res.success){

          let obj = res.obj;
          this.promoteLink = !cc.sys.isNative?window.location.origin+"/?sid="+obj.playerId:'http://game.zjiayuan.com';
          //改变分享配置的link
          Global.wxShare.link = this.promoteLink;
          //将推广链接存到本地
          cc.sys.localStorage.setItem('prtLink',this.promoteLink);
          cc.sys.localStorage.setItem('prtCode',obj.playerId);

          Util.getPerNode('PerNode').getComponent('PerNode').datas.userInfo = res.obj;
          if((res.obj.singleCnt+res.obj.singleFreeCnt)>=1){
            Util.showLoading();
            cc.director.loadScene('Game',()=>{

            });
          }else{
            Util.showLoading();
            cc.director.loadScene('Home',()=>{

            });
          }
        }else{
          Util.showTips(res.msg)
        }
      })
    }else{
      HomeUtil.visitorToken(null).then((res)=>{
        if(!res.success){
          Util.showTips(res.msg);
        }else{
          let obj = res.obj;
          let token = obj.tokenType+' '+obj.accessToken;
          cc.sys.localStorage.setItem('token',token);
          HomeUtil.getIndexData().then((rest)=>{
            if(rest.success){
              
              let obj = rest.obj;
              this.promoteLink = !cc.sys.isNative?window.location.origin+"/?sid="+obj.playerId:'http://game.zjiayuan.com';
              //改变分享配置的link
              Global.wxShare.link = this.promoteLink;
              //将推广链接存到本地
              cc.sys.localStorage.setItem('prtLink',this.promoteLink);
              cc.sys.localStorage.setItem('prtCode',obj.playerId);

              Util.getPerNode('PerNode').getComponent('PerNode').datas.userInfo = rest.obj;
              if((rest.obj.singleCnt+rest.obj.singleFreeCnt)>=1){
                Util.showLoading();
                cc.director.loadScene('Game',()=>{

                });
              }else{
                Util.showLoading();
                cc.director.loadScene('Home',()=>{

                });
              }
            }else{
              Util.showTips(rest.msg)
            }
          })
        }
      });
    }
  },
  //获取用户信息 并储存在常驻节点的datas属性上
  loadPlayer(){

  },
  //去登录页面
  toLoginPage(){
    Util.showLoading();
    cc.director.loadScene('LogIn',()=>{

    });
  },
  onDestroy(){

  }
});
