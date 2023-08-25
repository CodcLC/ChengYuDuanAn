/**
 * 代码描述
 */

import { GameDataCenter } from "../config/GameDataCenter";
import { UIManager } from "../framework/UIManager";




 
const {ccclass, property} = cc._decorator;

@ccclass
export class TestPanel extends cc.Component {

    @property({ type: cc.Label, tooltip: '关卡' })
    levelLab: cc.Label = null;
    @property({ type: cc.Label, tooltip: '左门客' })
    leftLab: cc.Label = null;
    @property({ type: cc.Label, tooltip: '右门客' })
    rightLab: cc.Label = null;


    /** 关卡 */
    private levelCount: number = 0;
    /** 左门客 */
    private leftCount: number = 1;
    /** 右门客 */
    private rigthCount: number = 1;

    /** 是否选择关卡 */
    private isSelectLevel: boolean = true;
    /** 是否选择左门客 */
    private isSelectLeft: boolean = true;
    /** 是否选择右门客 */
    private isSelectRight: boolean = true;
    /** 是否选择解锁全部门客 */
    private isSelectDoorman: boolean = true;


    /** 关闭按钮 */
    onClickClose() {
        UIManager.close('test/TestPanel', true);
    }

    /** 确定按钮 */
    onClickDetermine() {
        if (this.isSelectLevel) {
            GameDataCenter.historyGameLevel = this.levelCount;
        }

        if (this.isSelectLeft) {
            // 可解锁新门客
            let doormanRoleGrade = GameDataCenter.doormanRoleGrade;
            doormanRoleGrade.left = this.leftCount;
            GameDataCenter.doormanRoleGrade = doormanRoleGrade;
        }
        
        if (this.isSelectRight) {
            // 可解锁新门客
            let doormanRoleGrade = GameDataCenter.doormanRoleGrade;
            doormanRoleGrade.right = this.rigthCount;
            GameDataCenter.doormanRoleGrade = doormanRoleGrade;
        }
        
        if (this.isSelectDoorman) {
            let doormanUnlockList = GameDataCenter.doormanUnlockList;
            for (let i in doormanUnlockList) {
                doormanUnlockList[i] = 2;
            }
            GameDataCenter.doormanUnlockList = doormanUnlockList;
        }

        UIManager.close('test/TestPanel', true);
    }

    /** 点击选择按钮 */
    onClickSelect(event: cc.Event, customData: string) {
        let tick = event.target.getChildByName('tick');
        tick.active = !tick.active;
        event.target.parent.opacity = tick.active ? 255 : 50;
        switch (customData) {
            case '1':
                this.isSelectLevel = tick.active;
                break;
            case '2':
                this.isSelectLeft = tick.active;
                break;
            case '3':
                this.isSelectRight = tick.active;
                break;
            case '4':
                this.isSelectDoorman = tick.active;
                break;
        }
    }
    
    /** 关卡增加按钮 */
    onClickLevelAdd(event: cc.Event, customData: string) {
        if (customData == '1') {
            this.levelCount += 10;
        } else {
            this.levelCount++;
        }
        this.levelLab.string = `${this.levelCount}`;
    }

    /** 关卡减少按钮 */
    onClickLevelReduce(event: cc.Event, customData: string) {
        if (customData == '1') {
            this.levelCount -= 10;
        } else {
            this.levelCount--;
        }

        if (this.levelCount <= 0) {
            this.levelCount = 0;
        }
        this.levelLab.string = `${this.levelCount}`;
    }

    /** 门客增加按钮 */
    onClickDoormanAdd(event: cc.Event, customData: string) {
        if (customData == '0') {
            this.leftCount++;
            this.leftLab.string = `${this.leftCount}`;
        } else if (customData == '1') {
            this.rigthCount++;
            this.rightLab.string = `${this.rigthCount}`;
        }
    }

    /** 门客减少按钮 */
    onClickDoormanReduce(event: cc.Event, customData: string) {
        if (customData == '0') {
            this.leftCount--;
            if (this.leftCount <= 1) {
                this.leftCount = 1;
            }
            this.leftLab.string = `${this.leftCount}`;
        } else if (customData == '1') {
            this.rigthCount--;
            if (this.rigthCount <= 1) {
                this.rigthCount = 1;
            }
            this.rightLab.string = `${this.rigthCount}`;
        }
    }
}
