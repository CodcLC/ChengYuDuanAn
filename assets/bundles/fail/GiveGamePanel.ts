/**
 * 放弃游戏界面
 */

import { UIMgr } from "../common/src/UIMgr";
import { GameEvents, GameSounds } from "../config/GConfig";
import { UIManager } from "../framework/UIManager";




 
const {ccclass, property} = cc._decorator;

@ccclass
export class GiveGamePanel extends cc.Component {

    @property({ type: cc.Node, tooltip: '遮罩' })
    mask: cc.Node = null;

    @property({ type: cc.Node, tooltip: '面板' })
    panel: cc.Node = null;


    onEnable() {
        UIMgr.setShowAnimation(this.panel, this.mask);
    }

    /** 关闭按钮 */
    onClickClose() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Btn_Click);

        UIMgr.setHideAnimation(this.panel, this.mask, () => {
            UIManager.close('fail/GiveGamePanel', true);
            UIManager.close('game/GamePanel', true);
            UIManager.open('home/HomePanel');
        });
    }
    
    /** 继续游戏按钮 */
    onClickContinue() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Btn_Click);
        
        this.continueGame();
    }

    /** 继续游戏 */
    continueGame() {
        // 恢复游戏时间
        cc.systemEvent.emit(GameEvents.M_Begin_Of_Stop_Time, true);

        cc.systemEvent.emit(GameEvents.M_Init_Level);
        UIMgr.setHideAnimation(this.panel, this.mask, () => {
            UIManager.close('fail/GiveGamePanel', true);
        });
    }
}
