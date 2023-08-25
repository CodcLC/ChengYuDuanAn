/**
 * 选择字块
 */

import { GameEvents } from "../../config/GConfig";




 
const {ccclass, property} = cc._decorator;

@ccclass
export class SelectBlock extends cc.Component {

    @property({ type: cc.Label, tooltip: '字' })
    wordLab: cc.Label = null;


    /** 自身字体 */
    private selfWord: string = null;
    /** 是否点击 */
    private isClicked: boolean = false;
    


    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
    }

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
    }
    
    onTouchEnded(event: cc.Event.EventTouch) {
        if (this.isClicked) {
            return;
        }
        this.isClicked = true;
        
        cc.systemEvent.emit(GameEvents.M_Fill_Idiom, this.selfWord);
    }
    
    setData(data) {
        // init TODO:
        this.selfWord = data.word;
        this.wordLab.node.y = data.posY;
        this.wordLab.fontSize = data.fontSize;
        this.wordLab.string = data.word;
    }

    /** 出场效果 */
    appearEffect() {
        cc.tween(this.node).to(0.2, { scale: 1 }, { easing: 'backOut' }).start();
    }

    /** 消失效果 */
    disappearEffect() {
        cc.tween(this.node).to(0.1, { scale: 1.1 }).to(0.2, { scale: 0 }, { easing: 'backIn' }).removeSelf().start();
    }
}
