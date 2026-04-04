declare module 'lunar-javascript' {
  export interface LunarTime {
    getZhi(): string;
    getYi(): string[];
    getJi(): string[];
    getTianShen(): string;
    getTianShenType(): string;
    getTianShenLuck(): string;
    getChongDesc(): string;
    getSha(): string;
  }

  export interface Lunar {
    getDayYi(): string[];
    getDayJi(): string[];
    getDayChongDesc(): string;
    getDaySha(): string;
    getDayTianShen(): string;
    getDayTianShenType(): string;
    getYearInGanZhiExact(): string;
    getMonthInGanZhiExact(): string;
    getDayInGanZhiExact(): string;
    getYearShengXiao(): string;
    getMonthShengXiao(): string;
    getDayShengXiao(): string;
    getZhiXing(): string;
    getDayPositionCaiDesc(): string;
    getDayPositionXiDesc(): string;
    getDayPositionFuDesc(): string;
    getDayPositionTai(): string;
    getDayPositionYangGuiDesc(): string;
    getDayPositionYinGuiDesc(): string;
    getDayPositionTaiSuiDesc(): string;
    getMonthPositionTaiSuiDesc(): string;
    getYearPositionTaiSuiDesc(): string;
    getXiu(): string;
    getXiuLuck(): string;
    getGong(): string;
    getShou(): string;
    getDayNaYin(): string;
    getJieQi(): string;
    getJie(): string;
    getQi(): string;
    getHou(): string;
    getWuHou(): string;
    getLiuYao(): string;
    getPengZuGan(): string;
    getPengZuZhi(): string;
    getDayLu(): string;
    getDayNineStar(): string;
    getMonthNineStar(): string;
    getYearNineStar(): string;
    getFestivals(): string[];
    getOtherFestivals(): string[];
    getTimes(): LunarTime[];
  }

  export class Solar {
    static fromYmd(year: number, month: number, day: number): Solar;
    getLunar(): Lunar;
    toYmd(): string;
  }
}
