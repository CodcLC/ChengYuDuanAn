/**
 * 转盘按钮
 */

import { Utils } from "../../common/src/Utils";
import { GameDataCenter } from "../../config/GameDataCenter";
import { GameEvents } from "../../config/GConfig";
import { DateTime } from "../../framework/DateTime";
import { Store } from "../../framework/Store";
import { UIManager } from "../../framework/UIManager";




 
const {ccclass, property} = cc._decorator;

@ccclass
export class LuckDrawBtnCtrl extends cc.Component {

    @property({type: cc.Label, tooltip: '按钮文本'})
    txt: cc.Label = null;


    /** 时间储存Key. */
    private timeKey: string = "fl_luckDrawTimeKey";

    /** 当前计时 */
    private time: number = 0;

    /** 倒计时回调. */
    private countDownFunc: Function = null;
    

    onEnable() {
        // 检测转盘按钮状态
        cc.systemEvent.on(GameEvents.M_Updata_Luck_Draw_Times, this.checkLuckDrawBtnState, this);
        // 开启转盘倒计时
        cc.systemEvent.on(GameEvents.M_Luck_Draw_Btn_Count_Down, this.checkLuckDrawDesc, this);
    }

    onDisable() {
        // 检测转盘按钮状态
        cc.systemEvent.off(GameEvents.M_Updata_Luck_Draw_Times, this.checkLuckDrawBtnState, this);
        // 开启转盘倒计时
        cc.systemEvent.off(GameEvents.M_Luck_Draw_Btn_Count_Down, this.checkLuckDrawDesc, this);
    }

    start() {
        this.checkLuckDrawBtnState();
        this.checkLuckDrawDesc();
    }

    /** 转盘按钮 */
    onClickLuckDraw() {
        if (GameDataCenter.isCountDown) {
            return;
        }
        
        let bundle = cc.assetManager.getBundle('luckDraw');
        if (!bundle) {
            cc.assetManager.loadBundle('luckDraw', (err, bundle) => {
                if (err) { return console.log('加载luckDraw bundle 失败:', err) };
                
                UIManager.open('luckDraw/LuckDrawPanel');
            });
        } else {
            UIManager.open('luckDraw/LuckDrawPanel');
        }
    }
 
    /** 检测转盘按钮状态 */
    checkLuckDrawBtnState() {
        this.node.active = GameDataCenter.luckDrawTimes <= 0 ? false : true;
    }

    /** 检测转盘描述 */
    checkLuckDrawDesc() {
        if (GameDataCenter.isCountDown) {
            // 开启倒计时
            this.getTime();
        } else {
            this.txt.string = '可领取';
        }
    }

    /** 获取计时. */
    getTime() {
        // 获得当前时间
        let curTime = DateTime.getTimeStamp(true);

        // 设置后180秒时间
        let nextTime = Store.get(this.timeKey);
        if (!nextTime) {
            nextTime = curTime + 180 * 1000;
            Store.set(this.timeKey, nextTime);
        }

        // 获得相差时间
        this.time = DateTime.getInervalSecond(new Date(curTime), new Date(nextTime));
        this.schedule(this.onCountDownEvent, 1);
        this.onCountDownEvent();
    }

    /** 倒计时事件. */
    onCountDownEvent() {
        this.time--;
        this.txt.string = Utils.formatTimeString(this.time);

        if (this.time <= 0) {
            this.unschedule(this.onCountDownEvent);
            Store.remove(this.timeKey);
            GameDataCenter.isCountDown = false;
            this.txt.string = '可领取';
        }
    }
}
