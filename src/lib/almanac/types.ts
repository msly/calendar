export type ExplanationKey =
  | 'clash'
  | 'dutyDeity'
  | 'dayOfficer'
  | 'wealthDirection'
  | 'joyDirection'
  | 'fortuneDirection'
  | 'fetusDeity'
  | 'mansion'
  | 'nayin'
  | 'yearGanzhi'
  | 'monthGanzhi'
  | 'dayGanzhi'
  | 'zodiac'
  | 'solarTerm'
  | 'phenology'
  | 'liuyao'
  | 'pengZu'
  | 'dayLu'
  | 'guiDirection'
  | 'taiSuiDirection'
  | 'nineStar'
  | 'gongShou'
  | 'folkCustom';

export type AlmanacField = {
  label: string;
  value: string;
  explanationKey: ExplanationKey;
};

export type AlmanacFieldGroup = {
  title: string;
  fields: AlmanacField[];
};

export type AlmanacHour = {
  label: string;
  range: string;
  deity: string;
  luck: string;
  suitable: string[];
  avoid: string[];
  clash: string;
  segments?: AlmanacHourSegment[];
};

export type AlmanacHourSegment = {
  label: string;
  range: string;
  deity: string;
  luck: string;
  suitable: string[];
  avoid: string[];
  clash: string;
};

export type AlmanacDay = {
  isoDate: string;
  summary: {
    suitable: string[];
    avoid: string[];
    plainSummary: string;
  };
  core: {
    clash: AlmanacField;
    dutyDeity: AlmanacField;
    dayOfficer: AlmanacField;
    wealthDirection: AlmanacField;
    joyDirection: AlmanacField;
    fortuneDirection: AlmanacField;
    fetusDeity: AlmanacField;
    mansion: AlmanacField;
    nayin: AlmanacField;
  };
  additionalGroups: AlmanacFieldGroup[];
  hours: AlmanacHour[];
};
