/**
 * 随机
 */




 
export class Random {
    
    /**
     * 随机一个整数，取值区间[min, max]
     * @param min 最小值
     * @param max 最大值
     */
    static randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
(window as any).Random = Random;
