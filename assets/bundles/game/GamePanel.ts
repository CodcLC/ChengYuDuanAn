/**
 * 游戏页
 */


import { GameDataCenter } from "../config/GameDataCenter";
import { GameEvents, GameSounds } from "../config/GConfig";
import { UIManager } from "../framework/UIManager";
import { LevelConfig } from "../game/src/LevelConfig";




 
const {ccclass, property} = cc._decorator;

@ccclass
export class GamePanel extends cc.Component {

    @property({ type: cc.Label, tooltip: '计时文本'})
    timeLab: cc.Label = null;

    @property({ type: sp.Skeleton, tooltip: '官人角色'})
    officialRole: sp.Skeleton = null;

    @property({ type: sp.Skeleton, tooltip: '门客'})
    doormanRole: sp.Skeleton[] = [];

    @property({ type: cc.Node, tooltip: '升级横幅'})
    upgradeTitle: cc.Node = null;

    @property({ type: cc.Prefab, tooltip: '升级动画'})
    upgradeAim: cc.Prefab = null;
    

    /** 当前计时数 */
    public static timeCount: number = 90;
    

    onEnable() {
        // 更换官人角色
        cc.systemEvent.on(GameEvents.M_Upgrade_Official_Role, this.upgradeOfficialRole, this);
        // 更换门客角色
        cc.systemEvent.on(GameEvents.M_Change_Game_Doorman_Role, this.changeDoormanRole, this);
        // 开始或停止游戏计时器
        cc.systemEvent.on(GameEvents.M_Begin_Of_Stop_Time, this.beginOfStopTime, this);
    }

    onDisable() {
        // 更换官人角色
        cc.systemEvent.off(GameEvents.M_Upgrade_Official_Role, this.upgradeOfficialRole, this);
        // 更换门客角色
        cc.systemEvent.off(GameEvents.M_Change_Game_Doorman_Role, this.changeDoormanRole, this);
        // 开始或停止游戏计时器
        cc.systemEvent.off(GameEvents.M_Begin_Of_Stop_Time, this.beginOfStopTime, this);
    }

    /** 在组件第一次update前调用，做一些初始化逻辑 */
    start() {
        GameDataCenter.curPanelName = '游戏页';
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Game_Start);

        // 首次进入游戏
        if (GameDataCenter.isFirstSign) {
            GameDataCenter.isFirstSign = false;
            GameDataCenter.isShowSign = false;
            GameDataCenter.curGameLevel = GameDataCenter.historyGameLevel;
            GameDataCenter.curGameLevelIndex = GameDataCenter.curGameLevel;
            UIManager.open('levelProgress/LevelProgress');
        }

        GamePanel.timeCount = 90;
        this.beginOfStopTime(true);

        this.changeOfficialRole();
        this.changeDoormanRole();

        // 官人出场动作
        cc.tween(this.officialRole.node.parent)
            .set({ y: -295 })
            .to(0.3, { y: -195 })
            .start();

        console.log('=----======', cc.find('Canvas'));
    }

    /** 返回首页按钮 */
    onClickBackHomeBtn() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Btn_Click);

        UIManager.close('game/GamePanel', true);
        UIManager.open('home/HomePanel');
    }

    /** 分享提示按钮 */
    onClickShareTipsBtn() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Btn_Click);

        this.tips();
    }

    /** 视频提示按钮 */
    onClickVideoTipsBtn() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Btn_Click);

        this.tips();
    }

    /** 开始或停止计数器 */
    beginOfStopTime(isBegin: boolean) {
        if (isBegin) {
            this.timeLab.string = `${GamePanel.timeCount}秒`;
            this.schedule(this.timing, 1);
        } else {
            this.unschedule(this.timing);
        }
    }

    /** 计时显示 */
    timing() {
        GamePanel.timeCount -= 1;
        this.timeLab.string = `${GamePanel.timeCount}秒`;

        if (GamePanel.timeCount <= 10) {
            cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Warn);
        }

        // 到时间
        if (GamePanel.timeCount <= 0) {
            this.beginOfStopTime(false);
            this.openGamePanel();
        }
    }

    /** 时间结束界面 */
    openGamePanel() {
        let bundle = cc.assetManager.getBundle('timeOver');
        if (!bundle) {
            cc.assetManager.loadBundle('timeOver', (err, bundle) => {
                if (err) { return console.log('加载timeOver bundle 失败:', err) };
                
                UIManager.open('timeOver/TimeOverPanel');
            });
        } else {
            UIManager.open('timeOver/TimeOverPanel');
        }
    }

    /** 提示 */
    tips() {
        cc.systemEvent.emit(GameEvents.M_Fill_Idiom, LevelConfig[GameDataCenter.curGameLevelIndex].correct);
    }

    /** 更换官人角色 */
    changeOfficialRole() {
        let bundle = cc.assetManager.getBundle('game');
        bundle.loadDir(`res/spine/official_${GameDataCenter.officialRoleGrade}`, sp.SkeletonData, (err, datas: any) => {
            if (datas[0]) {
                this.officialRole.skeletonData = datas[0];
                this.officialRole.defaultSkin = datas[0].skeletonJson.skins[0].name;
                this.officialRole.animation = "idle";
            }
        });
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

    /** 升级官人角色 */
    upgradeOfficialRole() {

        for (let i = 4; i >= 0; i--) {
            this.upgradeTitle.children[i].opacity = 0;
        }

        let upgradeFly = cc.instantiate(this.upgradeAim);
        upgradeFly.y = -385;
        upgradeFly.active = false;
        upgradeFly.parent = this.node;

        this.scheduleOnce(() => {
            cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Upgrade);

            cc.tween(this.upgradeTitle)
                .set({active: true, opacity: 255})
                .call(() => {
                    cc.tween(this.upgradeTitle.getChildByName('frame'))
                        .set({ scaleY: 0.5, })
                        .to(0.3, { scaleY: 1, opacity: 150 }, { easing: 'backOut' })
                        .start();

                    let time = 0.05;
                    for (let i = 1; i < this.upgradeTitle.childrenCount; i++) {
                        cc.tween(this.upgradeTitle.children[i])
                            .set({ y: -50, })
                            .delay(time * (i - 1))
                            .to(0.5, { y: 0, opacity: 255 }, { easing: 'backOut' })
                            .start();
                    }
                })
                .call(() => {
                    upgradeFly.active = true;
                    this.changeOfficialRole();
                })
                .delay(0.7)
                .to(0.5, { opacity: 0 }, { easing: "sineOut" })
                .call(() => {
                    upgradeFly.destroy();
                })
                .set({active: false})
                .start();
        }, 0.3);
    }
}
