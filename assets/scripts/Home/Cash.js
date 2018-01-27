let Util = require('Util');
let HomeUtil = require('HomeUtil');
cc.Class({
  extends:cc.Component,
  properties:{
    cashNum:cc.EditBox
  },
  onLoad(){
    this.cashDatas = {
      amt:'',
    };
  },
  //去提现
  toCash(){
    let cahsNum = Util.trim(this.cashNum.string);
    this.cashDatas.amt = cahsNum;
    if(!cahsNum){
      Util.showTips('请输入提现数额');
      return;
    }else if(isNaN(cahsNum)){
      Util.showTips('提现金额需为数字');
      return;
    }else if(cahsNum<=0){
      Util.showTips('提现金额需大于零');
      return;
    }
    return;
    HomeUtil.toCash(this.cashDatas).then((res)=>{

    });
  },
  onDestroy(){

  }
});
