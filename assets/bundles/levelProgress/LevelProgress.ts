/**
 * 关卡进度条
 */

import { GameDataCenter } from "../config/GameDataCenter";
import { GameEvents, unlockDoormanLevel, unlockOfficialLevel } from "../config/GConfig";




 
const {ccclass, property} = cc._decorator;

@ccclass
export class LevelProgress extends cc.Component {
    
    @property({ type: cc.Prefab, tooltip: '底部预制体' })
    bottomPre: cc.Prefab = null;
    
    @property({ type: cc.Prefab, tooltip: '填充预制体' })
    fillPre: cc.Prefab = null;

    @property({ type: cc.Node, tooltip: '底部节点层' })
    bottomLayer: cc.Node = null;

    @property({ type: cc.Node, tooltip: '填充节点层' })
    fillLayer: cc.Node = null;

    @property({ type: cc.Node, tooltip: '标识节点层' })
    flagLayer: cc.Node = null;
    
    @property({ type: cc.Node, tooltip: '关卡索引' })
    levelIndex: cc.Node = null;

    @property({ type: cc.Label, tooltip: '关卡数' })
    levelNum: cc.Label = null;

    @property({ type: cc.Prefab, tooltip: '官人预制体' })
    officialPre: cc.Prefab = null;

    @property({ type: cc.Prefab, tooltip: '门客预制体' })
    doormanPre: cc.Prefab = null;


    /** 进度条索引 */
    private index = 0;
    /** 当前关卡范围 */
    private curLevelRange = [];
    /** 官职索引 */
    private officialIndex = -1;
    /** 门客索引 */
    private doormanIndex = -1;

    
    onEnable() {
        this.node.zIndex = 800;

        cc.systemEvent.on(GameEvents.M_Updata_Level_Progress, this.updataProgress, this);
        cc.systemEvent.on(GameEvents.M_Reset_Level_Progress, this.resetProgress, this);
    }

    onDisable() {
        cc.systemEvent.off(GameEvents.M_Updata_Level_Progress, this.updataProgress, this);
        cc.systemEvent.off(GameEvents.M_Reset_Level_Progress, this.resetProgress, this);
    }

    onLoad() {
        this.initProgress();
    }

    /** 初始化进度条 */
    initProgress() {
        // 创建底部节点
        for (let i = 0; i < 14; i++) {
            let node = cc.instantiate(this.bottomPre);
            node.x = -299 + (i * 46);
            node.parent = this.bottomLayer;
        }

        this.updataInfo();
    }

    /** 更新进度条 */
    updataProgress() {
        let node = cc.instantiate(this.fillPre);
        node.x = -299 + (this.index * 46);
        node.parent = this.fillLayer;

        this.index++;
        this.levelIndex.x += 46;
        this.levelNum.string = `${GameDataCenter.curGameLevel + 1}题`;
        
        this.updataDifferLevel();
    }

    /** 重置进度条 */
    resetProgress() {
        this.index = 0;
        this.curLevelRange = [];
        this.officialIndex = -1;
        this.doormanIndex = -1;

        // 清空填充层
        this.fillLayer.removeAllChildren();
        // 清空标识层
        this.flagLayer.removeAllChildren();

        this.updataInfo();
    }

    /** 重置信息 */
    updataInfo() {
        // 当前关卡范围
        for (let i = GameDataCenter.curGameLevel + 1; i < GameDataCenter.curGameLevel + 15; i++) {
            this.curLevelRange.push(i);
        }
        
        // 检测解锁官职关卡
        let officialLevel = unlockOfficialLevel[GameDataCenter.levelOfficialGrade];
        this.officialIndex = this.curLevelRange.indexOf(officialLevel);
        if (this.officialIndex != -1) {
            let x = this.bottomLayer.children[this.officialIndex].x;
            let officialNode = cc.instantiate(this.officialPre);
            officialNode.x = x + 21;
            officialNode.parent = this.flagLayer;
        }

        // 检测解锁门客关卡
        let doormanLevel = unlockDoormanLevel[GameDataCenter.levelDoormanGrade];
        this.doormanIndex = this.curLevelRange.indexOf(doormanLevel);
        if (this.doormanIndex != -1) {
            let x = this.bottomLayer.children[this.doormanIndex].x;
            let doormanNode = cc.instantiate(this.doormanPre);
            doormanNode.x = x + 21;
            doormanNode.parent = this.flagLayer;
        }

        // 索引
        this.levelIndex.x = -299;
        this.levelNum.string = `${GameDataCenter.curGameLevel + 1}题`;

        this.updataDifferLevel();
    }

    /** 更新相差关卡 */
    updataDifferLevel() {
        if (this.officialIndex != -1 && this.doormanIndex != -1) {
            // 第一种 两个都存在 取最近的
            if (this.officialIndex < this.doormanIndex) {
                GameDataCenter.differLevelInfo.differLevel = (this.officialIndex + 1) - this.index;
                GameDataCenter.differLevelInfo.type = '加官进爵';
            } else {
                GameDataCenter.differLevelInfo.differLevel = (this.doormanIndex + 1) - this.index;
                GameDataCenter.differLevelInfo.type = '招纳门客';
            }
        } else {
            // 第二种 一种存在 取一种
            if (this.officialIndex != -1) {
                GameDataCenter.differLevelInfo.differLevel = (this.officialIndex + 1) - this.index;
                GameDataCenter.differLevelInfo.type = '加官进爵';
            } else if (this.doormanIndex != -1) {
                GameDataCenter.differLevelInfo.differLevel = (this.doormanIndex + 1) - this.index;
                GameDataCenter.differLevelInfo.type = '招纳门客';
            }
        }
    }
}
