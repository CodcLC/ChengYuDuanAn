/**
 * 特惠按钮
 */

import { Utils } from "../../common/src/Utils";
import { GameDataCenter } from "../../config/GameDataCenter";
import { GameEvents, GameSounds } from "../../config/GConfig";
import { DateTime } from "../../framework/DateTime";
import { Store } from "../../framework/Store";
import { UIManager } from "../../framework/UIManager";




 
const {ccclass, property} = cc._decorator;

@ccclass
export class DiscountBtnCtrl extends cc.Component {

    // =======================================
    // 编辑器属性定义(以@property修饰)
    // =======================================
    @property({type: cc.Label, tooltip: '数量文本'})
    quantityTxt: cc.Label = null;

    @property({type: cc.Label, tooltip: '描述文本'})
    descTxt: cc.Label = null;


    /** 时间储存Key. */
    private timeKey: string = "discountTimeKey";

    /** 当前时间 */
    private curTimes: number = 0;
    

    onEnable() {
        // 更新首日特惠按钮状态
        cc.systemEvent.on(GameEvents.M_Updata_Discount_Btn, this.init, this);
    }

    onDisable() {
        // 更新首日特惠按钮状态
        cc.systemEvent.off(GameEvents.M_Updata_Discount_Btn, this.init, this);
    }

    start() {
        this.init();
    }

    /** 首日特惠按钮 */
    onClickDiscount() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Btn_Click);
        
        let bundle = cc.assetManager.getBundle('discount');
        if (!bundle) {
            cc.assetManager.loadBundle('discount', (err, bundle) => {
                if (err) { return console.log('加载discount bundle 失败:', err) };
                
                UIManager.open('discount/FirstDayDiscountPanel');
            });
        } else {
            UIManager.open('discount/FirstDayDiscountPanel');
        }
    }

    init() {
        if (GameDataCenter.discountData.isFirstReceive) {
            this.quantityTxt.string = 'x4';
            this.getTime();
        } else {
            this.quantityTxt.string = 'x3';
            this.descTxt.string = '免费领取';
        }
    }

    /** 获取时间 */
    getTime() {
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

        this.descTxt.string = Utils.formatTimeString(this.curTimes);
        if (this.curTimes <= 0) {
            this.unschedule(this.onCountDownEvent);
            Store.remove(this.timeKey);
            let discountData = GameDataCenter.discountData;
            discountData.isShow = false;
            GameDataCenter.discountData = discountData;

            cc.systemEvent.emit(GameEvents.M_Updata_Discount_Btn);
        }
    }


}
