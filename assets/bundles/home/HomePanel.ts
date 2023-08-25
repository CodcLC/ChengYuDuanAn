/**
 * 首页
 */

import { Power } from "../common/src/Power";
import { ScrollViewExtend } from "../common/src/ScrollViewExtend";
import { GameDataCenter } from "../config/GameDataCenter";
import { GameEvents, GameSounds } from "../config/GConfig";
import { UIManager } from "../framework/UIManager";
import { Item } from "./src/item";





 
const {ccclass, property} = cc._decorator;

@ccclass
export class HomePanel extends cc.Component {

    // =======================================
    // 编辑器属性定义(以@property修饰)
    // =======================================

    @property({ type: cc.Prefab, tooltip: '门客预制体' })
    doormanPre: cc.Prefab = null;

    @property({ type: cc.Node, tooltip: '视频icon' })
    videoIcon: cc.Node = null;

    @property({ type: cc.Node, tooltip: '今日豪礼按钮' })
    firstAwardBtn: cc.Node = null;

    @property({ type: cc.Node, tooltip: '门客容器' })
    doormans: cc.Node = null;

    @property({ type: cc.Node, tooltip: '首日特惠按钮' })
    discountBtn: cc.Node = null;

    @property({ type: cc.Node, tooltip: '转盘按钮' })
    luckDrawBtn: cc.Node = null;

    @property({ type: sp.Skeleton, tooltip: '门客'})
    doormanRole: sp.Skeleton[] = [];


    /** 开始游戏按钮是否点击 */
    private isClicked: boolean = false;

    private scrollViewExtend: ScrollViewExtend = null;


    onEnable() {
        // 更新视频icon状态
        cc.systemEvent.on(GameEvents.S_Update_Data_Power, this.checkVideoIconState, this);
        // 更新首次豪礼按钮状态
        cc.systemEvent.on(GameEvents.M_Updata_First_Award_Btn_State, this.checkFirstAwardBtnState, this);
        // 更新首日特惠按钮状态
        cc.systemEvent.on(GameEvents.M_Updata_Discount_Btn, this.checkDiscountBtnState, this);
        // 更新首页门客角色
        cc.systemEvent.on(GameEvents.M_Change_Home_Doorman_Role, this.changeDoormanRole, this);
    }

    onDisable() {
        // 更新视频icon状态
        cc.systemEvent.off(GameEvents.S_Update_Data_Power, this.checkVideoIconState, this);
        // 更新首次豪礼按钮状态
        cc.systemEvent.off(GameEvents.M_Updata_First_Award_Btn_State, this.checkFirstAwardBtnState, this);
        // 更新首日特惠按钮状态
        cc.systemEvent.off(GameEvents.M_Updata_Discount_Btn, this.checkDiscountBtnState, this);
        // 更新首页门客角色
        cc.systemEvent.off(GameEvents.M_Change_Home_Doorman_Role, this.changeDoormanRole, this);
    }

    onLoad() {
        let arr = [];
        for (let i = 0; i < 25; i++) {
            arr.push(i);
        }
        
        this.scrollViewExtend = new ScrollViewExtend({
            viewNode: this.doormans,
            itemMode: this.doormanPre,
            itemSize: cc.size(140, 220),
            setItemFunc: (node, data, index) => {
                node.getComponent(Item).setData(GameDataCenter.doormanUnlockList[index - 1], index - 1);
            }
        });

        this.scrollViewExtend.setDatas({ datas: arr });
    }

    start() {
        GameDataCenter.curGameLevel = GameDataCenter.historyGameLevel;
        GameDataCenter.curGameLevelIndex = GameDataCenter.curGameLevel;

        this.checkFirstSign();
        this.checkVideoIconState();
        this.checkFirstAwardBtnState();
        this.checkDiscountBtnState();
        this.changeDoormanRole();

        if (GameDataCenter.curPanelName == '游戏页') {
            // 重置关卡进度条
            cc.systemEvent.emit(GameEvents.M_Reset_Level_Progress);
        } else {
            this.openLevelProgress();
        }

        GameDataCenter.curPanelName = '首页';
    }

    // =======================================
    // 自定义事件回调(以on开头)
    // =======================================

    /** 开始按钮 */
    onClickStart() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Btn_Click);

        if (this.isClicked) {
            return;
        }
        this.isClicked = true;
        
        if (this.videoIcon.active) {
            
            return;
        }
        
        Power.onPowerSub();
        this.startGameEffect();
    }

    /** 首次奖励按钮 */
    onClickReward() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Btn_Click);

        let bundle = cc.assetManager.getBundle('firstAward');
        if (!bundle) {
            cc.assetManager.loadBundle('firstAward', (err, bundle) => {
                if (err) { return console.log('加载firstAward bundle 失败:', err) };
                
                UIManager.open('firstAward/FirstAwardPanel');
            });
        } else {
            UIManager.open('firstAward/FirstAwardPanel');
        }
    }

    /** 打开关卡进度条 */
    openLevelProgress() {
        const bundle = cc.assetManager.getBundle('levelProgress');
        if (!bundle) {
            cc.assetManager.loadBundle('levelProgress', (err, bundle) => {
                if (err) { return console.log('加载levelProgress bundle 失败:', err) };
                UIManager.open('levelProgress/LevelProgress');
            });
        } else {
            UIManager.open('levelProgress/LevelProgress');
        }
    }

    /** 开始游戏特效 */
    startGameEffect() {
        cc.systemEvent.emit(GameEvents.M_Start_Game_Effect, this.openGamePanel);
    }
 
    /** 跳转游戏页 */
    openGamePanel() {
        let bundle = cc.assetManager.getBundle('game');
        if (!bundle) {
            cc.assetManager.loadBundle('game', (err, bundle) => {
                if (err) { return console.log('加载game bundle 失败:', err) };
                
                UIManager.close('home/HomePanel', true);
                UIManager.open('game/GamePanel');
            });
        } else {
            UIManager.close('home/HomePanel', true);
            UIManager.open('game/GamePanel');
        }
    }

    /** 检测视频icon状态 */
    checkVideoIconState() {
        this.videoIcon.active = Power.isStartGame() ? false : true;
    }
    
    /** 检测首次豪礼按钮状态 */
    checkFirstAwardBtnState() {
        this.firstAwardBtn.active = GameDataCenter.isFirstAward ? true : false;
    }

    /** 检测特惠按钮状态 */
    checkDiscountBtnState() {
        this.discountBtn.active = GameDataCenter.discountData.isShow ? true : false;
        this.luckDrawBtn.active = GameDataCenter.discountData.isShow ? false : true;
    }

    /** 检测登录界面 */
    checkFirstSign() {
        if (!GameDataCenter.isShowSign || !GameDataCenter.isTodayFirstSign) {
            return;
        }
        
        let bundle = cc.assetManager.getBundle('sign');
        if (!bundle) {
            cc.assetManager.loadBundle('sign', (err, bundle) => {
                if (err) { return console.log('加载sign bundle 失败:', err) };
                
                UIManager.open('sign/SignPanel');
            });
        } else {
            UIManager.open('sign/SignPanel');
        }
    }

    /** 视频结束回调 */
    videoCallback(err, res) {
        if (err) {
            return
        }

        this.startGameEffect();
    }

    /** 更换门客角色 */
    changeDoormanRole() {
        // 更换左侧门客角色
        const bundle = cc.assetManager.getBundle('common');
        bundle.loadDir(`res/spine/doorman_${GameDataCenter.doormanRoleGrade.left}`, sp.SkeletonData, (err, data: any) => {
            if (data[0]) {
                this.doormanRole[0].skeletonData = data[0];
                this.doormanRole[0].defaultSkin = data[0].skeletonJson.skins[0].name;
                this.doormanRole[0].animation = "idle";
            }
        });

        // 更换右侧门客角色
        bundle.loadDir(`res/spine/doorman_${GameDataCenter.doormanRoleGrade.right}`, sp.SkeletonData, (err, data: any) => {
            if (data[0]) {
                this.doormanRole[1].skeletonData = data[0];
                this.doormanRole[1].defaultSkin = data[0].skeletonJson.skins[0].name;
                this.doormanRole[1].animation = "idle";
            }
        });
    }
}
