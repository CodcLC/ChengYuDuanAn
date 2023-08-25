/**
 * 字块
 */




 
const {ccclass, property} = cc._decorator;

@ccclass
export class Block extends cc.Component {

    @property({ type: cc.Node, tooltip: '正确背景' })
    correctBg: cc.Node = null;

    @property({ type: cc.Node, tooltip: '错误背景' })
    wrongBg: cc.Node = null;
    
    @property({ type: cc.Label, tooltip: '字' })
    wordLab: cc.Label = null;


    /** 自身字体 */
    private selfWord: string = null;
    

    setWord(word) {
        // init TODO:
        this.selfWord = word;
        this.wordLab.string = word;
    }

    /** 出场效果 */
    appearEffect() {
        cc.tween(this.node).to(0.2, { scale: 1 }, { easing: 'backOut' }).start();
    }

    /** 正确效果 */
    correctEffect() {
        cc.tween(this.node)
            .to(0.08, { scale: 1.2 })
            .call(() => {
                this.correctBg.active = true;
                this.wordLab.node.color = cc.Color.WHITE;
            })
            .to(0.08, { scale: 1 })
            .start();
    }

    /** 下落消失效果 */
    disappearEffect() {
        cc.tween(this. node)
            .to(0.15, { y: this.node.y - 80, opacity: 0 })
            .removeSelf()
            .start();
    }

    /** 错误效果 */
    wrongEffect() {
        this.wrongBg.active = true;
        this.wordLab.node.color = cc.Color.RED;
        cc.tween(this.node).by(0.08, { x: -7 }).by(0.08, { x: 7 }).union().repeat(3).start();
    }
}
