/**
 * 官职警告界面
 */

import { UIMgr } from "../common/src/UIMgr";
import { GameDataCenter } from "../config/GameDataCenter";
import { GameEvents, GameSounds } from "../config/GConfig";
import { UIManager } from "../framework/UIManager";




 
const {ccclass, property} = cc._decorator;

@ccclass
export class OfficialWarnPanel extends cc.Component {

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

        this.nextLevel();
    }

    /** 升级按钮 */
    onClickUpgrade() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Btn_Click);
        
        this.upgradeOfficial();
    }

    /** 升级官职 */
    upgradeOfficial() {
        // 恢复游戏时间
        cc.systemEvent.emit(GameEvents.M_Begin_Of_Stop_Time, true);

        // 等级升级
        GameDataCenter.officialRoleGrade++;

        // 下一关卡
        GameDataCenter.curGameLevel++;
        GameDataCenter.curGameLevelIndex = GameDataCenter.curGameLevel;
        cc.systemEvent.emit(GameEvents.M_Init_Level);
        
        // 重置进度条
        cc.systemEvent.emit(GameEvents.M_Reset_Level_Progress);

        UIMgr.setHideAnimation(this.panel, this.mask, () => {
            UIManager.close('unlock/OfficialWarnPanel', true);
            UIManager.close('unlock/OfficialUnlockPanel', true);
        });

        // 更换官人角色
        cc.systemEvent.emit(GameEvents.M_Upgrade_Official_Role);
    }

    /** 下一关 */
    nextLevel() {
        // 恢复游戏时间
        cc.systemEvent.emit(GameEvents.M_Begin_Of_Stop_Time, true);

        // 下一关卡
        GameDataCenter.curGameLevel++;
        GameDataCenter.curGameLevelIndex = GameDataCenter.curGameLevel;
        cc.systemEvent.emit(GameEvents.M_Init_Level);
        
        // 重置进度条
        cc.systemEvent.emit(GameEvents.M_Reset_Level_Progress);

        UIMgr.setHideAnimation(this.panel, this.mask, () => {
            UIManager.close('unlock/OfficialWarnPanel', true);
            UIManager.close('unlock/OfficialUnlockPanel', true);
        });
    }
}
