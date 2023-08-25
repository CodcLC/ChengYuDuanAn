/**
 * 文件功能描述
 */

import { GameDataCenter } from "../../config/GameDataCenter";
import { GameEvents, GameSounds, unlockDoormanLevel } from "../../config/GConfig";
import { UIManager } from "../../framework/UIManager";




 
const {ccclass, property} = cc._decorator;

@ccclass
export class Item extends cc.Component {

    // =======================================
    // 编辑器属性定义(以@property修饰)
    // =======================================
    @property({ type: cc.Node, tooltip: '门客图片' })
    doorman: cc.Node = null;
    
    @property({ type: cc.Node, tooltip: '置灰图片' })
    doormanGrey: cc.Node = null;

    @property({ type: cc.Node, tooltip: '视频按钮' })
    videoBtn: cc.Node = null;

    @property({ type: cc.Label, tooltip: '描述' })
    txt: cc.Label = null;

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

    /** 类型 */
    private type: number = 0;
    /** 角色索引 */
    private roleIndex: number = 0;

    // =======================================
    // 生命周期(模板方法，以on开头)
    // =======================================


    // =======================================
    // 自定义事件回调(以on开头)
    // =======================================

    /** 按钮点击事件 */
    onClicked(event: cc.Event, customData: string) {
        cc.systemEvent.emit(GameEvents.S_Play_Sound, GameSounds.S_Btn_Click);
        switch (this.type) {
            case 0:
                break;
            case 1:
                this.recruitDoorman();
                break;
            case 2:
                if (GameDataCenter.doormanVideoData[this.roleIndex] == 1) {
                    return;
                }
                this.openFirstWatch();
                break;
        }
    }

    // =======================================
    // 游戏逻辑方法(内部调用的用private修饰，外部调用和编辑器绑定的public修饰，废弃的方法不加修饰符方便后期移除)
    // =======================================

    setData(type, roleIndex) {
        // init TODO:
        this.type = type;
        this.roleIndex = roleIndex;
        this.init();
    }

    /** 初始化 */
    init() {
        this.doorman.parent.active = false;
        this.doormanGrey.active = false;
        this.videoBtn.active = false;

        // 加载置灰图片
        let bundle = cc.assetManager.getBundle('common');
        bundle.load(`res/img/doorman_grey/doorman_${this.roleIndex + 1}`, cc.SpriteFrame, (err, assets: cc.SpriteFrame) => {
            this.doormanGrey.getChildByName('grey').getComponent(cc.Sprite).spriteFrame = assets;
        });

        switch (this.type) {
            case 0:
                this.doormanGrey.active = true;
                this.txt.string = `${unlockDoormanLevel[this.roleIndex - 2]}关解锁`;
                break;
            case 1:
                this.doormanGrey.active = true;
                this.videoBtn.active = true;
                this.txt.string = `可解锁`;
                break;
            case 2:
                this.doorman.parent.active = true;
                bundle.load(`res/img/doorman/doorman_${this.roleIndex + 1}`, cc.SpriteFrame, (err, assets: cc.SpriteFrame) => {
                    this.doorman.getComponent(cc.Sprite).spriteFrame = assets;
                });
                break;
        }
    }

    /** 招纳门客 */
    recruitDoorman() { 
        this.doormanGrey.active = false;
        this.videoBtn.active = false;
        this.doorman.parent.active = true;
        let bundle = cc.assetManager.getBundle('common');
        bundle.load(`res/img/doorman/doorman_${this.roleIndex + 1}`, cc.SpriteFrame, (err, assets: cc.SpriteFrame) => {
            if (assets) {
                this.doorman.getComponent(cc.Sprite).spriteFrame = assets;
            }
        });

        // 更新门客解锁列表
        let doormanUnlockList = GameDataCenter.doormanUnlockList;
        doormanUnlockList[this.roleIndex] = 2;
        GameDataCenter.doormanUnlockList = doormanUnlockList;

        // 更新门客等级配置
        let doormanRoleGrade = GameDataCenter.doormanRoleGrade;
        if (doormanRoleGrade.target == 'left') {
            doormanRoleGrade.left = this.roleIndex + 1;
            doormanRoleGrade.target = 'right';
        } else if (doormanRoleGrade.target == 'right') {
            doormanRoleGrade.right = this.roleIndex + 1;
            doormanRoleGrade.target = 'left';
        }
        GameDataCenter.doormanRoleGrade = doormanRoleGrade;

        // 更换首页门客
        cc.systemEvent.emit(GameEvents.M_Change_Home_Doorman_Role);
    }

    /** 打开首看豪礼界面 */
    openFirstWatch() {
        let bundle = cc.assetManager.getBundle('firstAward');
        if (!bundle) {
            cc.assetManager.loadBundle('firstAward', (err, bundle) => {
                if (err) { return console.log('加载firstAward bundle 失败:', err) };
                
                GameDataCenter.curClickDorrmanIndex = this.roleIndex;
                UIManager.open('firstAward/FirstWatchPanel');
            });
        } else {
            GameDataCenter.curClickDorrmanIndex = this.roleIndex;
            UIManager.open('firstAward/FirstWatchPanel');
        }
    }
}