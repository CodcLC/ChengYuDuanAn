/**
 * 门客警告界面
 */

import { UIMgr } from "../common/src/UIMgr";
import { GameDataCenter } from "../config/GameDataCenter";
import { GameEvents, GameSounds } from "../config/GConfig";
import { UIManager } from "../framework/UIManager";




 
const {ccclass, property} = cc._decorator;

@ccclass
export class DoormanWarnPanel extends cc.Component {

    // =======================================
    // 编辑器属性定义(以@property修饰)
    // =======================================
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

    /** 招纳按钮 */
    onClickRecruit() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Btn_Click);

        this.recruitDoorman();
    }

    /** 招纳门客 */
    recruitDoorman() {
        let doormanRoleGrade = GameDataCenter.doormanRoleGrade;
        if (doormanRoleGrade.target == 'left') {
            doormanRoleGrade.left = doormanRoleGrade.overallGrade;
            doormanRoleGrade.target = 'right';
        } else if (doormanRoleGrade.target == 'right') {
            doormanRoleGrade.right = doormanRoleGrade.overallGrade;
            doormanRoleGrade.target = 'left';
        }
        GameDataCenter.doormanRoleGrade = doormanRoleGrade;

        // 更新门客解锁列表
        let doormanUnlockList = GameDataCenter.doormanUnlockList;
        doormanUnlockList[GameDataCenter.doormanRoleGrade.overallGrade - 1] = 2;
        GameDataCenter.doormanUnlockList = doormanUnlockList;

        this.nextLevel();
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
        
        // 更新门客
        cc.systemEvent.emit(GameEvents.M_Change_Game_Doorman_Role);

        UIMgr.setHideAnimation(this.panel, this.mask, () => {
            UIManager.close('unlock/DoormanWarnPanel', true);
            UIManager.close('unlock/DoormanUnlockPanel', true);
        });
    }
}
