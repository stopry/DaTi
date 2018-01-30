let Util = require('Util');
let HomeUtil = require('HomeUtil');
cc.Class({
  extends:cc.Component,
  properties:{
    alterBoxLayer:cc.Node,//弹框遮罩
    prtCode:cc.Node,//推广码弹框,
    /*初始化显示元素s*/
    chanceNum:cc.Label,//可答题机会
    userHeadImg:cc.Sprite,//用户头像
    userName:cc.Label,//用户姓名
    accountMoney:cc.Label,//账户余额
    smallChanceNum:cc.Label,//答题次数-小
    smallEwmNode:cc.Node,//小二维码node
    bigEwmNode:cc.Node,//大二维码node
    /*初始化显示元素e*/
    /*任务框s*/
    taskBox:cc.Node,
    taskBind:cc.Label,
    taskBindNode:cc.Node,
    taskNew:cc.Label,
    taskNewNode:cc.Node
    /*任务框e*/
  },
  onLoad(){
    cc.log(Global.wxShare);
    cc._initDebugSetting(cc.DebugMode.INFO);
    cc.director.setDisplayStats(false);
    cc.view.resizeWithBrowserSize(true);
    this.promoteLink = 'http://www.qq.com';
    this.isLoged = false;//用户是否登录
    this.isBind = false;//是否是绑定用户
    this.isNewTask = false;//是否完成了新手引导
    this.isCerfa = false;//是否完成了银行卡身份认证
    this.renderPage();
  },
  showTips(){
    Util.showTips('暂未开放');
  },
  //去答题页
  toGamePage(){
    Util.showLoading();
    if(parseInt(this.chanceNum.string)<=0){
      Util.showTips('您的答题次数已用完,请点击下方的获取更多获取答题机会');
      Util.hideLoading();
      return;
    }
    cc.director.loadScene('Game');
  },
  //返回引导页
  backGuidePage(){
    cc.director.loadScene('Guide',()=>{

    });
  },
  //初始化界面
  renderPage(){
    HomeUtil.getIndexData().then((res)=>{
      //cc.log(res);
      if(!res.success){
        Util.showTips(res.msg);
      }else{
        let obj = res.obj;
        this.isLoged = true;
        this.isBind = obj.bindBank!="0";
        this.isNewTask = obj.finishNewbieTask!="0";
        this.isCerfa = obj.certification!="0";

        this.chanceNum.string = obj.qaCnt;
        this.smallChanceNum.string = obj.qaCnt;
        this.accountMoney.string = "¥"+obj.gold;
        this.userName.string = obj.userName;
        Util.getPerNode('PerNode').getComponent('PerNode').datas.userInfo = obj;

        this.promoteLink = 'http://www.qq.com';
        Global.link = this.promoteLink;//改变分享配置的link

        //如果绑定了生成小的推广码
        if(this.isBind){
          this.createSmallQCode();
        }
      }
    });
  },
  //生成小的推广二维码
  createSmallQCode(){
    var qrcode = new QRCode(-1, QRErrorCorrectLevel.H);
    qrcode.addData(this.promoteLink);
    // qrcode.addData('dati');
    qrcode.make();
    var ctx = this.smallEwmNode.getComponent(cc.Graphics);
    ctx.fillColor = cc.Color.BLACK;
    // compute tileW/tileH based on node width and height
    var tileW = this.smallEwmNode.width / qrcode.getModuleCount();
    var tileH = this.smallEwmNode.height / qrcode.getModuleCount();
    // draw in the Graphics
    for (var row = 0; row < qrcode.getModuleCount(); row++) {
      for (var col = 0; col < qrcode.getModuleCount(); col++) {
        if (qrcode.isDark(row, col)) {
          // ctx.fillColor = cc.Color.BLACK;
          var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
          var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
          ctx.rect(Math.round(col * tileW), Math.round(row * tileH), w, h);
          ctx.fill();
        } else {
          // ctx.fillColor = cc.Color.WHITE;
        }
        var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
        // var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
        // ctx.rect(Math.round(col * tileW), Math.round(row * tileH), w, h);
        // ctx.fill();
      }
    }
  },
  //生成大的推广二维码
  createBigQCode(){
    var qrcode = new QRCode(-1, QRErrorCorrectLevel.H);
    qrcode.addData(this.promoteLink);
    qrcode.make();

    var ctx = this.bigEwmNode.getComponent(cc.Graphics);
    ctx.fillColor = cc.Color.BLACK;
    // compute tileW/tileH based on node width and height
    var tileW = this.bigEwmNode.width / qrcode.getModuleCount();
    var tileH = this.bigEwmNode.height / qrcode.getModuleCount();

    for (var row = 0; row < qrcode.getModuleCount(); row++) {
      for (var col = 0; col < qrcode.getModuleCount(); col++) {
        if (qrcode.isDark(row, col)) {
          // ctx.fillColor = cc.Color.BLACK;
          var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
          var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
          ctx.rect(Math.round(col * tileW), Math.round(row * tileH), w, h);
          ctx.fill();
        } else {
          // ctx.fillColor = cc.Color.WHITE;
        }
        var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
      }
    }
  },
  //点击用户头像事件
  userClickHeadImg(){
    if(this.isLoged) return;
    cc.director.loadScene('LogIn',()=>{

    });
  },
  //用户点击余额事件
  userClickMoney(){
    //检测任务是否完成-没有完成
    if(!this.isBind||!this.isNewTask){
      if(!this.isBind){
        this.taskBind.string = '绑定银行卡完善个人信息(0/1)';
        this.taskBindNode.setColor(cc.color(153, 154, 156, 255));
      }
      if(!this.isNewTask){
        this.taskNew.string = '完成游戏新手引导(0/1)';
        this.taskNewNode.setColor(cc.color(153, 154, 156, 255));
      }
      if(this.isBind){
        this.taskBind.string = '绑定银行卡完善个人信息(1/1)';
        this.taskBindNode.setColor(cc.color(46, 65, 132, 255));
      }
      if(this.isNewTask){
        this.taskNew.string = '完成游戏新手引导(1/1)';
        this.taskNewNode.setColor(cc.color(46, 65, 132, 255));
      }
      this.showTaskBox();
    }

    //如果已经完成了任务-跳转至提现页
    if(this.isBind&&this.isNewTask){
      cc.director.loadScene('Cash',()=>{

      });
    }

  },
  //显示任务框
  showTaskBox(){
    this.alterBoxLayer.active = true;
    this.taskBox.active = true;
  },
  //关闭任务框
  hideTaskBox(){
    this.alterBoxLayer.active = false;
    this.taskBox.active = false;
  },
  //去绑定信息-任务中打开绑定页面
  openBindPage(){
    if(!this.isBind){
      this.hideTaskBox();
      this.getComponent('Bind').openBindBox();
    }else{
      Util.showTips('您已经绑定过身份');
    }
  },
  //去游戏中完成新手引导
  toGameGuide(){
    if(!this.isNewTask){
      if(!this.isBind){
        Util.showTips('绑定银行卡完善身份信息后才可进行游戏新手引导');
        return;
      }
      //调用接口获取市场token
      HomeUtil.getMarketToken().then((res)=>{
        if(!res.success){
          Util.showTips(res.msg);
        }else{
          let token = res.obj.tokenType+' '+res.obj.accessToken;
          token = encodeURI(token);
          //带参数跳转到游戏
          cc.sys.openURL('http://www.zjiayuan.com?fromDati=1&token='+token);
        }
      });
    }else{
      Util.showTips('您已经完成过游戏新手引导');
    }
  },
  //显示大推广码弹框
  showBigPrtCode(){
    //如果用户没有绑定
    if(!this.isBind){
      Util.showTips('绑定身份后才有推广码');
      return;
    }
    this.createBigQCode();
    this.alterBoxLayer.active = true;
    this.prtCode.active = true;
  },
  //关闭大推广码弹框
  hideBigPrtCode(){
    this.alterBoxLayer.active = false;
    this.prtCode.active = false;
  },
  //去邀请好友界面
  toInvitePage(){
    cc.director.loadScene('Invite',()=>{

    });
  },
  onDestroy(){

  }
});
