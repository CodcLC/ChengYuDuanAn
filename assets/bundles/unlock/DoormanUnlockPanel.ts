/**
 * 解锁门客界面
 */

import { UIMgr } from "../common/src/UIMgr";
import { GameDataCenter } from "../config/GameDataCenter";
import { doormanNames, GameEvents, GameSounds } from "../config/GConfig";
import { UIManager } from "../framework/UIManager";




 
const {ccclass, property} = cc._decorator;

@ccclass
export class DoormanUnlockPanel extends cc.Component {

    @property({ type: cc.Node, tooltip: '遮罩' })
    mask: cc.Node = null;

    @property({ type: cc.Node, tooltip: '面板' })
    panel: cc.Node = null;

    @property({ type: cc.Sprite, tooltip: '门客'})
    doormanRole: cc.Sprite[] = [];


    onEnable() {
        UIMgr.setShowAnimation(this.panel, this.mask);
    }

    start() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_PanelEject);
        
        this.initDoorman();
        
        // 提升关卡门客等级
        GameDataCenter.levelDoormanGrade++;

        // 存储最高关卡
        GameDataCenter.historyGameLevel = GameDataCenter.curGameLevel + 1;

        // 可解锁新门客
        let doormanRoleGrade = GameDataCenter.doormanRoleGrade;
        doormanRoleGrade.overallGrade += 1;
        GameDataCenter.doormanRoleGrade = doormanRoleGrade;
        
        // 更新门客解锁列表
        let doormanUnlockList = GameDataCenter.doormanUnlockList;
        doormanUnlockList[GameDataCenter.doormanRoleGrade.overallGrade - 1] = 1;
        GameDataCenter.doormanUnlockList = doormanUnlockList;
    }

    /** 关闭按钮 */
    onClickClose() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Btn_Click);

        UIManager.open('unlock/DoormanWarnPanel');
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

        // 解锁新门客
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
            UIManager.close('unlock/DoormanUnlockPanel', true);
        });
    }

    initDoorman() {
        // 获取需要更换门客的索引
        let index = GameDataCenter.doormanRoleGrade[`${GameDataCenter.doormanRoleGrade.target}`];

        let bundle = cc.assetManager.getBundle('common');
        bundle.load(`res/img/doorman/doorman_${ index }`, cc.SpriteFrame, (err, assets: cc.SpriteFrame) => {
            this.doormanRole[0].spriteFrame = assets;
        });

        // 加载置灰图片
        bundle.load(`res/img/doorman_grey/doorman_${GameDataCenter.doormanRoleGrade.overallGrade + 1}`, cc.SpriteFrame, (err, assets: cc.SpriteFrame) => {
            this.doormanRole[1].spriteFrame = assets;
        });

        this.doormanRole[0].node.getChildByName('txt_name').getComponent(cc.Label).string = `${doormanNames[index - 1]}`;

        this.doormanRole[1].node.getChildByName('txt_name').getComponent(cc.Label).string = `${doormanNames[GameDataCenter.doormanRoleGrade.overallGrade]}`;
    }
}