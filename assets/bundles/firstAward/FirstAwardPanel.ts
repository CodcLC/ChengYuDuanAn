/**
 * 首次豪礼界面
 */

import { UIMgr } from "../common/src/UIMgr";
import { GameDataCenter } from "../config/GameDataCenter";
import { GameEvents, GameSounds } from "../config/GConfig";
import { UIManager } from "../framework/UIManager";




 
const {ccclass, property} = cc._decorator;

@ccclass
export class FirstAwardPanel extends cc.Component {

    // =======================================
    // 编辑器属性定义(以@property修饰)
    // =======================================
    @property({ type: cc.Node, tooltip: '遮罩' })
    mask: cc.Node = null;

    @property({ type: cc.Node, tooltip: '面板' })
    panel: cc.Node = null;


    onEnable() {
        this.node.zIndex = 1000;

        UIMgr.setShowAnimation(this.panel, this.mask);
    }

    /** 点击关闭按钮 */
    onClickClose() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Btn_Click);

        this.closePanel();
    }    

    /** 点击视频按钮 */
    onClickVideo() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Btn_Click);
        
        this.openPrize();
    }

    /** 关闭界面 */
    closePanel() {
        UIMgr.setHideAnimation(this.panel, this.mask, () => {
            UIManager.close('firstAward/FirstAwardPanel', true);
        });
    }

    /** 打开奖励页面 */
    openPrize() {

        GameDataCenter.isFirstAward = false;

        // 设置奖品数量
        GameDataCenter.curPrizeAmount = 1;
        
        const bundle = cc.assetManager.getBundle('prize');
        if (!bundle) {
            cc.assetManager.loadBundle('prize', (err, bundle) => {
                if (err) { return console.log('加载prize bundle 失败:', err) };
                
                UIManager.close('firstAward/FirstAwardPanel', true);
                UIManager.open('prize/PrizePanel');
            });
        } else {
            UIManager.close('firstAward/FirstAwardPanel', true);
            UIManager.open('prize/PrizePanel');
        }
    }
}
