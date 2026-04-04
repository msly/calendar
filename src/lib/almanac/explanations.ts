import type { ExplanationKey } from './types';

export type ExplanationEntry = {
  title: string;
  short: string;
  long: string;
};

export const explanationMap: Record<ExplanationKey, ExplanationEntry> = {
  clash: {
    title: '冲煞',
    short: '表示当天相冲的生肖与煞位方位，传统上用于规避冲突方向。',
    long: '冲煞用于描述日支与生肖的相冲关系及不利方位，传统上通常用于参考当天相冲生肖和方位。通常把它当作民俗参考信息，而不是绝对禁忌。'
  },
  dutyDeity: {
    title: '值神',
    short: '表示当天值日之神，常配合黄道黑道判断日内倾向。',
    long: '值神是传统历法中的日值神名，通常和黄道黑道属性一起看，用来辅助理解当天整体气象。'
  },
  dayOfficer: {
    title: '十二值日',
    short: '建除十二神中的当日值位，用于判断事务适配度。',
    long: '十二值日对应“建除满平定执破危成收开闭”等序列，传统上用于区分不同事务的宜忌倾向。'
  },
  wealthDirection: {
    title: '财神位',
    short: '民俗上认为有利于求财活动的方位。',
    long: '财神位是当日常用方位参考之一，通常用于出行、开业、谈财务事项时的传统方位选择。'
  },
  joyDirection: {
    title: '喜神位',
    short: '民俗上认为偏向喜庆事项的方位。',
    long: '喜神位常用于婚庆、会面、庆典等场景的传统方位参考，用法因地域习惯而不同。'
  },
  fortuneDirection: {
    title: '福神位',
    short: '民俗上象征福气的方位参考。',
    long: '福神位常用于日常祈福与仪式活动的方向选择，通常与财神位、喜神位一起综合查看。'
  },
  fetusDeity: {
    title: '胎神',
    short: '表示当日胎神所占位置，传统上提醒避扰该处。',
    long: '胎神位置来源于传统历注，通常用于提示家中动土、搬动物件时尽量避开对应区域。'
  },
  mansion: {
    title: '星宿',
    short: '二十八宿中的当日宿位，反映传统天象归类。',
    long: '星宿信息来自二十八宿体系，常用于配合宜忌做民俗层面的日期理解。'
  },
  nayin: {
    title: '纳音',
    short: '干支纳音五行属性，用于传统术数分类。',
    long: '纳音把干支组合映射到五行名目，主要用于传统历法解释和术数体系中的归类参考。'
  },
  yearGanzhi: {
    title: '年干支',
    short: '表示当年的天干地支纪年。',
    long: '年干支是传统历法用来表示年份的干支组合，常与生肖、纳音一起看，用于识别年份的历法归属。'
  },
  monthGanzhi: {
    title: '月干支',
    short: '表示当月的天干地支纪月。',
    long: '月干支用于标识当月所对应的干支序列，常用于传统择日、命理和节令分析中的月令判断。'
  },
  dayGanzhi: {
    title: '日干支',
    short: '表示当天的天干地支纪日。',
    long: '日干支是黄历判断中最常见的基础字段之一，很多宜忌、冲煞和历注都围绕当日干支展开。'
  },
  zodiac: {
    title: '生肖',
    short: '显示年、月、日对应的生肖归属。',
    long: '生肖信息来自干支与地支对应关系，常作为大众更容易理解的传统历法表达方式，用于辅助阅读日期信息。'
  },
  solarTerm: {
    title: '节令',
    short: '显示当天所处节气或当前节令节点。',
    long: '节令信息用于帮助理解当天处于哪个节气阶段，以及它与季节变化、农时节奏和传统生活经验之间的关联。'
  },
  phenology: {
    title: '物候',
    short: '显示节气候序与对应的自然现象描述。',
    long: '物候用于描述某一节气阶段中自然界常见的变化，如花开、鸟鸣、雷动等，是传统时令观察体系的一部分。'
  },
  liuyao: {
    title: '六曜',
    short: '传统历注中的日辰分类之一。',
    long: '六曜通常以先胜、友引、先负、佛灭、大安、赤口等序列循环出现，常被作为民俗层面的吉凶参考。'
  },
  pengZu: {
    title: '彭祖百忌',
    short: '根据日干日支给出的传统避忌提示。',
    long: '彭祖百忌以日干、日支对应特定戒语，用于提醒某些行为在民俗上被视为不宜，是黄历中常见的辅助历注。'
  },
  dayLu: {
    title: '日禄',
    short: '表示当天相关的禄位归属。',
    long: '日禄信息来自干支与禄位的传统对应关系，常用于术数体系中的辅助判断，普通用户可将其视为补充型历注。'
  },
  guiDirection: {
    title: '贵神方位',
    short: '显示阳贵神和阴贵神所在方位。',
    long: '贵神方位是传统择日方位信息的一部分，常与财神位、喜神位、福神位一起查看，用作民俗性的方向参考。'
  },
  taiSuiDirection: {
    title: '太岁方位',
    short: '显示年、月、日对应的太岁方位。',
    long: '太岁方位用于说明传统历法中年、月、日太岁所临方向，民俗上常在动土、修造等事项中作为参考。'
  },
  nineStar: {
    title: '九星',
    short: '显示年、月、日对应的九星归属。',
    long: '九星信息来源于九宫飞星体系，常用于风水和术数中的时空归类。放在黄历里更适合作为扩展阅读信息。'
  },
  gongShou: {
    title: '宫兽',
    short: '显示当日所属宫位和对应神兽。',
    long: '宫与兽来自传统星宿体系的配套分类，常与二十八宿信息一起阅读，用来补充当天的天象归类背景。'
  },
  folkCustom: {
    title: '节俗',
    short: '显示当天涉及的农历节日或传统民俗节点。',
    long: '节俗内容会补充当天相关的传统节日、纪念日或民俗节点，帮助用户理解日期背后的文化背景。这类内容属于文化信息，不代表统一做法。'
  }
};

export function getExplanationByKey(key: string | undefined): ExplanationEntry | null {
  if (!key) {
    return null;
  }

  if (!Object.prototype.hasOwnProperty.call(explanationMap, key)) {
    return null;
  }

  return explanationMap[key as ExplanationKey];
}
