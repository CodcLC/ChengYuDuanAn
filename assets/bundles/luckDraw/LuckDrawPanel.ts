/**
 * 转盘界面
 */

import { UIMgr } from "../common/src/UIMgr";
import { GameDataCenter } from "../config/GameDataCenter";
import { GameEvents, GameSounds } from "../config/GConfig";
import { Random } from "../framework/Random";
import { UIManager } from "../framework/UIManager";




 
const {ccclass, property} = cc._decorator;

@ccclass
export class LuckDrawPanel extends cc.Component {

    // =======================================
    // 编辑器属性定义(以@property修饰)
    // =======================================
    @property({ type: cc.Node, tooltip: '遮罩' })
    mask: cc.Node = null;

    @property({ type: cc.Node, tooltip: '面板' })
    panel: cc.Node = null;

    @property({ type: cc.Node, tooltip: '转盘' })
    rotaryTable: cc.Node = null;

    @property({ type: cc.Label, tooltip: '剩余次数' })
    surplusTimes: cc.Label = null;

    @property({ type: cc.Node, tooltip: '抽奖按钮' })
    luckDrawBtn: cc.Node = null;

    @property({ type: cc.Node, tooltip: '提示' })
    tips: cc.Node = null;


    /** 转动指数 */
    private rotationIndex = [325, 250, 180, 110, 35];
    /** 奖品配置 */
    private prizeConfig = [1, 2, 4, 5, 10];
    /** 结果的位置 */
    private resultPoint: number = 0;
    /** 按钮是否点击 */
    private isClickBtn: boolean = false;

    // =======================================
    // 生命周期(模板方法，以on开头)
    // =======================================

    onEnable() {
        this.node.zIndex = 1000;
        
        UIMgr.setShowAnimation(this.panel, this.mask);

        cc.systemEvent.on(GameEvents.M_Updata_Luck_Draw_Times, this.updataSurplusTimes, this);
        cc.systemEvent.on(GameEvents.M_Updata_Luck_Draw_Btn, this.checkVideoBtnState, this);
    }

    onDisable() {
        cc.systemEvent.off(GameEvents.M_Updata_Luck_Draw_Times, this.updataSurplusTimes, this);
        cc.systemEvent.off(GameEvents.M_Updata_Luck_Draw_Btn, this.checkVideoBtnState, this);
    }

    start() {
        this.updataSurplusTimes();
        this.checkVideoBtnState();
    }

    /** 关闭按钮 */
    onClickClose() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Btn_Click);
        
        if (this.isClickBtn) {
            return;
        }

        // 开启按钮倒计时
        cc.systemEvent.emit(GameEvents.M_Luck_Draw_Btn_Count_Down);

        UIMgr.setHideAnimation(this.panel, this.mask, () => {
            UIManager.close('luckDraw/LuckDrawPanel', true);
        });
    }

    /** 开始按钮 */
    onClickPlay() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Btn_Click);

        if (this.isClickBtn) {
            return;
        }
        this.isClickBtn = true;

        if (GameDataCenter.isTodayFirstTurn || cc.sys.isBrowser) {
            this.getCoronaResult();
            return;
        }

        this.getCoronaResult();
    }

    /** 获得转盘结果 */
    getCoronaResult() {
        if (GameDataCenter.isTodayFirstTurn) {
            // 首次转动必是10
            this.resultPoint = 4;
        } else {
            // 设置结果位置
            this.resultPoint = this.getRandomDrawIndex();
        }

        this.startRoll();
    }

    /** 开始滚动 */
    startRoll() {
        cc.tween(this.rotaryTable)
            .to(4, { angle: -(this.rotationIndex[this.resultPoint] + 360 * 7) }, { easing: 'sineInOut' })
            .delay(0.5)
            .call(() => {
                this.rotaryTable.angle += 360 * 7;
                this.rollEnded();
            })
            .start();
    }

    /** 滚动结束 */
    rollEnded() {
        this.isClickBtn = false;
        
        GameDataCenter.luckDrawTimes--;

        // 今日首次抽奖
        if (GameDataCenter.isTodayFirstTurn) {
            GameDataCenter.isTodayFirstTurn = false;
        }

        // 开启倒计时
        GameDataCenter.isCountDown = true;

        // 设置奖品
        GameDataCenter.curPrizeAmount = this.prizeConfig[this.resultPoint];

        // 打开奖励页
        const bundle = cc.assetManager.getBundle('prize');
        if (!bundle) {
            cc.assetManager.loadBundle('prize', (err, bundle) => {
                if (err) { return console.log('加载prize bundle 失败:', err) };
                
                UIManager.open('prize/PrizePanel');
            });
        } else {
            UIManager.open('prize/PrizePanel');
        }
    }

    /** 更新剩余次数 */
    updataSurplusTimes() {
        this.surplusTimes.string = `${GameDataCenter.luckDrawTimes}`;
        
        this.luckDrawBtn.active = GameDataCenter.luckDrawTimes <= 0 ? false : true;
        this.tips.active = GameDataCenter.luckDrawTimes <= 0 ? true : false;
    }

    /** 检测视频按钮状态 */
    checkVideoBtnState() {
        this.luckDrawBtn.getChildByName('icon_video').active = GameDataCenter.isTodayFirstTurn ? false : true;
        this.luckDrawBtn.getChildByName('txt').x = GameDataCenter.isTodayFirstTurn ? 10 : 43;
    }

    /** 视频结束回调 */
    videoCallback(err, res) {
        if (err) {
            return
        }

        this.getCoronaResult();
    }

    /**
     * 获得抽奖序列号
     */
    getRandomDrawIndex(){
        let randomNumber = Random.randomNumber(1,5) - 1;
        return randomNumber;
    }
}
