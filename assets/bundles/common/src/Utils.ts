/**
 * 工具类
 */




 
const {ccclass, property} = cc._decorator;

@ccclass
export class Utils extends cc.Component {

    /**
     * 添加事件
     * @param target          事件归属
     * @param componentName   类名
     * @param callbackName    方法名
     * @param customEventData 方法传入数据
     * @returns
     */
    static getClickEvents(target: cc.Node, componentName: string, callbackName: string, customEventData?: string) {
        const clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = target; // 这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = componentName.split('<')[1].split('>')[0]; // 这个是脚本类名
        clickEventHandler.handler = callbackName;
        if (customEventData) clickEventHandler.customEventData = customEventData;
        return clickEventHandler;
    }

    /**
     * 坐标转换(相对锚点 相对锚点 相对锚点!!!);
     * @param destNode  目标节点
     * @param srcNode   源节点
     * @returns {*}
     */
    public static getPosInNode(destNode:cc.Node, srcNode:cc.Node) {
        if (!destNode || !srcNode || !srcNode.parent) {
            return srcNode.position;
        }
        
        var wordPoint = srcNode.parent.convertToWorldSpaceAR(srcNode.position);
        return destNode.convertToNodeSpaceAR(wordPoint);
    }
    
    /**
     * 格式化时间字符串 00:00:00
     * @param time 时间戳（秒）
     */
    static formatTimeString(time: number): string {
        time = Math.floor(time + 0.95);
        let hour = Math.floor(time / 3600);
        let minute = Math.floor(time % 3600 / 60);
        let second = Math.floor(time % 60);
        let result = '';
        result += hour > 9 ? hour.toString() : '0' + hour.toString();
        result += ':';
        result += minute > 9 ? minute.toString() : '0' + minute.toString();
        result += ':';
        result += second > 9 ? second.toString() : '0' + second.toString();
        return result;
    }
}
