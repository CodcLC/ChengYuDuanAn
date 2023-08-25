/**
 * 数字格式化
 */




 
export class NumberFormat {

    /**
     * 格式化数字长度
     * @param num 整数
     * @param len 格式化后的长度
     */
    static formatLen(num, len): string {
        let result = num.toString();

        if (result.length >= len) {
            return result;
        }

        while (result.length < len) {
            result = '0' + result;
        }

        return result;
    }

    /**
     * 格式化显示千位符
     * @param num 要格式化显示的数值
     */
    static formatToThousands(num: number): string {
        return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    }

    /**
     * 精确数字(会四舍五入) 2.00
     * @param num 数字 
     * @param len 精确个数 
     * 
     */
    static accurateNum(num: number, len): number {
        let n: any = num.toFixed(len);
        return n - 0;
    }

    /**
     * 精确数字(不会四舍五入) 2.00
     * @param num 数字 
     * @param len 精确个数 
     * 
     */
    static accurateNewNum(num: number, len): number {
        let m = Math.pow(10, len);
        Math.floor(num * m) / m
        // let n:any = num.toFixed(len);
        return Math.floor(num * m) / m;
    }
}

(window as any).NumberFormat = NumberFormat;