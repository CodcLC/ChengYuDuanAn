/**
 * 关卡管理者
 */

import { GameDataCenter } from "../../config/GameDataCenter";
import { GameEvents } from "../../config/GConfig";
import { Random } from "../../framework/Random";
import { Block } from "./Block";
import { LevelConfig } from "./LevelConfig";
import { PinyinBlock } from "./PinyinBlock";
import { PoetryBlock } from "./PoetryBlock";
import { SelectBlock } from "./SelectBlock";




 
const {ccclass, property} = cc._decorator;

@ccclass
export class LevelManager extends cc.Component {

    @property({ type: cc.Node, tooltip: '题目层' })
    titleLayer: cc.Node = null;

    @property({ type: cc.Node, tooltip: '选择层' })
    selectLayer: cc.Node = null;

    @property({ type: cc.Prefab, tooltip: '字块预制体' })
    blockPre: cc.Prefab = null;

    @property({ type: cc.Prefab, tooltip: '拼音字块预制体' })
    pinyinBlockPre: cc.Prefab = null;

    @property({ type: cc.Prefab, tooltip: '诗词字块预制体' })
    poetryBlockPre: cc.Prefab = null;

    @property({ type: cc.Prefab, tooltip: '选择字块预制体' })
    selectBlockPre: cc.Prefab = null;


    /** 字块控件集合 */
    public static blockCtrArr = [];
    /** 选择字块控件集合 */
    public static selectBlockCtrArr = [];
    /** 空缺方块 */
    public static vacancyBlock = null;
    

    onEnable() {
        cc.systemEvent.on(GameEvents.M_Init_Level, this.initLevel, this);
    }

    onDisable() {
        cc.systemEvent.off(GameEvents.M_Init_Level, this.initLevel, this);
    }

    start() {
        this.initLevel();
    }

    /** 初始化关卡 */
    initLevel() {
        // 清空
        this.titleLayer.childrenCount != 0 && this.titleLayer.removeAllChildren();
        this.selectLayer.childrenCount != 0 && this.selectLayer.removeAllChildren();
        LevelManager.blockCtrArr = [];
        LevelManager.selectBlockCtrArr = [];

        let levelData = LevelConfig[GameDataCenter.curGameLevelIndex];
        if (!levelData) {
            // 关卡满 随机关卡 防止重复关卡 移除随机池
            if (GameDataCenter.levelBackups.length == 0) {
                for (let i = 0; i < LevelConfig.length; i++) {
                    GameDataCenter.levelBackups.push(i);
                }
            }

            let random = Random.randomNumber(0, GameDataCenter.levelBackups.length - 1);
            let index = GameDataCenter.levelBackups[random];
            levelData = LevelConfig[index];
            GameDataCenter.levelBackups.splice(random, 1);
            GameDataCenter.curGameLevelIndex = index;
        }
        
        // 判定关卡类型  1:成语 2:拼音 3:诗词
        switch (levelData.levelType) {
            case 1:
                this.idiomInit(levelData);
                break;
            case 2:
                this.pinyinInit(levelData);
                break;
            case 3:
                this.poetryInit(levelData);
                break;
        }
    }

    /** 成语初始化 */
    idiomInit(levelData) {
        let intervalTime = 0;
        // 创建字块
        for (let i = 0; i < levelData.word.length; i++) {
            let blockNode: cc.Node = cc.instantiate(this.blockPre);
            blockNode.x = -240 + (160 * i);
            blockNode.y = 400;
            blockNode.scale = 0;
            blockNode.parent = this.titleLayer;

            // 填充文字
            let word = i != levelData.vacancy ? levelData.word[i] : " ";
            let blockCtr = blockNode.getComponent(Block);
            blockCtr.setWord(word);

            if (word === " ") {
                LevelManager.vacancyBlock = blockNode;
            }
            
            LevelManager.blockCtrArr.push(blockCtr);

            // 出现效果
            this.scheduleOnce(() => {
                blockCtr.appearEffect();
            }, intervalTime);
            intervalTime += 0.05;
        }

        this.creterSelectBlock(levelData);
    }

    /** 拼音初始化 */
    pinyinInit(levelData) {

        let intervalTime = 0;

        // 创建方块
        for (let i = 0; i < levelData.word.length; i++) {
            let blockNode: cc.Node = cc.instantiate(this.blockPre);
            blockNode.x = -80 * (levelData.word.length - 1) + (160 * i);
            blockNode.y = 400;
            blockNode.scale = 0;
            blockNode.parent = this.titleLayer;

            let word = levelData.word[i];
            let blockCtr = blockNode.getComponent(Block);
            blockCtr.setWord(word);

            // 出现效果
            this.scheduleOnce(() => {
                blockCtr.appearEffect();
            }, intervalTime);
            intervalTime += 0.05;

            LevelManager.blockCtrArr.push(blockCtr);

            // 创建拼音方块
            if (i == levelData.vacancy) {
                let pinyinBlockNode: cc.Node = cc.instantiate(this.pinyinBlockPre);
                pinyinBlockNode.x = 0;
                pinyinBlockNode.y = 55;
                pinyinBlockNode.scale = 0;
                pinyinBlockNode.parent = blockNode;

                LevelManager.vacancyBlock = pinyinBlockNode;

                let pinyinBlockCtr = pinyinBlockNode.getComponent(PinyinBlock);
                // 出场效果
                pinyinBlockCtr.appearEffect();

                LevelManager.blockCtrArr.push(pinyinBlockCtr);
            }
        }

        this.creterSelectBlock(levelData);
    }

    /** 诗句初始化 */
    poetryInit(levelData) {
        // 创建诗词方块
        let poetryBlockNode: cc.Node = cc.instantiate(this.poetryBlockPre);
        poetryBlockNode.y = 400;
        poetryBlockNode.scale = 0;
        poetryBlockNode.parent = this.titleLayer;

        LevelManager.vacancyBlock = poetryBlockNode;

        // 填充文字
        let word = levelData.word;
        let data = {
            word: word,
        }
        let poetryBlockCtr = poetryBlockNode.getComponent(PoetryBlock);
        poetryBlockCtr.setData(data);

        // 出场效果
        poetryBlockCtr.appearEffect();

        LevelManager.blockCtrArr.push(poetryBlockCtr);

        this.creterSelectBlock(levelData);
    }

    /** 创建选择字块 */
    creterSelectBlock(levelData) {
        // 随机位置
        let posIndex = Random.randomNumber(0, 1);

        for (let j = 0; j < 2; j++) {
            let selectBlockNode: cc.Node = cc.instantiate(this.selectBlockPre);
            selectBlockNode.x = j ? 180 : -180;
            selectBlockNode.y = 250;

            // 填充文字
            let word = j == posIndex ? levelData.wrong : levelData.correct;

            if (levelData.levelType == 3) {
                selectBlockNode.width = 42 * word.length;
                selectBlockNode.height = 68;
            } else if (levelData.levelType == 2) {
                selectBlockNode.width = word.length > 2 ? 120 + ((word.length - 2) * 30) : 120;
                selectBlockNode.height = 78;
            } else {
                selectBlockNode.width = 120;
                selectBlockNode.height = 78;
            }
            
            selectBlockNode.scale = 0;
            selectBlockNode.parent = this.selectLayer;

            let data = {
                word: word,
                posY: levelData.levelType == 3 ? 35 : 40,
                fontSize: levelData.levelType == 3 ? 36 : 62,
            }
            let selectBlockCtr = selectBlockNode.getComponent(SelectBlock);
            selectBlockCtr.setData(data);

            selectBlockCtr.appearEffect();

            LevelManager.selectBlockCtrArr.push(selectBlockCtr);
        }
    }
}
