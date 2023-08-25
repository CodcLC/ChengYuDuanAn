/**
 * 首日特惠
 */

import { UIMgr } from "../common/src/UIMgr";
import { Utils } from "../common/src/Utils";
import { GameDataCenter } from "../config/GameDataCenter";
import { GameEvents, GameSounds } from "../config/GConfig";
import { DateTime } from "../framework/DateTime";
import { Store } from "../framework/Store";
import { UIManager } from "../framework/UIManager";




 
const {ccclass, property} = cc._decorator;

@ccclass
export class FirstDayDiscountPanel extends cc.Component {

    @property({ type: cc.Node, tooltip: '遮罩' })
    mask: cc.Node = null;

    @property({ type: cc.Node, tooltip: '面板' })
    panel: cc.Node = null;

    @property({ type: cc.Node, tooltip: '体力icon' })
    powerIcon: cc.Node = null;

    @property({ type: cc.Label, tooltip: '奖励数量' })
    prize: cc.Label = null;

    @property({ type: cc.Node, tooltip: '时间节点' })
    timeNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: '视频按钮' })
    videoBtn: cc.Node = null;


    /** 奖品数量 */
    private prizes: number = 0;
    
    /** 类型 */
    private type: number = 0;

    /** 时间储存Key. */
    private timeKey: string = "discountTimeKey";

    /** 当前时间 */
    private curTimes: number = 0;

    /** 时间lab */
    private timeLab: cc.Label = null;


    onEnable() {
        this.node.zIndex = 1000;
        
        UIMgr.setShowAnimation(this.panel, this.mask);
    }

    start() {
        this.initPanel();
    }

    /** 点击关闭按钮 */
    onClickClose() {
        UIMgr.setHideAnimation(this.panel, this.mask, () => {
            UIManager.close('discount/FirstDayDiscountPanel', true);
        });
    }

    /** 点击获取按钮 */
    onClickGain() {
        this.gainPrize();
    }

    /** 初始化界面 */
    initPanel() {
        if (!GameDataCenter.discountData.isFirstReceive) {
            this.powerIcon.y = 60;
            this.timeNode.active = false;
            this.videoBtn.y = -70;
            
            this.type = 1;
            this.prizes = 3;
        } else {
            this.powerIcon.y = 80;
            this.timeNode.active = true;
            this.videoBtn.y = -100; 
            
            this.type = 2;
            this.prizes = 4;
            this.getTime();
        }

        this.prize.string = `x${this.prizes}`;
    }

    /** 获得奖励 */
    gainPrize() {
        if (this.type == 1) {
            let discountData = GameDataCenter.discountData;
            discountData.isFirstReceive = true;
            GameDataCenter.discountData = discountData;
        } else if (this.type == 2) {
            let discountData = GameDataCenter.discountData;
            discountData.isTwoReceive = true;
            discountData.isShow = false;
            GameDataCenter.discountData = discountData;
        }
        
        // 更新首页按钮状态
        cc.systemEvent.emit(GameEvents.M_Updata_Discount_Btn);

        // 设置奖品
        GameDataCenter.curPrizeAmount = this.prizes;
        
        // 打开奖励页
        const bundle = cc.assetManager.getBundle('prize');
        if (!bundle) {
            cc.assetManager.loadBundle('prize', (err, bundle) => {
                if (err) { return console.log('加载prize bundle 失败:', err) };
                
                UIManager.close('discount/FirstDayDiscountPanel', true);
                UIManager.open('prize/PrizePanel');
            });
        } else {
            UIManager.close('discount/FirstDayDiscountPanel', true);
            UIManager.open('prize/PrizePanel');
        }
    }

    /** 获取时间 */
    getTime() {
        this.timeLab = this.timeNode.getChildByName('txt_time').getComponent(cc.Label);

        // 获得当前时间
        let curTime = DateTime.getTimeStamp(true);

        // 设置后24小时时间
        let nextTime = Store.get(this.timeKey);
        if (!nextTime) {
            nextTime = curTime + 24 * 60 * 60 * 1000;
            Store.set(this.timeKey, nextTime);
        }

        // 获得相差时间
        this.curTimes = DateTime.getInervalSecond(new Date(curTime), new Date(nextTime));
        this.schedule(this.onCountDownEvent, 1);
        this.onCountDownEvent();
    }

    /** 倒计时回调事件 */
    onCountDownEvent() {
        this.curTimes--;

        this.timeLab.string = Utils.formatTimeString(this.curTimes);
        if (this.curTimes <= 0) {
            this.unschedule(this.onCountDownEvent);
            Store.remove(this.timeKey);
            let discountData = GameDataCenter.discountData;
            discountData.isShow = false;
            GameDataCenter.discountData = discountData;

            // 更新首页按钮状态
            cc.systemEvent.emit(GameEvents.M_Updata_Discount_Btn);

            UIManager.close('discount/FirstDayDiscountPanel', true);
        }
    }
}
