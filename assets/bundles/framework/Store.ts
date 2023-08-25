/**
 * 本地化数据存储
 */
export class Store {

    /** 是否启用本地缓存(加速访问) */
    public static enabledStoreCache: boolean = true;
    /** 本地化数据缓存(加速访问) */
    private static storeCacheDatas = {};
    /** 本地化存储keys缓存 */
    private static StoreKeys = null;

    /**
     * 保存数据
     * @param {string} key 索引键
     * @param {*} value 值
     */
    static set(key: string, value: any): void {
        if ((window as any).subGameName
            && key.indexOf((window as any).subGameName) === -1
            && key !== 'coin'
            && key !== 'diamond'
            && key !== 'strength'
            && key !== 'enabledMusic'
            && key !== 'enabledEffect'
            && key !== 'StoreKeys') {
            key = `${(window as any).subGameName}_${key}`;
        }

        if (Store.storeCacheDatas[key] === value) {
            const typeName = typeof value;
            if (typeName === 'number' || typeName === 'string' || typeName === 'boolean') {return;}
        }
        Store.enabledStoreCache && (Store.storeCacheDatas[key] = value);
        let val: any = {
            type: typeof(value),
            value: value
        };
        val = JSON.stringify(val);
    
        // 记录key
        if (key !== 'StoreKeys') {
            let keys: any = Store.StoreKeys || Store.get('StoreKeys', {});
            Store.StoreKeys = keys;
            if (!keys[key]) {
                keys[key] = 1;
                Store.set('StoreKeys', keys);
            }
        }

        cc.sys.localStorage.setItem(key, val);
    }

    /**
     * 保存今天的数据 
     * @param {string} key 索引键 
     * @param {*} defaultValue 当没有取到值的时候返回的默认值 
     */
    static setTodayValue(key: string, value: any): void {
        let date: Date = new Date();
        let day: string = date.getFullYear() + '_' + (date.getMonth()+1) + '_' + date.getDate();

        return Store.set(key + '_' + day, value);
    }
    
    /**
     * 获取数据 
     * @param {string} key 索引键 
     * @param {*} defaultValue 当没有取到值的时候返回的默认值 
     */
    static get(key: string, defaultValue?: any): any {
        if ((window as any).subGameName
            && key.indexOf((window as any).subGameName) === -1
            && key !== 'coin'
            && key !== 'diamond'
            && key !== 'strength'
            && key !== 'enabledMusic'
            && key !== 'enabledEffect'
            && key !== 'StoreKeys') {
            key = `${(window as any).subGameName}_${key}`;
        }
        
        let data: any = Store.storeCacheDatas[key];
        if (data !== undefined && data !== null) {return data;}
        data = cc.sys.localStorage.getItem(key);
        if (!data) {
            Store.enabledStoreCache && Store.set(key, defaultValue);
            return defaultValue;
        }
    
        let val: any = JSON.parse(data);
        if (val.value === undefined || val.value === null) {
            Store.enabledStoreCache && Store.set(key, defaultValue);
            return defaultValue;
        }

        Store.enabledStoreCache && Store.set(key, val.value);
        return val.value;
    }

    /**
     * 获取今天的数据 
     * @param {string} key 索引键 
     * @param {*} defaultValue 当没有取到值的时候返回的默认值 
     */
    static getTodayValue(key: string, defaultValue?: any): any {
        let date: Date = new Date();
        let day: string = date.getFullYear() + '_' + (date.getMonth()+1) + '_' + date.getDate();

        return Store.get(key + '_' + day, defaultValue);
    }

    /**
     * 获取时间阶段的数据 
     * @param {string} key 索引键 
     * @param {string} interval 时间区间
     * @param {*} defaultValue 当没有取到值的时候返回的默认值 
     */
    static getTimeIntervalValue(key: string, interval : number,  defaultValue?: any): any {
        try {
            const time =  Math.floor(Date.now() / 1000);
            const preKey = Math.floor(time / interval);
            return Store.get(key + '_' + preKey, defaultValue);
        } catch (error) {
            cc.log("Store.getTimeIntervalValue() : interval 不能为0！");
        }
    }

    /**
     * 设置时间阶段的数据 
     * @param {string} key 索引键 
     * @param {string} interval 时间区间
     * @param {*} defaultValue 当没有取到值的时候返回的默认值 
     */
    static setTimeIntervalValue(key: string, interval : number,  value: any): any {
        try {
            const time =  Math.floor(Date.now() / 1000);
            const preKey = Math.floor(time / interval);
            return Store.set(key + '_' + preKey, value);
        } catch (error) {
            cc.log("Store.getTimeIntervalValue() : interval 不能为0！");
        }
    }


    /**
     * 获取bool值
     * @param {string} key 
     * @param {bool} defaultValue 
     */
    static getBool(key: string, defaultValue?: boolean): boolean {
        let value: any = Store.get(key);

        if (value === 'true') {
            return true;
        } else if (value === 'false') {
            return false;
        } 

        return defaultValue;
    }

    /**
     * 设置bool值
     * @param {string} key 
     * @param {bool} value 
     */
    static setBool(key: string, value: boolean): void {
        if (value === true) {
            Store.set(key, 'true');
        } else {
            Store.set(key, 'false');
        }
    }

    /**
     * 移除数据
     * @param {string} key 
     */
    static remove(key: string): void {
        cc.sys.localStorage.removeItem(key);
        Store.storeCacheDatas[key] = undefined;
    }

    /**
     * 清空所有缓存数据
     */
    static clear(): void {
        let keys = Store.get('StoreKeys', {});

        for (let key in keys) {
            cc.sys.localStorage.removeItem(key);
            keys[key] = undefined;
        }
        Store.set('StoreKeys', {});
    }

    /**
     * 获取本地化存储中所有的key
     */
    static getAllKeys(): Array<string> {
        const result = [];
        const keys = Store.get('StoreKeys', {});

        for (let key in keys) {
            result.push(key);
        }

        return result;
    }
}

try {(window as any).Store = Store;} catch (error) {}