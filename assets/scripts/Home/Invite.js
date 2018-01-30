let Util = require('Util');
let HomeUtil = require('HomeUtil');
cc.Class({
  extends:cc.Component,
  properties:{
    chanceCardNum:cc.Label,//答题卡数量
    tipsNode:cc.Node,//提示node
  },
  onLoad(){
    this.initPage();
  },
  //邀请好友-提示点击右上角
  inviteFriends(){
    if(Util.checkEquipment=='WX'){
      this.showShareTip();
    }else{
      Util.showTips('请在微信中打开进行分享,或在首页中点击二维码截屏后发送给好友');
    }
  },
  hideShareTip(){
    this.tipsNode.active = false;
  },
  showShareTip(){
    this.tipsNode.active = true;
  },
  initPage(){
    HomeUtil.getIndexData().then((res)=>{
      if(!res.success){
        Util.showTips(res.msg);
      }else{
        let nums = res.obj.qaCnt;
        this.chanceCardNum.string = 'x '+nums;
      }
    });
  },
  //返回主界面
  backHome(){
    cc.director.loadScene('Home',()=>{

    });
  },
  onDestroy(){

  }
});
