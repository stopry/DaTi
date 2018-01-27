//用户绑定
let Util = require('Util');
let HomeUtil = require('HomeUtil');
cc.Class({
  extends:cc.Component,
  properties:{
    /*用户绑定数据s*/
    mobile:cc.EditBox,//手机号
    msgCode:cc.EditBox,
    password:cc.EditBox,
    uName:cc.EditBox,//用户真实名
    bankName:cc.Label,//绑定银行名称
    bankCard:cc.EditBox,//绑定银行卡号
    idCard:cc.EditBox,//身份证号
    /*用户绑定数据e*/
    alterBoxLayer:cc.Node,//弹框遮罩
    bankNameNode:cc.Node,
    /*绑定弹框s*/
    bindBox:cc.Node,
    /*绑定弹框e*/

    /*银行列表弹框s*/
    bankListBox:cc.Node,//银行列表框
    backListBoxLayer:cc.Node,//银行列表弹框遮罩
    /*银行列表弹框e*/
    bankList:{//银行列表
      default:[],
      type:cc.Node
    }
  },
  onLoad(){
    //用户绑定数据
    this.bindDatas = {
      mobile:'',
      msgCode:'',
      password:'',
      uName:'',
      bankName:'',
      bankCard:'',
      idCard:'',
    };
    this.selBank();
  },
  //小提示
  showLittleTip(str){//显示提示
    Util.showTips(str);
  },
  //显示关闭绑定弹框
  openBindBox(){
    this.alterBoxLayer.active = true;
    this.bindBox.active = true;
  },
  closeBindBox(){
    this.alterBoxLayer.active = false;
    this.bindBox.active = false;
  },
  //获取短信验证码
  getMsgCode(){

  },
  //打开关闭选择银行框
  openSelBankBox(){
    this.backListBoxLayer.active = true;
    this.bankListBox.active = true;
  },
  closeSelBankBox(){
    this.backListBoxLayer.active = false;
    this.bankListBox.active = false;
  },
  //选择银行
  selBank(){
    ![].forEach.call(this.bankList,(bank)=>{
      bank.on(cc.Node.EventType.TOUCH_END,(event)=>{
        let bankName = bank.getChildByName('bankName').getComponent(cc.Label).string;
        this.closeSelBankBox();
        this.bankNameNode.setColor(cc.color(0, 0, 0, 255));
        this.bankName.string = bankName;
      });
    });
  },
  getBindDatas(){//得到用户绑定输入的数据
    this.bindDatas.mobile = Util.trim(this.mobile.string);
    this.bindDatas.msgCode = Util.trim(this.msgCode.string);
    this.bindDatas.password = Util.trim(this.password.string);
    this.bindDatas.uName = Util.trim(this.uName.string);
    this.bindDatas.bankName = Util.trim(this.bankName.string);
    this.bindDatas.bankCard = Util.trim(this.bankCard.string);
    this.bindDatas.idCard = Util.trim(this.idCard.string);
  },
  //提交绑定数据
  submitBindDatas(){
    this.getBindDatas();
    let mobile = this.bindDatas.mobile;
    let msgCode = this.bindDatas.msgCode;
    let password = this.bindDatas.password;
    let uName = this.bindDatas.uName;
    let bankName = this.bindDatas.bankName;
    let bankCard = this.bindDatas.bankCard;
    let idCard = this.bindDatas.idCard;

    if(!mobile){
      this.showLittleTip('请输入手机号');
      return;
    }else if(!Util.verMobileReg(mobile)){
      this.showLittleTip('手机号格式有误');
      return;
    }else if(!msgCode){
      this.showLittleTip('请输入短信验证码');
      return;
    }else if(!password){
      this.showLittleTip('请输入密码');
      return;
    }else if(!uName){
      this.showLittleTip('请输入您的姓名');
      return;
    }else if(!Util.verUserName(uName)||uName.length<=1||uName.length>5){
      this.showLittleTip('你输入的姓名不合法');
      return;
    }else if(!bankName){
      this.showLittleTip('请输入银行名称');
      return;
    }else if(!bankCard){
      this.showLittleTip('请输入银行卡号');
      return;
    }else if(!Util.verBankCard(bankCard)){
      this.showLittleTip('银行卡号无效');
      return;
    }else if(!idCard){
      this.showLittleTip('请输入身份证号');
      return;
    }else if(!Util.verIdCard(idCard)){
      this.showLittleTip('请输入正确格式身份证号');
      return;
    }

    HomeUtil.subBindData(this.bindDatas).then((res)=>{
      console.log(res);
    });
  },
  onDestroy(){

  }
});
