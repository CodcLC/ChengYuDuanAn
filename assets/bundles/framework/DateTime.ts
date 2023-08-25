/**
 * 日期-时间
 */
export class DateTime {

    /**
     * 获取时间戳（秒）
     * @param isMillisecond 是否返回毫秒时间戳
     */
    static getTimeStamp(isMillisecond?: boolean): number {
        if (isMillisecond) {
            return (new Date()).getTime();
        } else {
            return Math.floor((new Date()).getTime() / 1000);
        }
    }

   
    /**
     * 是否同一天
     * @param startTime 开始时间
     * @param endTime 结束时间
     */
    static isDay(startTime: number, endTime: number): boolean {
        const date = new Date(startTime * 1000);
        const today = new Date(endTime * 1000);
        return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    }

     /**
     * 是否是今天
     * @param time 时间戳
     * @param isMillisecond 是否是毫秒时间戳
     */
    static isToDay(time: number, isMillisecond: boolean = false): boolean {
        const date = new Date(time * (isMillisecond ? 1 : 1000));
        const today = new Date();
        // 如果是今天注册
        return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    }

    /**
     * 时间戳转Date对象
     * @param {string | number} timeStamp 时间戳
     * @param {boolean} isMillisecond 是否是毫秒
     * @returns {Date}
     */
    static convertToDate(timeStamp: number, isMillisecond?: boolean): Date {
        timeStamp = Math.floor(timeStamp);

        if (!isMillisecond) {
            timeStamp *= 1000;
        }
    
        return new Date(timeStamp);
    }

    /**
     * 获取今年是第几周
     * 以每周的周一为准
     * @param time 获取第几周的时间
     */
    static getWeekOfYear(time?) {
        let date = time ? new Date(time) : new Date();
        let firstDay = new Date(date.getFullYear(), 0, 1);
        let dayOfWeek = firstDay.getDay();
        let spendDay = 1;

        if (dayOfWeek !== 0) {
            spendDay = 7 - dayOfWeek + 1;
        }
        firstDay = new Date(date.getFullYear(), 0, 1 + spendDay);
        const d = Math.ceil((date.valueOf() - firstDay.valueOf()) / 86400000);
        let result = Math.ceil(d / 7) + 1;
        return result;
    };

    /**
     * 获取两个时间之间相差多少秒
     * @param startDate 
     * @param endDate 
     * @param isMillisecond 是否是毫秒时间戳
     */
    static getInervalSecond(startDate: Date, endDate: Date, isMillisecond: boolean = true) {
        let time = endDate.getTime() - startDate.getTime();
        let s = parseInt((time / 1000).toString());
        if(!isMillisecond){
            s = parseInt(time.toString());
        }
        return s;
    }
    
    /**
     * 获取两个时间之间相差多少小时
     * @param startDate 
     * @param endDate 
     */
    static getInervalHour(startDate: Date, endDate: Date) {
        let ms = endDate.getTime() - startDate.getTime();
        if (ms < 0) return 0;
        return Math.floor(ms / 1000 / 3600);
    }

    /**
     * 获取两个时间之间相差多少天
     * @param startDate 
     * @param endDate 
     */
    static getInervalDay(startDate: Date, endDate: Date){
        //时间差的毫秒数
        let time = endDate.getTime() - startDate.getTime();  
        //计算出相差天数
        let days = Math.floor(time/(24 * 3600 * 1000));
        return days;
    }
}
(window as any).DateTime = DateTime;