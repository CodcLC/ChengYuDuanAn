/**
 * 题目层
 */

import { GameDataCenter } from "../../config/GameDataCenter";
import { GameEvents, GameSounds, unlockDoormanLevel, unlockOfficialLevel } from "../../config/GConfig";
import { UIManager } from "../../framework/UIManager";
import { LevelConfig } from "./LevelConfig";
import { LevelManager } from "./LevelManager";




 
const {ccclass, property} = cc._decorator;

@ccclass
export class TitleLayer extends cc.Component {

    onEnable() {
        cc.systemEvent.on(GameEvents.M_Fill_Idiom, this.fillIdiom, this);
    }

    onDisable() {
        cc.systemEvent.off(GameEvents.M_Fill_Idiom, this.fillIdiom, this);
    }

    fillIdiom(word) {
        // 诗词填充
        if (LevelConfig[GameDataCenter.curGameLevelIndex].levelType == 3) {
            let curStr = LevelManager.vacancyBlock.getChildByName('word').getComponent(cc.Label).string;
            let searchStr = null;
            if (curStr.indexOf("(上一句)") != -1) {
                searchStr = "(上一句)";
            } else if (curStr.indexOf("(下一句)") != -1) {
                searchStr = "(下一句)";
            }

            curStr = curStr.replace(searchStr, word);
            LevelManager.vacancyBlock.getChildByName('word').getComponent(cc.Label).string = curStr;
        } else {
            LevelManager.vacancyBlock.getChildByName('word').getComponent(cc.Label).string = word;
        }

        if (word == LevelConfig[GameDataCenter.curGameLevelIndex].correct) {
            // 成功
            this.fillSuccess();
        } else {
            // 失败
            this.fillFail();
        }
    }

    /** 填充成功 */
    fillSuccess() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Correct);

        let intervalTime = 0;
        
        for (let i = 0; i < LevelManager.blockCtrArr.length; i++) {
            this.scheduleOnce(() => {
                LevelManager.blockCtrArr[i].correctEffect();
                if (i == LevelManager.blockCtrArr.length - 1) {
                    this.disappear();
                }
            }, intervalTime);

            intervalTime += 0.05;
        }

        this.selectBlockDisappear();
    }

    /** 下落消失效果 */
    disappear() {
        let intervalTime = 0.2;
        for (let i = 0; i < LevelManager.blockCtrArr.length; i++) {
            this.scheduleOnce(() => {
                LevelManager.blockCtrArr[i].disappearEffect();
                if (i == LevelManager.blockCtrArr.length - 1) {
                    this.gameRoundeEnd(true);
                }
            }, intervalTime);

            intervalTime += 0.1;
        }
    }

    /** 填充失败 */
    fillFail() {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Wrong);

        for (let i = 0; i < LevelManager.blockCtrArr.length; i++) {
            LevelManager.blockCtrArr[i].wrongEffect();
        }

        this.selectBlockDisappear();
        this.scheduleOnce(() => {
            this.gameRoundeEnd(false);
        }, 0.8);
    }

    /** 选择方块消失 */
    selectBlockDisappear() {
        // 选择方块消失
        for (let j = 0; j < LevelManager.selectBlockCtrArr.length; j++) {
            LevelManager.selectBlockCtrArr[j].disappearEffect();
        }
    }


    /** 游戏回合结束 */
    gameRoundeEnd(isWin) {
        LevelManager.blockCtrArr = [];
        LevelManager.selectBlockCtrArr = [];
        LevelManager.vacancyBlock = null;

        if (isWin) {
            this.gameWin();
        } else {
            this.gameFail();
        }
    }

    /** 游戏胜利 */
    gameWin() {
        // 判定是否触发加官进爵
        if (unlockOfficialLevel.indexOf(GameDataCenter.curGameLevel + 1) != -1) {
            // 暂停游戏时间
            cc.systemEvent.emit(GameEvents.M_Begin_Of_Stop_Time, false);

            UIManager.open('unlock/OfficialUnlockPanel');
            return;
        }

        // 判定是否触发门客招纳
        if (unlockDoormanLevel.indexOf(GameDataCenter.curGameLevel + 1) != -1) {
            // 暂停游戏时间
            cc.systemEvent.emit(GameEvents.M_Begin_Of_Stop_Time, false);
            
            UIManager.open('unlock/DoormanUnlockPanel');
            return;
        }
 
        // 下一关
        this.scheduleOnce(() => {
            GameDataCenter.curGameLevel++;
            GameDataCenter.curGameLevelIndex = GameDataCenter.curGameLevel;
            
            cc.systemEvent.emit(GameEvents.M_Init_Level);

            // 更新关卡进度条
            cc.systemEvent.emit(GameEvents.M_Updata_Level_Progress);
        }, 0.2);
    }

    /** 游戏失败 */
    gameFail() {
        // 暂停游戏时间
        cc.systemEvent.emit(GameEvents.M_Begin_Of_Stop_Time, false);

        const bundle = cc.assetManager.getBundle('fail');
        if (!bundle) {
            cc.assetManager.loadBundle('fail', (err, bundle) => {
                if (err) { return console.log('加载fail bundle 失败:', err) };
                
                UIManager.open('fail/FailPanel');
            });
        } else {
            UIManager.open('fail/FailPanel');
        }
    }
}
