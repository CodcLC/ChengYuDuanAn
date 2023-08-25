/**
 * 体力.
 */


import { GameDataCenter } from "../../config/GameDataCenter";
import { GameEvents } from "../../config/GConfig";
import { DateTime } from "../../framework/DateTime";
import { NumberFormat } from "../../framework/NumberFormat";
import { Store } from "../../framework/Store";





const { ccclass, property } = cc._decorator;

@ccclass
export class Power extends cc.Component {

    @property({ type: cc.Label, tooltip: "体力值." })
    powerLabel: cc.Label = null;

    @property({ type: cc.Label, tooltip: "倒计时." })
    countDownLabel: cc.Label = null;

    @property({ type: cc.Node, tooltip: '增加按钮' })
    addBtn: cc.Node = null;


    /** 游戏事件对象 */
    private static EEventName = {
        /** 体力修改. */
        ON_CHANGE_POWER: "ON_CHANGE_POWER",
    };


    /** 时间储存Key. */
    private static timeKey: string = "PJTimeKey";
    /** 当前计时. */
    private time: number = 0;
    /** 体力倒计时回调. */
    private countDownFunc: Function = null;


    onEnable() {
        this.getTime();
        this.onBeginCountDown();
        this.onPowerChange();

        cc.systemEvent.on(GameEvents.S_Update_Data_Power, this.onPowerChange, this);
    }

    onDisable() {
        cc.systemEvent.off(GameEvents.S_Update_Data_Power, this.onPowerChange, this);
    }

    /** 增加体力按钮 */
    onClickAddPower() {
        GameDataCenter.power += 1;
    }

    /** 是否可以开始游戏. */
    public static isStartGame(): boolean {
        return GameDataCenter.power >= 1;
    }

    /** 减少体力. */
    public static onPowerSub() {
        GameDataCenter.power -= 1;
    }

    /** 恢复体力. */
    public static onRestorePower() {
        GameDataCenter.power = 1;
        Store.remove(Power.timeKey);
    }

    /** 同步体力修改. */
    private onPowerChange() {
        this.powerLabel.string = "" + GameDataCenter.power;
        this.addBtn.active = GameDataCenter.power <= 2 ? true : false;

        this.countDownLabel && this.updateCuntDownLabel();
        this.onBeginCountDown();
    }

    /** 获取计时. */
    private getTime() {
        let timeDistance = DateTime.getTimeStamp() - Store.get(Power.timeKey, DateTime.getTimeStamp());
        if (timeDistance < 1) timeDistance = 1;
        if (GameDataCenter.power + timeDistance / 300 > 5) {
            GameDataCenter.power = 5;
            Store.remove(Power.timeKey);
        } else {
            GameDataCenter.power = Math.floor(GameDataCenter.power + timeDistance / 300);
        }
        this.time = timeDistance % 300;
    }

    /** 刷新时间. */
    private updateCuntDownLabel() {
        if (GameDataCenter.power <= 2) {
            this.countDownLabel.node.active = true;
            const curTime = 300 - this.time;
            const secound = curTime % 60;
            const minute = curTime >= 60 ? Math.floor(curTime / 60) % 60 : 0;
            this.countDownLabel.string = NumberFormat.formatLen(minute, 2) + ":" + NumberFormat.formatLen(secound, 2) + "后恢复";
        } else {
            this.countDownLabel.string = "00:00后恢复";
            this.countDownLabel.node.active = false;
            this.time = 0;
        }
    }

    /** 开启倒计时. */
    private onBeginCountDown() {
        if (GameDataCenter.power <= 2 && !this.countDownFunc) {
            this.countDownFunc = this.onCountDownEvent.bind(this);
            this.schedule(this.countDownFunc, 1);
            this.onCountDownEvent();
        } else {
            // 体力满 移除定时器
            if (GameDataCenter.power > 2 && this.countDownFunc) {
                this.unschedule(this.countDownFunc);
                this.countDownFunc = null;
                Store.remove(Power.timeKey);
            }
        }
    }

    /** 体力倒计时事件. */
    private onCountDownEvent() {
        if (this.node.active != this.node.parent.active) {
            this.unschedule(this.countDownFunc);
            this.countDownFunc = null;
            return;
        }
        this.time++;
        if (this.time === 300) {
            this.time = 0;
            GameDataCenter.power++;
            if (GameDataCenter.power >= 2) {
                this.unschedule(this.countDownFunc);
                this.countDownFunc = null;
                Store.remove(Power.timeKey);
            }
        }
        Store.set(Power.timeKey, DateTime.getTimeStamp() - this.time);
        this.countDownLabel && this.updateCuntDownLabel();
    }
}


