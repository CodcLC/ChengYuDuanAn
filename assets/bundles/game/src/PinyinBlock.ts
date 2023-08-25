/**
 * 拼音方块
 */




 
const {ccclass, property} = cc._decorator;

@ccclass
export class PinyinBlock extends cc.Component {

    // =======================================
    // 编辑器属性定义(以@property修饰)
    // =======================================
    @property({ type: cc.Node, tooltip: '正确背景' })
    correctBg: cc.Node = null;

    @property({ type: cc.Label, tooltip: '字' })
    wordLab: cc.Label = null;


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
        cc.tween(this.node)
            .to(0.15, { y: this.node.y - 80, opacity: 0 })
            .removeSelf()
            .start();
    }

    /** 错误效果 */
    wrongEffect() {
        this.wordLab.node.color = cc.Color.RED;
    }
}
