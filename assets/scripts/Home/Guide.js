cc.Class({
  extends:cc.Component,
  properties:{
    persistNode:cc.Node
  },
  onLoad(){
    cc.game.addPersistRootNode(this.persistNode);
  },
  //去答题页面
  toGamePage(){
    cc.director.loadScene('Home',()=>{

    });
  },
  //去登录页面
  toLoginPage(){
    cc.director.loadScene('LogIn',()=>{

    });
  },
  onDestroy(){

  }
});
