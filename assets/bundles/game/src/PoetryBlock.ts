/**
 * 诗词方块
 */




 
const {ccclass, property} = cc._decorator;

@ccclass
export class PoetryBlock extends cc.Component {

    @property({ type: cc.Label, tooltip: '字' })
    wordLab: cc.Label = null;


    /** 自身字体 */
    private selfWord: string = null;
    

    setData(data) {
        // init TODO:
        this.selfWord = data.word;
        this.wordLab.string = data.word;
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
                this.wordLab.node.color = cc.Color.GREEN;
            })
            .to(0.08, { scale: 1 })
            .start();
    }

    /** 下落消失效果 */
    disappearEffect() {
        cc.tween(this.node)
            .to(0.15, { y: this.node.y - 80, opacity: 0 })
            .removeSelf()
            .start();
    }

    /** 错误效果 */
    wrongEffect() { 
        this.wordLab.node.color = cc.Color.RED;
        cc.tween(this.node).by(0.08, { x: -7 }).by(0.08, { x: 7 }).union().repeat(3).start();
    }

}
