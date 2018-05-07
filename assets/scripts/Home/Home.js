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
    taskNewNode:cc.Node,
    /*任务框e*/
    activeDesc:cc.Node,
    activeLayer:cc.Node,

    /*获取金币弹框*/
    descLayer:cc.Node,
    descBox:cc.Node,
    greenPriceLabel:cc.Label,//当前绿能价格
    //PageView
    pageView:cc.PageView
  },
  onLoad(){
    this.isVisitor = true;
    Util.hideLoading();
    //cc.log(Global.wxShare);
    //cc._initDebugSetting(cc.DebugMode.INFO);
    cc.director.setDisplayStats(false);
    cc.view.resizeWithBrowserSize(true);
    this.promoteLink = !cc.sys.isNative?window.location.origin:'http://www.zjiayuan.com';
    this.isLoged = false;//用户是否登录
    this.isBind = false;//是否是绑定用户
    this.isNewTask = false;//是否完成了新手引导
    this.isCerfa = false;//是否完成了银行卡身份认证
    this.renderPage();
    this.backFreshTask();
  },
  start(){
    if(Global.isFormCash){
      Global.isFormCash = false;
      this.showTaskBox();
    }
    this.autoPlay();
  },
  //pageView自动滚动
  autoPlay(){
    this.schedule(() => {
      //一共多少页
      let count = this.pageView.getPages().length;
      //console.log(count,'pageView');//2
      //取当前页下序号
      let index = this.pageView.getCurrentPageIndex();
      //console.log(index,'index');//1
      //为最后一页，index为0，否则+1
      index = index+1 >= count ? 0 : index + 1;
      //执行切换
      this.pageView.scrollToPage(index, 5);
    }, 8);   //10秒一换
  },
  showTips(){
    Util.showTips('暂未开放,敬请期待!');
  },
  //去答题页
  toGamePage(){
    Util.showLoading();
    if(parseInt(this.chanceNum.string)<=0){
      Util.showConDia('您的答题次数已用完',()=>{
        // cc.director.loadScene('Invite');
      },()=>{});

      //Util.showTips('您的已用完,请点击下方的获取更多获取答题机会');
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
  renderPage(bool){
    console.log();
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

        this.chanceNum.string = obj.singleCnt+obj.singleFreeCnt;
        this.smallChanceNum.string = obj.singleCnt+obj.singleFreeCnt;
        this.accountMoney.string = '￥'+obj.money;
        this.userName.string = obj.userName;
        Util.getPerNode('PerNode').getComponent('PerNode').datas.userInfo = obj;

        this.promoteLink = !cc.sys.isNative?window.location.origin+"/?sid="+obj.playerId:'http://game.zjiayuan.com';
        //改变分享配置的link
        Global.wxShare.link = this.promoteLink;
        //将推广链接存到本地
        cc.sys.localStorage.setItem('prtLink',this.promoteLink);
        cc.sys.localStorage.setItem('prtCode',obj.playerId);
        Global.user.isVistor = cc.sys.localStorage.getItem('prtCode')==0;
        if(obj.playerId!=0){
          this.isVisitor = false;
        }
        //如果绑定了生成小的推广码
        // if(this.isBind){
          // this.createSmallQCode();
        // }
        if(bool){
          this.freshTaskProcess(1);
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
  //打开活动介绍
  openActiveDesc(){
    this.activeDesc.active = true;
    this.activeLayer.active = true;
  },
  closeActiveDesc(){
    this.activeDesc.active = false;
    this.activeLayer.active = false;
  },
  //关闭活动介绍
  //点击用户头像事件
  userClickHeadImg(){
    if(this.isLoged) return;
    cc.director.loadScene('LogIn',()=>{

    });
  },
  //我要提现按钮
  toCash(){
    if(!this.isBind||!this.isNewTask){
      Util.showConDia('您还有未完成的任务,请点击确定去完成任务后再进行提现.',()=>{
        this.userClickMoney();
      },()=>{});
    }else{
      this.userClickMoney();
    }
  },
  //刷新任务进度
  freshTaskProcess(bool){
    //检测任务是否完成-没有完成
    if(!this.isBind||!this.isNewTask){
      if(!this.isBind){
        this.taskBind.string = '绑定账号(0/1)';
        this.taskBindNode.setColor(cc.color(153, 154, 156, 255));
      }
      if(!this.isNewTask){
        this.taskNew.string = '完成游戏新手引导(0/1)';
        this.taskNewNode.setColor(cc.color(153, 154, 156, 255));
      }
      if(this.isBind){
        this.taskBind.string = '绑定账号(1/1)';
        this.taskBindNode.setColor(cc.color(46, 65, 132, 255));
      }
      if(this.isNewTask){
        this.taskNew.string = '完成游戏新手引导(1/1)';
        this.taskNewNode.setColor(cc.color(46, 65, 132, 255));
      }
      if(!bool){
        this.showTaskBox();
      }
    }
  },
  //用户点击余额事件
  userClickMoney(){
    this.freshTaskProcess();
    //如果已经完成了任务-跳转至提现页
    if(this.isBind&&this.isNewTask){
      Util.showLoading();
      cc.director.loadScene('Cash',()=>{

      });
    }
  },
  //用户返回刷新任务进度
  backFreshTask(){
    cc.game.on(cc.game.EVENT_SHOW,()=>{
      this.renderPage(1);
    });
  },
  //去官网了解答题信息内容
  toKnowActiveDetail(){
    if(!cc.sys.isNative){
        if(cc.sys.isMobile){//手机端
          window.location.href = 'http://wap.zjiayuan.com/html/rmhd/bwdt.html';
        }else{//电脑端
          window.location.href = 'http://web.zjiayuan.com/html/rmhd/bwdt.html';
        }
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
  //进入市场实名认证页面
  toNameAuth(){
    HomeUtil.getMarketToken().then((res)=>{
      if(!res.success){
        Util.showTips(res.msg);
      }else{
        let token = res.obj.tokenType+' '+res.obj.accessToken;
        token = encodeURI(token);
        window.location.href=('http://www.senchen.vip/html/skip-page.html?link=name-auth&token='+token);
      }
    });
  },
  //去绑定信息-任务中打开绑定页面
  openBindPage(){
    if(!this.isBind){
      this.hideTaskBox();
      //不是游客跳到市场绑定身份
      if(!this.isVisitor){
        //调用接口获取市场token
        this.toNameAuth();
      }else{
        this.getComponent('Bind').openBindBox();
      }
    }else{
      Util.showTips('您已经绑定过身份');
    }
  },
  //去Z家园游戏
  toZJiaYuanGame(alw){
    alw = alw||null;
    HomeUtil.getMarketToken().then((res)=>{
      if(!res.success){
        if(alw){
          if(!cc.sys.isNative){
            window.location.href= 'http://game.zjiayuan.com';
          }else{
            cc.sys.openURL('http://game.zjiayuan.com');
          }
        }
        Util.showTips(res.msg);
      }else{
        let token = res.obj.tokenType+' '+res.obj.accessToken;
        token = encodeURI(token);
        //带参数跳转到游戏
        if(!cc.sys.isNative){
          window.location.href = 'http://game.zjiayuan.com?fromDati=1&token='+token;
        }else{
          cc.sys.openURL('http://game.zjiayuan.com?fromDati=1&token='+token);
        }

      }
    });
  },
  //点击banner 进入z家园游戏
  //clickBanner(){
  //  this.toZJiaYuanGame(1);
  //},
  //去游戏中完成新手引导
  toGameGuide(){
    if(!this.isNewTask){
      if(!this.isBind){
        Util.showTips('绑定银行卡完善身份信息后才可进行游戏新手引导');
        return;
      }
      //调用接口获取市场token
      this.toZJiaYuanGame();
    }else{
      Util.showTips('您已经完成过游戏新手引导');
    }
  },
  //显示大推广码弹框
  showBigPrtCode(){
    //如果用户没有绑定
    if(!this.isBind){
      Util.showConDia('绑定身份后才有推广码,点击确定去绑定身份.',()=>{
        this.openBindPage();
      },()=>{});
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
    Util.showLoading();
    cc.director.loadScene('Invite',()=>{

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
  toZJiaYuanGameAll(){
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
