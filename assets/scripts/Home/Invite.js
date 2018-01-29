let Util = require('Util');

cc.Class({
  extends:cc.Component,
  properties:{
    chanceCardNum:cc.Label,//答题卡数量
  },
  onLoad(){
    this.initPage();
  },
  //邀请好友
  inviteFriends(){
    Util.showTips('邀请成功');
  },
  initPage(){
    this.chanceCardNum.string = 'x 0';
  },
  //返回主界面
  backHome(){
    cc.director.loadScene('Home',()=>{

    });
  },
  onDestroy(){

  }
});
