let Util = require('Util');
let HomeUtil = require('HomeUtil');
cc.Class({
  extends:cc.Component,
  properties:{
    canUseMonet:cc.Label,//可用余额label
    cashNum:cc.EditBox,//提现金额输入框

    descLayer:cc.Node,
    descBox:cc.Node,
    greenPriceLabel:cc.Label,//当前绿能价格
  },
  onLoad(){
    Util.hideLoading();
    this.cashDatas = {
      amt:'',
    };
    this.initPage();
  },
  initPage(){
    HomeUtil.getIndexData().then((res)=>{
      if(!res.success){
        Util.showTips(res.msg);
      }else{
        let obj = res.obj;
        this.canCashMoney = obj.money;
        this.canUseMonet.string = obj.money+"元" ;
      }
    });
  },
  //点击全部提现给输入框赋值
  allCash(){
    let cahsNum = this.canCashMoney;
    // if(cahsNum<10){
    //   Util.showTips('最低提现金额为10元');
    //   return;
    // }
    //调用接口获取市场token
    // HomeUtil.getMarketToken().then((res)=>{
    //   if(!res.success){
    //     Util.showTips(res.msg);
    //   }else{
    //     let token = res.obj.tokenType+' '+res.obj.accessToken;
    //     token = encodeURI(token);
    //     //带参数跳转到市场提现页面
    //     // cc.sys.openURL('http://www.senchen.vip/html/gold-cash.html?link=gold-cash&token='+token+"&gold="+cahsNum);//浏览器会拦截弹框
    //     window.location.href=('http://www.senchen.vip/html/gold-cash.html?link=gold-cash&token='+token+"&gold="+cahsNum);
    //   }
    // });
    this.cashNum.string = cahsNum;
  },
  //返回主页
  backHome(){
    cc.director.loadScene('Home',()=>{

    });
  },
  //去提现
  toCash(){
    let cahsNum = Util.trim(this.cashNum.string+'');
    this.cashDatas.amt = cahsNum;
    if(!cahsNum){
      Util.showTips('请输入提现数额');
      return;
    }else if(isNaN(cahsNum)){
      Util.showTips('提现金额需为数字');
      return;
    }/*else if(cahsNum<=10){
      Util.showTips('最低提现金额为10元');
      return;
    }*/else if(parseInt(this.canCashMoney)<parseInt(this.cashNum.string)){
      Util.showTips('提现金额不能大于总金额');
      return;
    }
    //调用接口获取市场token
    HomeUtil.getMarketToken().then((res)=>{
      if(!res.success){
        Util.showTips(res.msg);
      }else{
        let token = res.obj.tokenType+' '+res.obj.accessToken;
        token = encodeURI(token);
        //带参数跳转到市场提现页面
        // cc.sys.openURL('http://www.senchen.vip/html/gold-cash.html?link=gold-cash&token='+token+"&gold="+cahsNum);//浏览器会拦截弹框
        window.location.href=('http://www.senchen.vip/html/skip-page.html?link=gold-cash&token='+token+"&gold="+cahsNum);
      }
    });
  },

  //获取当前绿能实时价格
  getGreenPrice(){
    HomeUtil.greenPrice().then((res)=>{
      if(!res.success){
        Util.showTips(res.msg);
      }else{
        //绿能价格
        let gPrice = res.obj.quotationInfo.nowPrice;
        this.greenPriceLabel.string = (gPrice/100).toFixed(2)+'元/个'
      }
    });
  },
  //弹出获取更多金币介绍
  showGetMoreGoldBox(){
    this.descLayer.active = true;
    this.descBox.active = true;
    this.getGreenPrice();
  },
  //去z家园游戏
  toZJiaYuanGame(){
    //游客身份直接去游戏
    if(Global.user.isVistor){
      if(!cc.sys.isNative){
        window.location.href = 'http://game.zjiayuan.com'
      }else{
        cc.sys.openURL('http://game.zjiayuan.com');
      }
      return;
    }
    HomeUtil.getMarketToken().then((res)=>{
      if(!res.success){
        if(!cc.sys.isNative){
          window.location.href = 'http://game.zjiayuan.com'
        }else{
          cc.sys.openURL('http://game.zjiayuan.com');
        }
        //Util.showTips(res.msg);
      }else{
        let token = res.obj.tokenType+' '+res.obj.accessToken;
        token = encodeURI(token);
        //带参数跳转到游戏
        if(!cc.sys.isNative){
          window.location.href = 'http://game.zjiayuan.com?fromDati=1&token='+token
        }else{
          cc.sys.openURL('http://game.zjiayuan.com?fromDati=1&token='+token);
        }
      }
    });
  },
  //隐藏获取更多金币介绍
  hideGetMoreGoldBox(){
    this.descLayer.active = false;
    this.descBox.active = false;
  },

  onDestroy(){

  }
});
