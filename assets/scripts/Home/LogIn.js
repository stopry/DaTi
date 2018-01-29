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
      clientId: "098f6bcd4621d373cade4e832627b4f6",
      extAttr: "",
      loginChannel: "",
      userName:'',
      password:''
    };
  },
  //提交登录数据
  subLoginDatas(){
    let act = this.loginDatas.userName = Util.trim(this.account.string);
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
    HomeUtil.toLogIn(this.loginDatas).then((res)=>{
      if(!res.success){
        Util.showTips(res.msg);
      }else{
        let obj = res.obj;
        let token = obj.tokenType+' '+obj.accessToken;
        cc.sys.localStorage.setItem('token',token);
        Util.showTips('登录成功');
        this.toHomePage();
      }
    });
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
