/**
 * 签到页
 */

import { UIMgr } from "../common/src/UIMgr";
import { GameDataCenter } from "../config/GameDataCenter";
import { GameEvents, GameSounds } from "../config/GConfig";
import { UIManager } from "../framework/UIManager";




 
const {ccclass, property} = cc._decorator;

@ccclass
export class SignPanel extends cc.Component {

    @property({ type: cc.Node, tooltip: '遮罩' })
    mask: cc.Node = null;

    @property({ type: cc.Node, tooltip: '面板' })
    panel: cc.Node = null;

    @property({ type: cc.Node, tooltip: '打钩节点' })
    tickNode: cc.Node = null;

    onEnable() {
        this.node.zIndex = 1000;

        UIMgr.setShowAnimation(this.panel, this.mask);
    }

    /** 关闭按钮 */
    onClickClose() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Btn_Click);
        
        cc.systemEvent.emit(GameEvents.M_Collect_Effect, 1);

        this.closePanel();
    }

    /** 打钩按钮 */
    onClickTick() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Btn_Click);

        this.tickNode.active = !this.tickNode.active;
    }

    /** 三倍领取按钮 */
    onClickReceive() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Btn_Click);
        
        cc.systemEvent.emit(GameEvents.M_Collect_Effect, 3);
        this.closePanel();
    }

    closePanel() {
        UIMgr.setHideAnimation(this.panel, this.mask, () => {
            UIManager.close('sign/SignPanel', true);
        });

        GameDataCenter.isTodayFirstSign = false;
    }
}
