let GameUtil = require('GameUtil');
let Util = require('Util');
cc.Class({
  extends:cc.Component,
  properties:{
    /*准备界面s*/
    pPage:cc.Node,//倒计时界面
    pUserPic:cc.Sprite,//用户头像
    pUserName:cc.Label,//用户姓名
    pUserCity:cc.Label,//用户地区
    pCountNode:cc.Node,//旋转动画
    pCountTime:cc.Label,//倒计时时间
    /*准备界面e*/
    userHeadPic:cc.Sprite,//用户头像
    userName:cc.Label,//用户名
    quesNo:cc.Label,//题目序号
    countDownBar:cc.ProgressBar,//倒计时进度条
    countDownNum:cc.Label,//倒计时label
    pointsNode:cc.Node,//连续得分动画node
    pointsText:cc.RichText,//连续得分数量
    score:cc.Label,//当前积分
    scoreProgress:cc.ProgressBar,//积分进度条
    quesCon:cc.Label,//题目内容
    quesConNode:cc.Node,//题目内容容器
    quesOptions:{//4个答案选项
      default:[],
      type:cc.Node
    },
    btnStatusBg:{//选项按钮状态背景图
      default:[],
      type:cc.SpriteFrame
    },
    btnStatusIcon:{//选项按钮状态icon
      default:[],
      type:cc.SpriteFrame
    },
    /*动画Node s*/
    quesBox:cc.Node,//题目框
    quesNoBox:cc.Node,//题目序号框;
    /*动画Node e*/
  },
  onLoad(){
    Util.hideLoading();
    //用户id
    this.userId = '10086';
    //定时器
    this.inter_val = null;
    //倒计时时间 10s钟
    this.timer = 10;
    //总积分
    this.totalScore = 1100;
    //题目序号 默认1
    this.quesNumber = 1;
    //题目编号
    this.quesID = null;
    //当前题目标题
    this.quesTitle = '';
    //用户选择的答案文本
    this.userSeldAws = '';
    //连续答对次数
    this.ctnTureNum = 0;
    //是否到了最后一题 第十题
    this.isLastQues = false;
    //用户答题状态
    this.user = {
      isBegin : false,//是否开始
      isAnsing:false,//是否正在答题
      isEnd:false,//是否结束
      canSel:false,//选项是否可以选择
      isTimeOut:false,//是否回答超时
    };
    this.createDatas();
    this.preCountDown();
    this.pUserName.string = this.userName.string = Util.getPerNode('PerNode').getComponent('PerNode').datas.userInfo.userName;
  },
  createDatas(){
    this.virDatas = {
      titile:'初始化中...',
      options:[
        '初始化中...',
        '初始化中...',
        '初始化中...',
        '初始化中...'
      ],
      preStatus:1,//0 1 2 错误 正确 超时 -上题状态
      preTrueAws:'空',//上题正确答案 答案文本;
      preScore:0,//上题获得积分
      allScore:0,//总积分
      quesNo:1,//题目序号
    }
  },
  //初始化界面
  initPage(){
    cc._initDebugSetting(cc.DebugMode.INFO);
    cc.director.setDisplayStats(false);
    cc.view.resizeWithBrowserSize(true);
    this.startCountDown();
    this.selOption();
  },
  //开始倒计时
  startCountDown(){
    this.fillQues();
    this.user.isBegin = true;
    this.user.canSel = true;
    this.user.isTimeOut = false;
    this.timer = 10;
    let i = 1;
    this.countDownNum.string = this.timer;
    this.countDownBar.progress = i;
    this.inter_val = setInterval(()=>{
      i-=0.1;
      this.timer--;
      this.countDownNum.string = this.timer;
      this.countDownBar.progress = i;
      if(this.timer<=0){//如果超时
        clearInterval(this.inter_val);
        this.user.isTimeOut = true;
        this.user.canSel = false;

        //let uid = this.userId;
        let title = this.quesCon.string;
        let answer = '';
        let subDatas = {
          //userId:uid,
          title:title,
          answer:answer
        };
        this.sendOption(subDatas);//超时提交空答案
      }
    },1000);
  },
  //填充题目
  fillQues(){
    this.isLastQues = this.virDatas.quesNo>=10;
    this.quesCon.string = this.virDatas.titile;
    for(let i = 0;i<4;i++){
      GameUtil.changBtnStatus(this.quesOptions[i],1,this.btnStatusBg,this.btnStatusIcon);
      this.quesOptions[i].getChildByName('optionCon').getComponent(cc.Label).string = this.virDatas.options[i];
    }
    this.quesNo.string = "第"+this.virDatas.quesNo+"题";
  },
  //重置题目
  resetQues(){
    this.quesCon.string = '';
    for(let i = 0;i<4;i++){
      GameUtil.changBtnStatus(this.quesOptions[i],1,this.btnStatusBg,this.btnStatusIcon);
      this.quesOptions[i].getChildByName('optionCon').getComponent(cc.Label).string = '';
    }
  },
  //提交答案 同时处理题目回答情况
  sendOption(datas){
    GameUtil.sendQuesOption(datas).then((res)=>{
      if(!res.success){
        Util.showTips(res.msg);
      }else{
        let obj = res.obj;
        this.virDatas.titile = obj.question.title;
        this.quesTitle = obj.question.title;
        for(let i = 0;i<obj.question.options.length;i++){
          this.virDatas.options[i] = obj.question.options[i];
        }
        this.virDatas.quesNo = obj.seq;
        this.virDatas.preTrueAws = obj.answer;//上一题答案

        //上一题结果
        if(obj.result==1){//正确
          this.virDatas.preStatus = 1
        }else if(obj.result==2){//错误
          this.virDatas.preStatus = 0
        }else if(obj.result==3){//超时
          this.virDatas.preStatus = 2
        }

        this.virDatas.preScore = obj.point;//上一题得分
        this.virDatas.allScore = obj.totalPoint;//总得分

        //到最后一题 在常驻节点存放答题结果信息
        if(this.isLastQues){
          Util.getPerNode('PerNode').getComponent('PerNode').datas.quesResult = {
            gold:obj.gold,
            totalPoint:obj.totalPoint
          };
        }

        this.quesAwsResolve(this.virDatas);

      }
    });

  },
  //题目结果处理
  quesAwsResolve(results){
    //正确答案按钮
    let susBtn = GameUtil.getBtnByAws(results.preTrueAws,this.quesOptions);
    //results.preStatus = Util.getRandInt(0,2);//随机对错
    if(results.preStatus==0){//回答错误
      this.ctnTureNum = 0;
      let errorBtn = GameUtil.getBtnByAws(this.userSeldAws,this.quesOptions);
      GameUtil.changBtnStatus(susBtn,3,this.btnStatusBg,this.btnStatusIcon);
      GameUtil.changBtnStatus(errorBtn,4,this.btnStatusBg,this.btnStatusIcon);
    }else if(results.preStatus==1){//回答正确
      this.ctnTureNum++;
      //播放连击动画
      this.pointsText.string
        =
        '<color=#ffffff><outline color=#fedd00 width=3>X'+this.ctnTureNum+'</outline></c>';
      this.pointsNode.getComponent(cc.Animation).play('points');
      GameUtil.changBtnStatus(susBtn,3,this.btnStatusBg,this.btnStatusIcon);
    }else if(results.preStatus==2){//回答超时
      this.ctnTureNum = 0;
      GameUtil.changBtnStatus(susBtn,3,this.btnStatusBg,this.btnStatusIcon);
    }
    //设置得分情况-添加动画效果
    let bScore = parseInt(this.score.string);//当前分数+
    //this.score.string = this.virDatas.allScore;
    GameUtil.AddScoreAni(this.score,bScore,this.virDatas.allScore,1);
    GameUtil.AddScoreProAni(this.scoreProgress,bScore,this.virDatas.allScore);
    //this.scoreProgress.progress = this.virDatas.allScore/this.totalScore;
    //清除定时器
    clearInterval(this.inter_val);
    if(this.isLastQues){//如果是最后一题 - 跳转到结算页面
      setTimeout(()=>{
        cc.director.loadScene('Done');
      },2000);
      return
    };
    //1s后播放题目隐藏动画
    setTimeout(()=>{
      this.quesBox.getComponent(cc.Animation).play('quesHide');
      this.quesNoBox.getComponent(cc.Animation).play('quesNoHide');
    },2000);
    //2s填充新题目
    setTimeout(()=>{
      this.quesConNode.active = false;
      this.fillQues();
    },2500);
    //3s后播放题目显示动画
    setTimeout(()=>{
      this.quesBox.getComponent(cc.Animation).play('quesShow');
      this.quesNoBox.getComponent(cc.Animation).play('quesNoShow');
      this.quesConNode.active = true;
    },2800);
    //4s开始答题 进入到下一题
    setTimeout(()=>{
      this.startCountDown();
    },3000);
  },
  //设置按钮选项选择状态
  selOption(){
    ![].forEach.call(this.quesOptions,(item)=>{
      item.on(cc.Node.EventType.TOUCH_END,(event)=>{
        if(!this.user.canSel) return;
        GameUtil.changBtnStatus(item,3,this.btnStatusBg,this.btnStatusIcon);//改变按钮状态为已选择状态
        //给用户选择的答案赋值
        this.userSeldAws = item.getChildByName('optionCon').getComponent(cc.Label).string;
        this.user.canSel = false;

        let uid = this.userId;
        let title = this.quesCon.string;
        let answer = this.userSeldAws;
        let subDatas = {
          userId:uid,
          title:title,
          answer:answer
        };
        this.sendOption(subDatas);
      });
    });
  },
  //开始答题
  startQues(){
    GameUtil.startQues().then((res)=>{
      if(!res.success){
        Util.showTips(res.msg);
      }else{
        let obj = res.obj;
        this.virDatas.titile = obj.question.title;
        this.quesTitle = obj.question.title;
        for(let i = 0;i<obj.question.options.length;i++){
          this.virDatas.options[i] = obj.question.options[i];
        }
        this.virDatas.quesNo = obj.seq;
        this.initPage();
        this.pPage.active = false;
      }
    });
  },
  //答题前准备倒计时
  preCountDown(){
    this.pCountNode.getComponent(cc.Animation).play('preCount');
    let _time = 3;
    this.pCountTime.string = _time;
    this.pCountDown = setInterval(()=>{
      _time--;
      this.pCountTime.string = _time;
      if(_time<=0){
        clearInterval(this.pCountDown);
        setTimeout(()=>{
          this.startQues();
        },200);
      }
    },1000);
  },
  //返回主页
  backHome(){
    Util.showConDia('您正在答题,退出将会失去本次答题机会,确定退出吗?',()=>{
      cc.director.loadScene('Home');
    },()=>{});
  },
  onDestroy(){
    if(this.inter_val){
      clearInterval(this.inter_val);
    }
    if(this.pCountDown){
      clearInterval(this.pCountDown);
    }
  },
});
