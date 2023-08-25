/**
 * 奖品界面
 */

import { UIMgr } from "../common/src/UIMgr";
import { GameDataCenter } from "../config/GameDataCenter";
import { GameEvents, GameSounds } from "../config/GConfig";
import { UIManager } from "../framework/UIManager";




 
const {ccclass, property} = cc._decorator;

@ccclass
export class PrizePanel extends cc.Component {

    @property({ type: cc.Node, tooltip: '遮罩' })
    mask: cc.Node = null;

    @property({ type: cc.Node, tooltip: '面板' })
    panel: cc.Node = null;

    @property({ type: cc.Label, tooltip: '奖励描述' })
    prizeDesc: cc.Label = null;

    @property({ type: cc.Node, tooltip: '光' })
    light: cc.Node = null;


    onEnable() {
        this.node.zIndex = 1000;
        
        UIMgr.setShowAnimation(this.panel, this.mask);
    }

    start() {
        this.prizeDesc.string = `×${GameDataCenter.curPrizeAmount}`;
    }
    
    onClickGood() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Btn_Click);
        
        cc.systemEvent.emit(GameEvents.M_Collect_Effect, GameDataCenter.curPrizeAmount);

        UIMgr.setHideAnimation(this.panel, this.mask, () => {
            UIManager.close('prize/PrizePanel', true);
        });
    }

    /** 光旋转 */
    lightRoll() {
        cc.tween(this.light)
            .by(3, { angle: -360 })
            .repeatForever()
            .start();
    }
}
