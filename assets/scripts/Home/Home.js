let Util = require('Util');
cc.Class({
  extends:cc.Component,
  properties:{
    alterBoxLayer:cc.Node,//弹框遮罩
    prtCode:cc.Node,//推广码弹框
  },
  onLoad(){
    cc._initDebugSetting(cc.DebugMode.INFO);
    cc.director.setDisplayStats(false);
    cc.view.resizeWithBrowserSize(true);
    this.isLoged = false;//用户是否登录
  },
  showTips(){
    Util.showTips('暂未开放');
  },
  //去答题页
  toGamePage(){
    Util.showLoading();
    cc.director.loadScene('Game');
  },
  //初始化界面
  renderPage(){
    if(this.isLoged){

    }else{

    }
  },
  //用户点击余额事件
  userClickMoney(){
    
  },
  //显示大推广码弹框
  showBigPrtCode(){
    this.alterBoxLayer.active = true;
    this.prtCode.active = true;
  },
  //关闭大推广码弹框
  hideBigPrtCode(){
    this.alterBoxLayer.active = false;
    this.prtCode.active = false;
  },

  onDestroy(){

  }
});
