/**
 * 虚拟容器v2.1 支持PageView、ScrollView
 */

/** 是否是滚动相同方向 */
enum EIsScrollDir {
    YES,
    NO,
}

/** 容器类型 */
enum EViewType {
    /** 翻页容器 */
    PAGEVIEW = 'PAGEVIEW',
    /** 滚动容器 */
    SCROLLVIEW = 'SCROLLVIEW',
}

/** 子项数据 */
interface SItem {
    node: cc.Node,
    index: number
}

/** 监听方法key */
export enum EMonitorDir {
    TOP = 'scroll-to-top',
    LEFT = 'scroll-to-left',
    RIGHT = 'scroll-to-right',
    BOTTOM = 'scroll-to-bottom',
}

/** 容器朝向 */
enum EBeginDir {
    /** unit 1 */
    TOP,
    /** unit -1 */
    LEFT,
    /** unit 1 */
    RIGHT,
    /** unit -1 */
    BOTTOM,
}

/**
 * pageView //! 注意: EBeginDir.RIGHT 以及 EBeginDir.BOTTOM 存在滑动bug
 * scrollView 四个方向都支持
 * 当前仅支持部分方法，后续继续扩展方法
 */
export class ScrollViewExtend {

    /** 容器类型 */
    private viewType: EViewType = EViewType.SCROLLVIEW;
    /** 滚动起始方向 */
    private beginDir: EBeginDir = EBeginDir.TOP;
    /** 保留富余子项标识 */
    private keepItemFlag: number = -3;
    /** 正在滚动 */
    private isScrolling: boolean = false;
    /** 列表滚动方向 */
    private isVertical: boolean = true;
    /** 列表数据：数组 */
    public datas: any[] = [];
    /** 子项节点 */
    public items: SItem[] = [];
    /** 子项模型 */
    private itemMode: cc.Node | cc.Prefab = null;
    /** 设置子项函数 */
    private setItemFunc: Function = null;
    /** 列表容器 */
    private viewNode: cc.Node = null;
    /** 子项列表 */
    private layout: cc.Layout = null;
    /** 子项大小 */
    private itemSize: cc.Size = null;
    /** 每行或者每列子项个数 */
    private sameDirCount: number = 1;
    /** 第一行 */
    private firstLine: number = 0;
    /** 额外行数, 默认保险值: 2, 容器尺寸不同,可以选择更节省的额外行数 1 */
    private addLine: number = 2;
    /** 子项偏移量 */
    private offset: {x?: number, y?: number, end?: number} = {};

    /** //! 注意: 容器锚点需要设置为 {x: 0, y: 0.5}  {x: 0.5, y: 0}  {x: 0.5, y: 1}  {x: 1, y: 0.5}
     * @param args {viewNode：列表容器 itemMode：列表子项 itemSize：子项尺寸 setItemFunc：子项视图设置函数 默认竖向 addLine: 默认额外行数 offset: 设置偏移量 } 
     */
    constructor (args: {viewNode: cc.Node, itemMode: cc.Node | cc.Prefab, itemSize: cc.Size, setItemFunc: Function, addLine?: number, offset?: {x?: number, y?: number, end?: number}}) {
        this.viewNode = args.viewNode;
        this.itemSize = args.itemSize;
        this.itemMode = args.itemMode;
        this.setItemFunc = args.setItemFunc;
        args.addLine && (this.addLine = args.addLine);
        this.isVertical = [0, 1].includes(this.viewNode.anchorY);
        this.offset = Object.assign({x: 0, y: 0, end: 0}, args.offset || {});
        this.beginDir = [EBeginDir.LEFT, EBeginDir.RIGHT][this.viewNode.anchorX] || [EBeginDir.BOTTOM, EBeginDir.TOP][this.viewNode.anchorY];
        this.sameDirCount = Math.floor(this.viewNode[this.size(EIsScrollDir.NO)] / this.getItemSize(EIsScrollDir.NO));
        this.viewNode.getComponent(cc.PageView) && (this.viewType = EViewType.PAGEVIEW);
        this.layout = this.viewNode.getComponentInChildren(cc.Layout);
        if (!this.layout) {
            let layoutNode = new cc.Node('layout');
            layoutNode.parent = this.viewNode;
            this.layout = layoutNode.addComponent(cc.Layout);
            this.viewNode.getComponent(cc.ScrollView).content = this.layout.node;
        }
        this.layout.type = 0; // NONE: 0, HORIZONTAL: 1, VERTICAL: 2, GRID: 3,
        this.layout.resizeMode = 0; // NONE: 0, CONTAINER: 1, CHILDREN: 2
        this.layout.node.anchorX = this.viewNode.anchorX;
        this.layout.node.anchorY = this.viewNode.anchorY;
        this.layout.node[this.size(EIsScrollDir.NO)] = this.viewNode[this.size(EIsScrollDir.NO)];
        this.addScrollMonitor();
    }

    /**
     * 提供外部加载列表的接口
     * @param args {datas：数据数组 isFrameLoad：是否分帧加载，默认关闭 setItemFunc：子项视图设置函数 callBack：加载成功回调函数 isKeepItem：是否保留富余子项 } 
     */
    public setDatas (args: {datas: any[], isFrameLoad?: boolean, setItemFunc?: Function, callBack?: Function, isKeepItem?: boolean}) {
        this.layout.node.x = this.layout.node.y = 0
        this.viewNode.getComponent(this.viewComponent()).enabled = false;
        this.setItemFunc = args.setItemFunc || this.setItemFunc;
        (args.isKeepItem) && (this.keepItemFlag = 1); 
        this.datas = args.datas;
        let lineCount = Math.ceil(this.datas.length / this.sameDirCount);
        this.layout.node[this.size(EIsScrollDir.YES)] = lineCount * this.getItemSize(EIsScrollDir.YES) - this.offset[this.pos(EIsScrollDir.YES)] * this.unit() + this.offset.end;
        this.layout.node.x = this.layout.node.y = 0;
        // 重置翻页容器可能存在旧数据多余的残留页
        if (this.viewType == EViewType.PAGEVIEW) {
            for (let i = this.viewNode.getComponent(cc.PageView).getPages().length - 1; i >= 0; --i) {
                i > this.datas.length && this.viewNode.getComponent(cc.PageView).removePageAtIndex(i);
            }
        } 
        this.initView(args.isFrameLoad, args.callBack);
    }
    
    /**
     * 添加滑动边界监听
     * @param dir 方向
     * @param callFunc 监听方法
     */
    public addDirMonitor(dir: EMonitorDir, callFunc: Function) {
        this.viewNode.on(dir, callFunc);
    }

    /**
     * 遍历子节点
     * @param forEachFunc 可设置满足条件后返回true打断循环
     */
    public forEach (forEachFunc: Function) {
        for (let index = 0; index < this.items.length; index++) {
            if (this.items[index] && this.items[index].node.active && forEachFunc(this.items[index].node, this.items[index].index, this.datas[index])) return;
        }
    }

    /**
     * 滑动至指定子项
     * @param index 子项序号
     * @param duration 滑动时间
     */
    public scrollToItem (index: number, duration?: number) {
        index < 0 && (index += this.datas.length);
        let pos = {x: 0, y: 0};
        let calculated = -this.setPosition(index)[this.pos(EIsScrollDir.YES)] - this.getItemSize(EIsScrollDir.YES) / 2 * this.unit() + this.offset[this.pos(EIsScrollDir.YES)] * this.unit();
        let boundary = (this.layout.node[this.size(EIsScrollDir.YES)] - this.viewNode[this.size(EIsScrollDir.YES)]) * this.unit();
        if ((calculated >= 0 && this.unit() > 0) || calculated > 0 && this.unit() < 0) {
            pos[this.pos(EIsScrollDir.YES)] = Math.min(calculated, boundary);
        }
        else {
            pos[this.pos(EIsScrollDir.YES)] = Math.max(calculated, boundary);
        }
        if (duration) {
            pos[this.pos(EIsScrollDir.YES)] = 1 - (pos[this.pos(EIsScrollDir.YES)] / boundary);
            this.scrollTo(pos, duration);
        }
        else {
            this.moveTo(pos);
            this.viewType == EViewType.PAGEVIEW && (this.viewNode.getComponent(cc.PageView)['_curPageIdx'] = index);
        }
    }

    /**
     * 百分比滑动
     * @param percent 百分比
     * @param duration 滑动时间
     */
    public scrollToPercent (percent: number, duration?: number) {
        let pos = {x: 0, y: 0};
        if (duration) {
            pos[this.pos(EIsScrollDir.YES)] = 1 - percent;
            this.scrollTo(pos, duration);
        }
        else {
            pos[this.pos(EIsScrollDir.YES)] = percent * (this.layout.node[this.size(EIsScrollDir.YES)] - this.viewNode[this.size(EIsScrollDir.YES)]);
            this.moveTo(pos);
        }
    }    
    
    /** 移动容器 */
    private moveTo (movePos) {
        this.viewNode.getComponent(this.viewComponent()).enabled = false;
        this.viewNode.getComponent(this.viewComponent()).stopAutoScroll();
        this.layout.node[this.pos(EIsScrollDir.YES)] = movePos[this.pos(EIsScrollDir.YES)];
        this.scrolling();
        this.viewNode.getComponent(this.viewComponent()).enabled = true;
    }

    /** 滑动容器 */
    private scrollTo (scrollPer, duration: number) {
        this.viewNode.getComponent(this.viewComponent()).enabled = false;
        this.viewNode.getComponent(this.viewComponent()).stopAutoScroll();
        this.viewNode.getComponent(this.viewComponent()).scrollTo(scrollPer, duration)
        this.viewNode.getComponent(this.viewComponent()).enabled = true;
    }
    
    /** 初始列表 */
    private initView (isFrameLoad: boolean, callBack?: Function) {
        let loadCount = Math.min(this.datas.length, this.sameDirCount * (Math.ceil(this.viewNode[this.size(EIsScrollDir.YES)] / this.getItemSize(EIsScrollDir.YES)) + this.addLine));
        if (isFrameLoad) {
            let loadIndex = 0;
            let startTime = 0;
            let frameTime = 1000 / 60;
            let isFinish = true;
            let frameSchedule = setInterval(() => {
                isFinish = true;
                startTime = new Date().getTime();
                for (loadIndex; loadIndex < loadCount; loadIndex++) {
                    this.createItem(loadIndex);
                    if (new Date().getTime() - startTime > (frameTime * 0.8)) {
                        isFinish = false;
                        break;
                    }
                }
                if (isFinish) {
                    clearInterval(frameSchedule);
                    this.loadSeccess(loadCount);
                    callBack && callBack();
                }
            }, frameTime);
        }
        else {
            for (let index = 0; index < loadCount; index++) {
                this.createItem(index);
            }
            this.loadSeccess(loadCount);
            callBack && callBack();
        }
    }

    /** 加载成功 */
    private loadSeccess (loadCount) {
        if (!cc.isValid(this.viewNode)) { return }
        this.firstLine = 1;
        this.viewType == EViewType.PAGEVIEW && (this.viewNode.getComponent(cc.PageView)['_curPageIdx'] = this.items[0].index);
        this.viewNode.getComponent(this.viewComponent()).enabled = true;
        if (this.items.length > loadCount) {
            if (!!this.keepItemFlag) {
                this.keepItemFlag++;
                (!this.keepItemFlag) && (console.warn(' ===> 列表频繁反复创建删除子项，开始采用节点隐藏策略'))
                this.items.splice(loadCount, this.items.length - loadCount).forEach((item) => {
                    item.node.parent = null;
                })
            }
            else {
                for (let i = loadCount; i < this.items.length; ++i) {
                    this.items[i].node.active = false;
                }
            }
        }
        console.log(' ===> 实际全部子项数量： ', this.datas.length, ' 实际加载子项数量： ', this.items.length, ' 实际显示子项数量： ', loadCount);
    }

    /** 添加监听方法 */
    private addScrollMonitor () {
        if (this.viewType == EViewType.SCROLLVIEW) {
            this.viewNode.on('scrolling', this.scrolling, this);
        } else {
            this.viewNode.on('scroll-ended', this.scrolling, this);
        }
    }

    /** 滚动列表监听方法 */
    private scrolling () {
        let layoutPos = this.layout.node[this.pos(EIsScrollDir.YES)];
        let unshowLine = Math.floor(layoutPos / this.getItemSize(EIsScrollDir.YES) + 0.5) * this.unit();
        let maxLine = Math.ceil((this.datas.length - this.items.length) / this.sameDirCount) + 1;
        // 当前首行溢出但记录的首行未到极限时，更改当前首行为极限边界
        if (unshowLine < 1 && this.firstLine > 1) unshowLine = 1;
        if (unshowLine > maxLine && this.firstLine < maxLine) unshowLine = maxLine;
        // 正在滚动复用        || 当前首行跟记录首行一致            || 当前首行越最小界线|| 当前首行越最大界限
        if (this.isScrolling || unshowLine === this.firstLine || unshowLine < 1 || unshowLine > maxLine) {
            this.viewType == EViewType.PAGEVIEW && (this.viewNode.getComponent(cc.PageView)['_curPageIdx'] = unshowLine);
            return;
        }
        this.isScrolling = true;
        this.moveLines(unshowLine - this.firstLine);
    }

    /** 创建子项 */
    private createItem (index: number) {
        let item = this.items[index] || {node: cc.instantiate(this.itemMode) as cc.Node, index: index};
        if (!item || !item.node) {
            return console.error('ScrollViewExtend createItem error:', item);
        }
        if (!item.node.parent) {
            if (this.viewType == EViewType.PAGEVIEW) {
                this.viewNode.getComponent(cc.PageView).addPage(item.node);
            } 
            else {
                item.node.parent = this.layout.node;
            }
        }
        item.index = index;
        this.items[index] = item;
        this.setItem(item.node, item.index);
    }

    /** 设置子项 */
    private setItem (node: cc.Node, index: number) {
        if (!cc.isValid(this.viewNode)) { return }
        node.position = this.setPosition(index);
        node.active = !!this.datas[index];
        if (node.active) this.setItemFunc(node, this.datas[index], index);
    }

    /** 复用子项 */
    private moveLines (moveLine) {
        if (moveLine === 0) {
            this.isScrolling = false;
            return;
        } 
        let unitLine = moveLine / Math.abs(moveLine);
        let itemsCount = this.items.length;
        for (let index = 0; index < this.sameDirCount; index++) {
            let item: SItem = null;
            if (1 === unitLine) {
                item = this.items.shift()
                this.items.push(item);
            }
            else if (-1 === unitLine) {
                item = this.items.pop()
                this.items.unshift(item);
            }
            else 
                return;
            if (!item) continue;
            item.index += unitLine * itemsCount;
            this.setItem(item.node, item.index);
            if (this.viewType == EViewType.PAGEVIEW && !this.viewNode.getComponent(cc.PageView).getPages()[item.index]) {
                this.viewNode.getComponent(cc.PageView).insertPage(new cc.Node(), item.index);
            }
        }
        this.viewType == EViewType.PAGEVIEW && (this.viewNode.getComponent(cc.PageView)['_curPageIdx'] = unitLine + this.firstLine);
        this.firstLine += unitLine;
        this.moveLines(moveLine - unitLine);
    }

    /**
     * 获取子项尺寸
     * @param isScrollDir ：是否获取滚动相向的坐标key
     * @returns 竖向滚动 EIsScrollDir.YES: 高 、 EIsScrollDir.NO：宽
     */
    private getItemSize (isScrollDir: EIsScrollDir) : number {
        if (!this.itemSize) {
            console.error('this.itemSize is:', this.itemSize);
            return 100;
        }
        return this.itemSize[this.size(isScrollDir)];
    }

    /**
     * 获取坐标key
     * @param isScrollDir ：是否获取滚动相向的坐标key
     * @returns 竖向滚动 EIsScrollDir.YES: y 、 EIsScrollDir.NO：x
     */
    private pos (isScrollDir: EIsScrollDir) : string {
        return (this.isVertical ? ['y', 'x'] : ['x', 'y'])[Number(isScrollDir)];
    }

    /**
     * 获取尺寸key
     * @param isScrollDir ：是否获取滚动相向的尺寸key
     * @returns 竖向滚动 EIsScrollDir.YES: height 、 EIsScrollDir.NO：width
     */
    private size (isScrollDir: EIsScrollDir) : string {
        return (this.isVertical ? ['height', 'width'] : ['width', 'height'])[Number(isScrollDir)];
    }

    /**
     * 获取单位向量 TOP、RIGHT: 1   LEFT、BOTTOM: -1
     * @returns 锚点为原点，参考平面坐标系正负方向
     */
    private unit () : number {
        return [1, -1][Number(this.beginDir) % 2];
    }

    /**
     * 获取当前容器组件
     * @returns 
     */
    private viewComponent () {
        return this.viewType == EViewType.SCROLLVIEW ? cc.ScrollView : cc.PageView;
    }

    /**
     * 获取对应数据下标数的item在列表中的位置
     * @param index 数据数组下标
     * @returns 
     */
    private setPosition (index) {
        if (!this.layout.node) { return cc.Vec3.ZERO }
        let offset: number = 0;
        if (this.sameDirCount * this.getItemSize(EIsScrollDir.NO) < this.layout.node[this.size(EIsScrollDir.NO)]) {
            offset = (this.layout.node[this.size(EIsScrollDir.NO)] - this.sameDirCount * this.getItemSize(EIsScrollDir.NO)) / (this.sameDirCount + 1);
        }
        let pos: cc.Vec3 = cc.v3(0, 0, 0);
        pos[this.pos(EIsScrollDir.YES)] = (this.getItemSize(EIsScrollDir.YES) * (-Math.floor(index / this.sameDirCount) - 0.5) + this.offset[this.pos(EIsScrollDir.YES)]) * this.unit();
        pos[this.pos(EIsScrollDir.NO)] = (this.getItemSize(EIsScrollDir.NO) * (index % this.sameDirCount + 0.5) - this.layout.node[this.size(EIsScrollDir.NO)] / 2) + offset * (index % this.sameDirCount + 1) + this.offset[this.pos(EIsScrollDir.NO)];
        !this.isVertical && (pos[this.pos(EIsScrollDir.NO)] *= -1);
        pos.x -= 100;
        return pos
    }
}
