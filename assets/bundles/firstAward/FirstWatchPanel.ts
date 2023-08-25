/**
 * 观看豪礼界面
 */

import { UIMgr } from "../common/src/UIMgr";
import { GameDataCenter } from "../config/GameDataCenter";
import { doormanNames, GameEvents, GameSounds } from "../config/GConfig";
import { UIManager } from "../framework/UIManager";




 
const {ccclass, property} = cc._decorator;

@ccclass
export class FirstWatchPanel extends cc.Component {

    // =======================================
    // 编辑器属性定义(以@property修饰)
    // =======================================
    @property({ type: cc.Node, tooltip: '遮罩' })
    mask: cc.Node = null;

    @property({ type: cc.Node, tooltip: '面板' })
    panel: cc.Node = null;

    @property({ type: cc.Sprite, tooltip: '门客' })
    doorman: cc.Sprite = null;

    @property({ type: cc.Label, tooltip: '门客名字' })
    doormanName: cc.Label = null;


    onEnable() {
        this.node.zIndex = 1000;
        
        UIMgr.setShowAnimation(this.panel, this.mask);

        this.init();
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

    /** 初始化界面 */
    init() {
        const bundle = cc.assetManager.getBundle('common');
        bundle.load(`res/img/doorman/doorman_${GameDataCenter.curClickDorrmanIndex + 1}`, cc.SpriteFrame, (err, assets: cc.SpriteFrame) => {
            this.doorman.spriteFrame = assets;
        });

        this.doormanName.string = `${doormanNames[GameDataCenter.curClickDorrmanIndex]}`;
    }

    /** 关闭界面 */
    closePanel() {
        UIMgr.setHideAnimation(this.panel, this.mask, () => {
            UIManager.close('firstAward/FirstWatchPanel', true);
        });
    }

    /** 打开奖励页面 */
    openPrize() {
        let doormanVideoData = GameDataCenter.doormanVideoData;
        doormanVideoData[GameDataCenter.curClickDorrmanIndex] = 1;
        GameDataCenter.doormanVideoData = doormanVideoData;

        // 设置奖品数量
        GameDataCenter.curPrizeAmount = 1;
        
        const bundle = cc.assetManager.getBundle('prize');
        if (!bundle) {
            cc.assetManager.loadBundle('prize', (err, bundle) => {
                if (err) { return console.log('加载prize bundle 失败:', err) };
                
                UIManager.close('firstAward/FirstWatchPanel', true);
                UIManager.open('prize/PrizePanel');
            });
        } else {
            UIManager.close('firstAward/FirstWatchPanel', true);
            UIManager.open('prize/PrizePanel');
        }
    }
}
