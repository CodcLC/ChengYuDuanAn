/**
 * 失败界面
 */

import { UIMgr } from "../common/src/UIMgr";
import { GameDataCenter } from "../config/GameDataCenter";
import { GameEvents, GameSounds, unlockDoormanLevel, unlockOfficialLevel } from "../config/GConfig";
import { UIManager } from "../framework/UIManager";




 
const {ccclass, property} = cc._decorator;

@ccclass
export class FailPanel extends cc.Component {

    @property({ type: cc.Node, tooltip: '遮罩' })
    mask: cc.Node = null;

    @property({ type: cc.Node, tooltip: '面板' })
    panel: cc.Node = null;

    @property({ type: cc.Label, tooltip: '内容' })
    content: cc.Label = null;


    onEnable() {
        UIMgr.setShowAnimation(this.panel, this.mask);
    }

    start() {
        this.initContent();
    }

    /** 关闭按钮 */
    onClickClose() {
        UIMgr.setHideAnimation(this.panel, this.mask, () => {
            UIManager.close('fail/FailPanel', true);
            UIManager.open('fail/GiveGamePanel');
        });
    }

    /** 继续游戏按钮 */
    onClickContinue() {
        this.continueGame();
    }

    /** 初始化内容 */
    initContent() {
        this.content.string = `一时糊涂断错案，重整旗鼓莫放弃\n再断${GameDataCenter.differLevelInfo.differLevel}案即可${GameDataCenter.differLevelInfo.type}，大好前程\n勿失良机!`;
    }

    /** 继续游戏 */
    continueGame() {
        // 恢复游戏时间
        cc.systemEvent.emit(GameEvents.M_Begin_Of_Stop_Time, true);

        cc.systemEvent.emit(GameEvents.M_Init_Level);
        UIMgr.setHideAnimation(this.panel, this.mask, () => {
            UIManager.close('fail/FailPanel', true);
        });
    }
}
