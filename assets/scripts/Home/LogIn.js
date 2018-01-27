//用户登录
let Util = require('Util');
let HomeUtil = require('HomeUtil');
cc.Class({
  extends:cc.Component,
  properties:{
    account:cc.EditBox,//登录账号
    password:cc.EditBox,//登录密码
  },
  onLoad(){
    this.loginDatas = {
      account:'',
      password:''
    };
  },
  //提交登录数据
  subLoginDatas(){
    let act = this.loginDatas.account = Util.trim(this.account.string);
    let pwd = this.loginDatas.password = Util.trim(this.password.string);
    if(!act){
      Util.showTips('请输入用户名');
      return;
    }else if(!Util.verMobileReg(act)){
      Util.showTips('用户名为手机号');
      return;
    }else if(!pwd){
      Util.showTips('请输入登录密码');
      return;
    }
    this.toHomePage();
    return;
    //HomeUtil.toLogIn(this.loginDatas).then((res)=>{
    //
    //});
  },
  /*去主页面*/
  toHomePage(){
    cc.director.loadScene('Home',()=>{

    });
  },
  //返回引导页
  backGuidePage(){
    cc.director.loadScene('Guide',()=>{

    });
  },
  onDestroy(){

  }
});
