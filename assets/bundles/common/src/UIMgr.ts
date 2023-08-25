/**
 * 首页弹窗管理类
 */

export class UIMgr {
    /**
     * 设置页面显示动画
     *
     * @param {*} panel 面板节点，统一做缩放
     * @param {*} mask 遮罩节点
     * @param {*} callback 回调
     */
    public static setShowAnimation(panel, mask, callback?) {
        if (!panel) {
            return;
        }
        //属性重置，防止无法展示页面
        panel.parent.scale = 1;
        panel.parent.opacity = 255;

        if (mask) {
            mask.active = true;
            mask.scale = 1;
        }

        panel.scale = 0.7;
        cc.tween(panel)
            .to(0.2, {
                scale: 1
            }, {
                easing: "backOut"
            })
            .call(() => {
                callback && callback();
            })
            .start();
    }

    /**
     * 设置页面关闭动画
     *
     * @param {*} panel 面板节点，统一做缩放
     * @param {*} mask 遮罩节点
     * @param {*} callback 回调
     */
    public static setHideAnimation(panel, mask, callback?) {
        if (!panel) {
            return;
        }
        cc.tween(panel)
            .to(0.1, {
                scale: 0.7
            })
            .call(() => {
                if (mask) {
                    mask.active = false;
                }
                callback && callback();
            })
            .start();
    }
}
