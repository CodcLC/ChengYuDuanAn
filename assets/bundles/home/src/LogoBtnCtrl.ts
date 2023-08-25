/**
 * 文件功能描述
 */

import { UIManager } from "../../framework/UIManager";




 
const {ccclass, property} = cc._decorator;

@ccclass
export class LogoBtnCtrl extends cc.Component {

    // =======================================
    // 编辑器属性定义(以@property修饰)
    // =======================================




    // =======================================
    // 静态属性定义(以static修饰)
    // =======================================

    /** 游戏事件对象 */
    // public static EEventName = {
    //     // 在这里定义事件(key-value形式，key必须全大写下划线分隔，value必须是字符串)
    // };




    // =======================================
    // 外部/内部属性定义(以public/private修饰)
    // =======================================
    // 数据对象缓存
    // private data = null;
    // private datas = [];
    /** 点击次数 */
    private clickCount: number = 0;
    

    // =======================================
    // 生命周期(模板方法，以on开头)
    // =======================================

    /** 在组件第一次update前调用，做一些初始化逻辑 */
    onStart() {
        if (cc.sys.isBrowser) {
            this.enabled = true;
        } else {
            this.enabled = false;
        }
    }

    // =======================================
    // 引擎事件回调(以on开头)
    // =======================================
    /** touch事件回调 */
    // onTouchStart(event: cc.Event.EventTouch) {

    // }
    // onTouchMoved(event: cc.Event.EventTouch) {
    
    // }
    onTouchEnded(event: cc.Event.EventTouch) {
        this.clickCount++;
        if (this.clickCount >= 10) {
            this.clickCount = 0;

            let bundle = cc.assetManager.getBundle('test');
            if (!bundle) {
                cc.assetManager.loadBundle('test', (err, bundle) => {
                    if (err) { return console.log('加载test bundle 失败:', err) };
                    UIManager.open('test/TestPanel');
                });
            } else {
                UIManager.open('test/TestPanel');
            }
        }
    }
    // onTouchCancelled(event: cc.Event.EventTouch) {
    
    // }

}
