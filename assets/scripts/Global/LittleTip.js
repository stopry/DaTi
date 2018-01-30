cc.Class({
    extends: cc.Component,

    properties: {
        tipPrefab:{//提示框预制资源
            default:null,
            type:cc.Prefab
        },
        root:{//根节点
            default:null,
            type:cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        this.root = cc.find('Canvas');
    },
    setContent:function(str){//设置提示内容
        var _little = cc.instantiate(this.tipPrefab);
        var actionMoves = cc.moveBy(0, 0, -80);
        var actionMoved = cc.moveBy(0.2, 0, 80);
        var actionShow = cc.fadeTo(0.2,255);
        var actionHold = cc.fadeTo(1.5,255);
        var actionHide = cc.fadeTo(1.5,0);
        var seq = cc.sequence(actionMoves,actionMoved,actionShow,actionHold,actionHide);
        _little.getChildByName('littleTip').getComponent(cc.Label).string = str;
        _little.parent = this.root = cc.find('Canvas');
        _little.runAction(seq);
        _little.on(cc.Node.EventType.TOUCH_END,()=>{
            if(_little){
                _little.stopAllActions();
                _little.destroy();
            }
            //_little.active = false;
        },this);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
