/**
 * copyright (c) 2017-2021
 * http://www.game-general-developer.com/
 * 
 * 游戏数据中心
 * dev-name
 * 2018-10-05
 */

import { Store } from "../framework/Store";
import { GameEvents, unlockDoormanLevel } from "./GConfig";





export class GameDataCenter {
    /***********************************************************************************/
    // 
    // 游戏相关数据
    // 
    /***********************************************************************************/

    
    private static _power: number = null;          // 体力
    private static _historyGameLevel: number = null;      // 历史游戏关卡
    private static _curGameLevel: number = 0;             // 当前游戏关卡
    private static _curGameLevelIndex: number = 0;        // 当前游戏关卡索引
    private static _officialRoleGrade: number = null;     // 官人角色等级
    private static _doormanRoleGrade: any = null;         // 门客角色等级
    private static _doormanUnlockList: any = null;        // 门客解锁列表
    private static _levelOfficialGrade: number = null;    // 关卡进度条官人等级
    private static _levelDoormanGrade: number = null;     // 关卡进度条门客等级
    private static _isFirstAward: boolean = null;         // 是否获得首次奖励
    private static _isFirstSign: boolean = null;          // 是否首次登录
    private static _isTodayFirstSign: boolean = null;     // 是否今日首次登录
    private static _luckDrawTimes: number = null;         // 转盘剩余次数
    private static _isTodayFirstTurn: boolean = null;     // 是否今日首次转动转盘
    private static _isCountDown: boolean = null;          // 是否开启转盘倒计时
    private static _discountData: any = null;             // 首日特惠数据
    private static _doormanVideoData: any = null;             // 门客视频点数据
    
    /** 音效资源集合 */
    public static audios = {};
    /** 当前处于的面板 */
    public static curPanelName = null;
    /** 相差关卡信息 */
    public static differLevelInfo = { differLevel: 0, type: '' };
    /** 当前奖品数量 */
    public static curPrizeAmount: number = 0;
    /** 全局体力标签 node */
    public static _powerLabel = null;
    /** 本次是否显示登录页 */
    public static isShowSign: boolean = true;
    /** 关卡备份 */
    public static levelBackups = [];
    /** 当前获取门客索引 */
    public static curGainDoormanIndex: number = 0;
    /** 当前点击门客索引 */
    public static curClickDorrmanIndex: number = 0;


    /** 当前关卡索引 */
    public static set curGameLevelIndex(v) {
        GameDataCenter._curGameLevelIndex = v;
    }
    public static get curGameLevelIndex() { return GameDataCenter._curGameLevelIndex; }

    /** 当前游戏关卡 */
    public static set curGameLevel(v) {
        GameDataCenter._curGameLevel = v;
    }
    public static get curGameLevel() { return GameDataCenter._curGameLevel; }

    /** 体力 */
    public static set power(v) {
        GameDataCenter._power = v;
        Store.set('power', GameDataCenter._power);
        cc.systemEvent.emit(GameEvents.S_Update_Data_Power, GameDataCenter._power);
    }
    public static get power() {
        if (GameDataCenter._power == null) {
            GameDataCenter._power = Store.get('power', 5);
        }
        return GameDataCenter._power;
    }

    /** 历史游戏关卡 */
    public static set historyGameLevel(v) {
        GameDataCenter._historyGameLevel = v;
        Store.set('historyGameLevel', GameDataCenter._historyGameLevel);
    }
    public static get historyGameLevel() {
        if (GameDataCenter._historyGameLevel === null) {
            GameDataCenter._historyGameLevel = Store.get('historyGameLevel', 0);
        }
        return GameDataCenter._historyGameLevel;
    }

    /** 官人角色等级 */
    public static set officialRoleGrade (v) {
        GameDataCenter._officialRoleGrade = v;
        Store.set('officialRoleGrade', GameDataCenter._officialRoleGrade);
    }
    /** 官人角色等级 */
    public static get officialRoleGrade() {
        if (GameDataCenter._officialRoleGrade === null) {
            GameDataCenter._officialRoleGrade = Store.get('officialRoleGrade', 0);
        }
        return GameDataCenter._officialRoleGrade;
    }

    /** 门客角色等级 */
    public static set doormanRoleGrade(v) {
        GameDataCenter._doormanRoleGrade = v;
        Store.set('doormanRoleGrade', JSON.stringify(GameDataCenter._doormanRoleGrade));
    }
    /** 门客角色等级 */
    public static get doormanRoleGrade() {
        if (GameDataCenter._doormanRoleGrade === null) {
            let doormanRoleGrade = Store.get('doormanRoleGrade');
            if (doormanRoleGrade) {
                GameDataCenter._doormanRoleGrade = JSON.parse(doormanRoleGrade);
            } else {
                GameDataCenter._doormanRoleGrade = { overallGrade: 2, left: 1, right: 2, target: 'left' };
            }
        }
        return GameDataCenter._doormanRoleGrade;
    }

    /** 门客解锁列表 */
    public static set doormanUnlockList (v) {
        GameDataCenter._doormanUnlockList = v;
        Store.set('doormanUnlockList', JSON.stringify(GameDataCenter._doormanUnlockList));
    }
    /** 门客解锁列表 */
    public static get doormanUnlockList() {
        if (GameDataCenter._doormanUnlockList === null) {
            // 初始化列表
            let getInitList = () => {
                let list = [2, 2];
                for (let i = 0; i < unlockDoormanLevel.length; i++) {
                    list.push(0);
                }

                return list;
            }

            let arr = Store.get('doormanUnlockList');
            if (arr) {
                GameDataCenter._doormanUnlockList = JSON.parse(arr);
            } else { 
                GameDataCenter._doormanUnlockList = getInitList();
            }
        }
        return GameDataCenter._doormanUnlockList;
    }

    /** 关卡进度条官人等级 */
    public static set levelOfficialGrade (v) {
        GameDataCenter._levelOfficialGrade = v;
        Store.set('levelOfficialGrade', GameDataCenter._levelOfficialGrade);
    }
    /** 关卡进度条官人等级 */
    public static get levelOfficialGrade() {
        if (GameDataCenter._levelOfficialGrade === null) {
            GameDataCenter._levelOfficialGrade = Store.get('levelOfficialGrade', 0);
        }
        return GameDataCenter._levelOfficialGrade;
    }

    /** 关卡进度条门客等级 */
    public static set levelDoormanGrade (v) {
        GameDataCenter._levelDoormanGrade = v;
        Store.set('levelDoormanGrade', GameDataCenter._levelDoormanGrade);
    }
    /** 关卡进度条门客等级 */
    public static get levelDoormanGrade() {
        if (GameDataCenter._levelDoormanGrade === null) {
            GameDataCenter._levelDoormanGrade = Store.get('levelDoormanGrade', 0);
        }
        return GameDataCenter._levelDoormanGrade;
    }

    /** 是否获得首次奖励 */
    public static set isFirstAward (v) {
        GameDataCenter._isFirstAward = v;
        Store.set('firstAward', GameDataCenter._isFirstAward);
        cc.systemEvent.emit(GameEvents.M_Updata_First_Award_Btn_State, GameDataCenter._isFirstAward);
    }
    /** 是否获得首次奖励 */
    public static get isFirstAward() {
        if (GameDataCenter._isFirstAward === null) {
            GameDataCenter._isFirstAward = Store.get('firstAward', true);
        }
        return GameDataCenter._isFirstAward;
    }

    /** 是否首次登录 */
    public static set isFirstSign (v) {
        GameDataCenter._isFirstSign = v;
        Store.set('isFirstSign', GameDataCenter._isFirstSign);
    }
    /** 是否首次登录 */
    public static get isFirstSign () {
        if (GameDataCenter._isFirstSign == null) {
            GameDataCenter._isFirstSign = Store.get('isFirstSign', true);
        }
        return GameDataCenter._isFirstSign;
    }

    /** 是否今日首次登录 */
    public static set isTodayFirstSign (v) {
        GameDataCenter._isTodayFirstSign = v;
        Store.setTodayValue('isTodayFirstSign', GameDataCenter._isTodayFirstSign);
    }
    /** 是否今日首次登录 */
    public static get isTodayFirstSign () {
        if (GameDataCenter._isTodayFirstSign == null) {
            GameDataCenter._isTodayFirstSign = Store.getTodayValue('isTodayFirstSign', true);
        }
        return GameDataCenter._isTodayFirstSign;
    }

    /** 转盘剩余次数 */
    public static set luckDrawTimes (v) {
        GameDataCenter._luckDrawTimes = v;
        Store.setTodayValue('luckDrawTimes', GameDataCenter._luckDrawTimes);
        cc.systemEvent.emit(GameEvents.M_Updata_Luck_Draw_Times, GameDataCenter._luckDrawTimes);
    }
    /** 转盘剩余次数 */
    public static get luckDrawTimes() {
        if (GameDataCenter._luckDrawTimes == null) {
            GameDataCenter._luckDrawTimes = Store.getTodayValue('luckDrawTimes', 4);
        }
        return GameDataCenter._luckDrawTimes;
    }

    /** 是否今日首次转动转盘 */
    public static set isTodayFirstTurn (v) {
        GameDataCenter._isTodayFirstTurn = v;
        Store.setTodayValue('isTodayFirstTurn', GameDataCenter._isTodayFirstTurn);
        cc.systemEvent.emit(GameEvents.M_Updata_Luck_Draw_Btn, GameDataCenter._isTodayFirstTurn);
    }
    /** 是否今日首次转动转盘 */
    public static get isTodayFirstTurn() {
        if (GameDataCenter._isTodayFirstTurn == null) {
            GameDataCenter._isTodayFirstTurn = Store.getTodayValue('isTodayFirstTurn', true);
        }
        return GameDataCenter._isTodayFirstTurn;
    }

    /** 是否开启转盘倒计时 */
    public static set isCountDown (v) {
        GameDataCenter._isCountDown = v;
        Store.setTodayValue('isCountDown', GameDataCenter._isCountDown);
    }
    /** 是否开启转盘倒计时 */
    public static get isCountDown() {
        if (GameDataCenter._isCountDown == null) {
            GameDataCenter._isCountDown = Store.getTodayValue('isCountDown', false);
        }
        return GameDataCenter._isCountDown;
    }

    /** 首日特惠数据 */
    public static set discountData(v) {
        GameDataCenter._discountData = v;
        Store.set('discountData', JSON.stringify(GameDataCenter._discountData));
    }
    /** 首日特惠数据 */
    public static get discountData() {
        if (GameDataCenter._discountData == null) {
            let discountData = Store.get('discountData');
            if (discountData) {
                GameDataCenter._discountData = JSON.parse(discountData);
            } else {
                GameDataCenter._discountData = { isShow: true, isFirstReceive: false, isTwoReceive: false };
            }
        }
        return GameDataCenter._discountData;
    }

    /** 门客视频数据 */
    public static set doormanVideoData(v) {
        GameDataCenter._doormanVideoData = v;
        Store.set('doormanVideoData', JSON.stringify(GameDataCenter._doormanVideoData));
    }
    /** 门客视频数据 */
    public static get doormanVideoData() {
        if (GameDataCenter._doormanVideoData == null) {
            // 初始化列表
            let getInitList = () => {
                let list = [];
                for (let i = 0; i < 24; i++) {
                    list.push(0);
                }

                return list;
            }

            let doormanVideoData = Store.get('doormanVideoData');
            if (doormanVideoData) {
                GameDataCenter._doormanVideoData = JSON.parse(doormanVideoData);
            } else {
                GameDataCenter._doormanVideoData = getInitList();
            }
        }

        return GameDataCenter._doormanVideoData;
    }
}

(window as any).GameDataCenter = (window as any).userData = GameDataCenter;