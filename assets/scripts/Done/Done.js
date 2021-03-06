let Util = require('Util');
let HomeUtil = require('HomeUtil');
cc.Class({
  extends:cc.Component,
  properties:{
    score:cc.Label,//获得积分
    money:cc.Label,//获得奖金
    resultIcon:cc.Sprite,//结果图标
    iconNode:cc.Node,//奖杯node
    resultPic:[cc.SpriteFrame],//结果图片
    descLayer:cc.Node,
    descBox:cc.Node,
    greenPriceLabel:cc.Label,//当前绿能价格
  },
  onLoad(){
    Util.hideLoading();
    this.result = {
      status:0,// 挑战结果 0 1 失败 成功
      score:0,//获得积分
      money:0,//获取奖金
    };
    this.initPage();
  },
  initPage(){
    let info = Util.getPerNode('PerNode').getComponent('PerNode').datas.quesResult;
    this.result.status = info.totalPoint>0?1:0;
    this.result.score = info.totalPoint;
    this.result.money = info.gold;
    this.score.string = "获得积分："+this.result.score;
    this.money.string = this.result.money+'金币';
    this.resultIcon.spriteFrame = this.resultPic[this.result.status];
    //挑战成功播放奖杯动画
    if(this.result.status){
      this.iconNode.getComponent(cc.Animation).play('quesWin');
    }
  },
  //返回主页
  backHome(){
    cc.director.loadScene('Home');
  },
  //继续挑战
  continuePlay(){
    //获取可用挑战次数
    HomeUtil.getIndexData().then((res)=>{
      if(!res.success){
        Util.showTips(res.msg);
      }else{
        let obj = res.obj;
        let chance = obj.singleCnt+obj.singleFreeCnt;
        if(chance<=0){
          Util.showConDia('您的答题次数已用完.',()=>{
            cc.director.loadScene('Invite');
          },()=>{});
          Util.showTips('您的答题次数已用完');
          return;
        }
        //去game界面
        cc.director.loadScene('Game',()=>{

        });
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
  //去提现-跳转至提现场景
  toCash(){
    //查看是否绑定了银行卡
    HomeUtil.getIndexData().then((res)=>{
      if(!res.success){
        Util.showTips(res.msg);
      }else{
        let obj = res.obj;
        let bindBank = obj.bindBank!="0";
        let isNewTask = obj.finishNewbieTask!="0";
        if(!bindBank||!isNewTask){
          Util.showConDia('您尚有未完成的任务,请点击确定去完成剩余任务.',()=>{
            Global.isFormCash = true;
            cc.director.loadScene('Home');
          },()=>{});
          //Util.showTips('您尚未完成任务,请返回首页点击余额区域查看');
          return;
        }
        //去Cash界面
        cc.director.loadScene('Cash',()=>{

        });
      }
    });
  },
  onDestroy(){

  }
});
