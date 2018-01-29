let Net = require('Net');
const GameUtil = (function () {
  let gu = {};
  //开始答题
  let startUrl = '/question/start';
  gu.startQues = function(datas){
    let prs = new Promise((resolve,reject)=>{
      Net.get(startUrl,1,datas,(res)=>{
        resolve(res);
      },(err)=>{
        reject(false);
      });
    });
    return prs;
  };

  //提交题目编号和选择答案
  let sendQuesOptionUrl = '/question/qa';
  gu.sendQuesOption = function (datas) {
    let prs = new Promise((resolve,reject)=>{
      Net.post(sendQuesOptionUrl,1,datas,(res)=>{
        resolve(res);
      },(err)=>{
        reject(false);
      });
    });
    return prs;
  };

  //改变按钮状态
  /**
   * @btn 需要改变状态的按钮
   * @status 按钮状态
   * 1 默认状态未选中(初始化状态)
   * 2 选中状态
   * 3 正确状态
   * 4 错误状态
   * @btnStatusBg 背景状态图列表
   * @btnStatusIcon icon状态图列表
   * @iconNode iconNode
  * */
  /*
  *
  * */
  gu.changBtnStatus = function (btn,status,btnStatusBg,btnStatusIcon) {
    let bg = null,icon = null;
    if(status==1){//初始状态
      bg = btnStatusBg[0];
      btn.getChildByName('t_icon').active = false;
    }else if(status==2){//选中状态
      bg = btnStatusBg[1];
      btn.getChildByName('t_icon').active = false;
    }else if(status==3){//选择正确状态
      bg = btnStatusBg[1];
      btn.getChildByName('t_icon').active = true;
      icon = btnStatusIcon[0];
    }else if(status==4){//选择错误状态
      bg = btnStatusBg[2];
      btn.getChildByName('t_icon').active = true;
      icon = btnStatusIcon[1];
    }
    btn.getComponent(cc.Sprite).spriteFrame = bg;
    btn.getChildByName('t_icon').getComponent(cc.Sprite).spriteFrame = icon;
  };

  //通过问题答案文本 得到正确答案依附的那个按钮
  gu.getBtnByAws = function(awsText,options){
    let resultBtn = null;
    for(let i = 0;i<4;i++){
      let text = options[i].getChildByName('optionCon').getComponent(cc.Label).string;
      if(awsText==text){
        resultBtn = options[i];
        break;
      }
    };
    return resultBtn||options[0];
  };
  //倒计时Ns执行一个方法
  gu.actionTimeOut = function(fun,time){
    time = time||2*1000;//2s
    setTimeout(()=>{
      fun();
    },time);
  };
  //加分动画效果
  /**
   * @label 文字载体label
   * @bScore 当前分
   * @eScore 加分后分
   * @isBig 是否加大字体
   * */
  gu.AddScoreAni = function(label,bScore,eScore,isBig){
    isBig = isBig||false;
    if(isBig){
      label.fontSize = 30;
    }
    let interVal = setInterval(()=>{
      bScore++;
      if(bScore>=eScore){
        bScore = eScore;
        clearInterval(interVal);
        label.fontSize = 20;
      }
      label.string = bScore;
    },5);
  };
  //进度条增长动画效果
  gu.AddScoreProAni = function(process,bScore,eScore){
    let interVal = setInterval(()=>{
      bScore++;
      if(bScore>=eScore){
        bScore = eScore;
        clearInterval(interVal);
      }
      process.progress = bScore/1100;
    },5);
  };
  return gu;
})();

module.exports = GameUtil;
