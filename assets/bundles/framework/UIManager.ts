/**
 * UI管理器
 */



 export class UIManager {

    /** 过渡动画信息 */
    public static transitionInfo = null;

    // UI单例对象(私有化)
    private static instances = {};
    // 资源缓存
    public static assets = {};
    // 队列
    private static queue = [];
    // 当前显示的uiName
    private static queueUiName: string = null;

    /** 正在打开的面板 */
    private static opening = {};

    /**
     * 打开一个UI
     * @param uiName UI名称
     * @param callback 回调函数
     */
    public static async open(uiName: string, callback?: Function) {
        if (!uiName || uiName === '') {return;}

        const uiPath = uiName;
        const arr = uiName.split('/');
        uiName = arr[arr.length - 1];
        if (UIManager.opening[uiPath]) {return;}
        UIManager.opening[uiPath] = !0;
        try {
            // 已有节点，重新显示
            let node: cc.Node = UIManager.instances[uiName];
            if (node && node.getComponent && (node as any)._components) {
                node.active = true;
                UIManager.reshow(node, uiName);
                UIManager.opening[uiPath] = undefined;
                callback && callback(undefined, node);
                return node;
            }
            
            // 新建节点
            const asset: any = UIManager.assets[uiName] || await UIManager.loadRes(`${uiPath}`, cc.Prefab);
            UIManager.assets[uiName] = asset;
            node = cc.instantiate(asset);
            UIManager.reshow(node, uiName);
            UIManager.instances[uiName] = node;
            UIManager.opening[uiPath] = undefined;
            callback && callback(undefined, node);
            return node;
        } catch (error) {
            UIManager.opening[uiPath] = undefined;
            callback ? callback(error) : console.error(error);
        }
    }

    /**
     * 打开一个UI，带过渡动画
     * @param uiName UI面板名称
     * @param transitionInfo 过渡动画参数
     */
    public static async openTrans(uiName: string, transitionInfo?: {transType: string, duration?: number, callback?: Function}) {
        const transUIName = `Loading/FLoading${transitionInfo.transType}Panel`;
        transitionInfo['uiName'] = uiName;
        UIManager.transitionInfo = transitionInfo;
        // 打开过渡动画面板
        await UIManager.open(transUIName);
    }

    /**
     * 关闭一个UI
     * @param uiName UI名称 | UI节点对象
     * @param callback 回调函数
     */
    public static close(uiName: string | cc.Node, isDestroy: boolean = false) {
        if (!uiName) {return;}
        let node: cc.Node;

        // 获取节点
        if (typeof uiName === 'string') {
            const arr = uiName.split('/');
            uiName = arr[arr.length - 1];
            node = UIManager.instances[uiName];
        } else {
            node = uiName;
            uiName = node.name;
        }

        if (!node) {return null;}

        // 关闭节点
        node.active = !1;
        node.parent = null;
        if (isDestroy) {
            UIManager.instances[uiName] = undefined;
            node.destroy();
        }
        
        return isDestroy ? null : node;
    }

    /**
     * 打开一个UI，并添加到队列
     * @param uiName UI名称
     * @param callback 回调函数
     */
    public static async openOnQueue(uiName: string, callback?: Function) {
        if (UIManager.queueUiName) {return UIManager.queue.push({uiName, callback});}

        UIManager.queueUiName = uiName;
        return await UIManager.open(uiName, callback);
    }

    /**
     * 关闭一个UI，并从队列移除
     * @param uiName UI名称 | UI节点对象
     * @param callback 回调函数
     */
    public static async closeOnQueue(uiName: string | cc.Node, isDestroy: boolean = false) {
        UIManager.close(uiName, isDestroy);
        UIManager.queueUiName = null;
        
        const uiInfo = UIManager.queue.splice(0, 1)[0];
        if (uiInfo) {
            UIManager.queueUiName = uiInfo.uiName;
            await UIManager.open(uiInfo.uiName, uiInfo.callback);
        }
    }

    /**
     * 加载动态资源
     * @param path 资源路径
     */
    static loadBundle(path: string): Promise<cc.Asset> {
        const bundleInfo = UIManager.getBundleName(path), 
            bundle = cc.assetManager.getBundle(bundleInfo.bundleName);
        console.log("===> loadBundle ", bundleInfo, bundle);
        if (bundle) {
            const panelPath = bundleInfo.assetPath;
            return new Promise((resolve, reject) => {
                bundle.load(panelPath, (error, asset) => {
                    if (error) {return reject(error);}
                    resolve(asset);
                });
            });
        }

        return new Promise((resolve, reject)=>{
            // console.log('========', path, bundleInfo);
            const loadBundleCallback = (err, bundle: cc.AssetManager.Bundle)=>{
                if (err) {return reject(err);}
            
                bundle.load(bundleInfo.assetPath, (error, asset)=>{
                    if (error) {return reject(error);}
                    resolve(asset);
                });
            };

            cc.assetManager.loadBundle(bundleInfo.bundleName, loadBundleCallback);
        });
    }

    /**
     * 获取资源所在的bundle信息
     * @param path 资源路径
     */
    private static getBundleName(path: string) {
        let bundleName = '', assetPath = path;

        if (path.indexOf(':') !== -1) {
            const info = path.split(':');
            bundleName = info[0];
            assetPath = info[1];
        } else {
            let arr = path.split('/');
            if (arr[0] == 'ui') {
                bundleName = arr[1];
                assetPath = path.replace(`ui/${arr[1]}/`, '');
            } else {
                bundleName = arr[0];
                // assetPath = path.replace(`${arr[1]}/`, '');
                assetPath = arr[1];
            }
        }
        
        return {bundleName, assetPath}; 
    }
    
    /**
     * 加载动态资源
     * @param path 资源路径
     * @param assetType 资源类型
     */
    static loadRes(path: string, assetType: typeof cc.Asset): Promise<cc.Asset> {
        return new Promise(async (resolve, reject)=>{
            // 兼容bundle加载模式
            if (!cc.resources) {
                try {
                    return resolve(await UIManager.loadBundle(path));
                } catch (error) {
                    return reject(error);
                }
            }
            
            // 兼容2.4版本引擎之前的游戏
            cc.resources.load(path, assetType, async (err, res)=>{
                if (err) {
                    try {
                        return resolve(await UIManager.loadBundle(path));
                    } catch (error) {
                        return reject(error);
                    }
                }

                return resolve(res);
            });
        });
    }

    /**
     * 加载Panel资源
     * @param uiName Panel资源路径
     * @param assetType 资源类型
     */
    static async loadResPanel(uiName: string, assetType: typeof cc.Asset = cc.Prefab): Promise<cc.Asset> {
        const uiPath = uiName;
        const arr = uiName.split('/');
        uiName = arr[arr.length - 1];

        if (UIManager.assets[uiName]) { return UIManager.assets[uiName];}
        UIManager.assets[uiName] = await UIManager.loadRes(`${uiPath}`, assetType);

        return UIManager.assets[uiName];
    }

    /**
     * 预加载Panel并创建
     * @param uiName Panel资源路径
     * @returns 
     */
    static async preloadPanel(uiName: string): Promise<cc.Node> {
        let node: cc.Node = UIManager.getUI(uiName);
        if (node) { return node; }

        const asset: any = await UIManager.loadResPanel(uiName);
        node = cc.instantiate(asset);
        UIManager.instances[uiName] = node;

        return node;
    }

    /** 重置节点层级和父节点 */
    private static reshow(node: cc.Node, uiName: string) {
        node.zIndex = 0;
        node.parent = cc.find('Canvas');
    }

    /**
     * 获取UI节点对象
     *
     * @static
     * @param {string} uiName UI名称
     * @returns
     * @memberof UIManager
     */
    public static getUI(uiName: string): cc.Node {
        return UIManager.instances[uiName];
    }

    
}

try { (window as any).UIManager = UIManager; } catch (error) {}