/**
 * 文件功能描述
 */


/** 游戏事件 */
export const GameEvents = {
    /** 填充成语 */
    M_Fill_Idiom: "m001",
    /** 填充拼音 */
    M_Fill_Pinyin: "m002",
    /** 填充诗词 */
    M_Fill_Poetry: "m003",
    /** 初始化关卡 */
    M_Init_Level: "m004",
    /** 更新关卡进度条 */
    M_Updata_Level_Progress: "m005",
    /** 重置关卡进度条 */
    M_Reset_Level_Progress: "m006",
    /** 升级官人角色 */
    M_Upgrade_Official_Role: "m007",
    /** 更新首次豪礼按钮状态 */
    M_Updata_First_Award_Btn_State: "m008",
    /** 体力收集特效 */
    M_Collect_Effect: 'm009',
    /** 开始游戏特效 */
    M_Start_Game_Effect: 'm010',
    /** 更新转盘剩余次数 */
    M_Updata_Luck_Draw_Times: 'm011',
    /** 更新转盘按钮状态 */
    M_Updata_Luck_Draw_Btn: 'm012',
    /** 开启转盘按钮倒计时 */
    M_Luck_Draw_Btn_Count_Down: 'm013',
    /** 开始或停止游戏计时器 */
    M_Begin_Of_Stop_Time: 'm014',
    /** 更新首日特惠按钮状态 */
    M_Updata_Discount_Btn: 'm015',
    /** 更换游戏门客角色 */
    M_Change_Game_Doorman_Role: "m016",
    /** 更换游戏门客角色 */
    M_Change_Home_Doorman_Role: "m017",
    /** 显示插屏广告 */
    M_Show_Insert_Ad: "m018",

    /** 播放音效 */
    S_Play_Sound: 's001',
    /** 暂停音效 */
    S_Stop_Sound: 's002',
    /** 播放背景音乐 */
    S_Play_Bgm_Sound: 's003',
    /** 暂停背景音乐 */
    S_Stop_Bgm_Sound: 's004',

    /** 更新体力 */
    S_Update_Data_Power: "s005",
}


/** 音效 */
export const GameSounds = {
    /** 按钮点击音效 */
    S_Btn_Click: 'click',
    /** 开始游戏 */
    S_Game_Start: 'gameStart',
    /** 游戏正确 */
    S_Correct: 'correct',
    /** 游戏错误 */
    S_Wrong: 'wrong',
    /** 游戏倒计时警告声 */
    S_Warn: 'warn',
    /** 官人升级 */
    S_Upgrade: 'upgrade',
    /** 加官进爵、招纳门客页面弹出时 */
    S_PanelEject: 'panelEject',
} 

/** 解锁官职关卡 */
export const unlockOfficialLevel = [3, 23, 50, 80, 120, 160];

/** 解锁门客关卡 */
export const unlockDoormanLevel = [7, 17, 36, 43, 57, 64, 71, 91, 101, 111, 131, 141, 151, 171, 181, 191, 201, 211, 221, 231, 241, 251];

/** 门客名称列表 */
export const doormanNames = ['立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'];

/** 体力向上飞配置 */
export const powerFlyUpConfig = {
    "1": {
        startPos: [cc.v3(595, -1080)],
    },
    "2": {
        startPos: [cc.v3(440, -710), cc.v3(550, -760)],
    },
    "3": {
        startPos: [cc.v3(455, -875), cc.v3(545, -910), cc.v3(585, -980)],
    },
    "4": {
        startPos: [cc.v3(445, -800), cc.v3(335, -730), cc.v3(285, -690), cc.v3(550, -700)],
    },
    "5": {
        startPos: [cc.v3(445, -800), cc.v3(335, -730), cc.v3(285, -690), cc.v3(550, -700), cc.v3(500, -700)],
    },
    "10": {
        startPos: [cc.v3(300, -710), cc.v3(280, -700), cc.v3(400, -710), cc.v3(415, -695), cc.v3(400, -720),
            cc.v3(460, -710), cc.v3(420, -740), cc.v3(520, -720), cc.v3(550, -720), cc.v3(490, -845)],
    },
}