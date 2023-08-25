/**
 * 体力系统
 */

import { GameDataCenter } from "../../config/GameDataCenter";
import { GameEvents, powerFlyUpConfig } from "../../config/GConfig";




 
const {ccclass, property} = cc._decorator;

@ccclass
export class PowerSystem extends cc.Component {

    @property(cc.Node)
    powerNode: cc.Node = null;


    onEnable() {
        cc.systemEvent.on(GameEvents.M_Collect_Effect, this.showEffect, this);
        cc.systemEvent.on(GameEvents.M_Start_Game_Effect, this.startGameEffect, this);
    }

    onDisable() {
        cc.systemEvent.off(GameEvents.M_Collect_Effect, this.showEffect, this);
        cc.systemEvent.off(GameEvents.M_Start_Game_Effect, this.startGameEffect, this);
    }

    onLoad() { 
        GameDataCenter._powerLabel = this.powerNode;
    }

    start() {
        this.createNodes();
    }

    /** 创建隐藏节点 */
    createNodes() {
        this.schedule(() => {
            let power = cc.instantiate(this.powerNode);
            power.opacity = 0;
            power.parent = GameDataCenter._powerLabel;
        }, 0, 9);
    }

    /** 收集效果 
     * @param many 数量
    */
    showEffect(many) {
        for (let i = 0; i < many; i++) {
            let item: cc.Node = GameDataCenter._powerLabel.children[i];
            let startPos = powerFlyUpConfig[many].startPos[i];
            cc.tween(item)
                .set({ opacity: 255, scale: 1, position: startPos })
                .delay(0.05 * i)
                .parallel(
                    cc.tween().bezierTo(0.7, cc.v2(startPos.x, startPos.y),
                        cc.v2(startPos.x, startPos.y + 150),
                        cc.v2(0, 0)),
                    cc.tween().to(0.7, { scale: 1.2 })
                )
                .set({ opacity: 0 })
                .call(() => {
                    GameDataCenter.power += 1;
                })
                .start();
        }
    }

    /** 开始游戏效果 */
    startGameEffect(call) {
        cc.tween(GameDataCenter._powerLabel.children[0])
            .set({opacity: 255, scale: 1, x: 0, y: 0})
            .to(0.6, { x: 285, y: -1125, scale: 0.8 }, { easing: 'smooth' })
            .set({ opacity: 0 })
            .call(() => {
                call();
            })
            .start();
    }
}
