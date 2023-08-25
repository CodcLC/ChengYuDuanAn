/**
 * 游戏管理中心
 */

import { UIManager } from "../../framework/UIManager";




const { ccclass } = cc._decorator;

@ccclass
export class GameManager extends cc.Component {

    start() {
        cc.macro.ENABLE_MULTI_TOUCH = false;

        UIManager.open('home/HomePanel');
    }
}
