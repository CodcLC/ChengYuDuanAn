/**
 * 时间到界面
 */

import { UIMgr } from "../common/src/UIMgr";
import { GameDataCenter } from "../config/GameDataCenter";
import { GameEvents, GameSounds } from "../config/GConfig";
import { UIManager } from "../framework/UIManager";
import { GamePanel } from "../game/GamePanel";




 
const {ccclass, property} = cc._decorator;

@ccclass
export class TimeOverPanel extends cc.Component {

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

    /** 点击关闭按钮 */
    onClickCloseBtn() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Btn_Click);

        UIMgr.setHideAnimation(this.panel, this.mask, () => {
            UIManager.close('timeOver/TimeOverPanel', true);
            UIManager.close('game/GamePanel', true);
            UIManager.open('home/HomePanel');
        });
    }

    /** 点击放弃按钮 */
    onClickGiveBtn() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Btn_Click);

        UIMgr.setHideAnimation(this.panel, this.mask, () => {
            UIManager.close('timeOver/TimeOverPanel', true);
            UIManager.close('game/GamePanel', true);
            UIManager.open('home/HomePanel');
        });
    }
    
    /** 点击视频按钮 */
    onClickVideoBtn() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Btn_Click);
        
        this.reward();
    }

    /** 初始化内容 */
    initContent() {
        this.content.string = `本轮时间已耗尽，是否再加30秒？\n再断${GameDataCenter.differLevelInfo.differLevel}案即可${GameDataCenter.differLevelInfo.type}，大好前程\n勿失良机!`;
    }

    reward() {
        GamePanel.timeCount = 30;
        cc.systemEvent.emit(GameEvents.M_Begin_Of_Stop_Time, true);
        
        UIMgr.setHideAnimation(this.panel, this.mask, () => {
            UIManager.close('timeOver/TimeOverPanel', true);
        });
    }
}
