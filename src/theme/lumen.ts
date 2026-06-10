import { brand } from './brand';

/** Lumen app palette — kale-tokens.css + KaleLumenApp.jsx */
export const lumen = {
  /** Layout shell — deeper than content surfaces (Fresh.jsx full-screen bg) */
  bgDark: '#082B25',
  /** Primary content surface — kale-tokens.css --kale-dark */
  bgSurface: brand.kaleDark,
  /** Lumen teal accent surface — kale-tokens.css --kale-deep */
  bgDeep: brand.kaleDeep,
  bgLight: '#08615A',
  fg: '#EAF3E4',
  fgMuted: 'rgba(234,243,228,0.58)',
  fgFaint: 'rgba(234,243,228,0.32)',
  hairline: 'rgba(234,243,228,0.12)',
  lime: '#CCFA7D',
  mint: '#00C896',
  coral: '#E8826E',
  yellow: '#F5E94E',
  track: '#45807E',
  /** Onboarding glyph / ring — KaleLumen.jsx Lumen.green */
  green: '#14C088',
  /** Quiz option feedback — KaleLumenOnboarding.jsx `${color}22` */
  quizCorrectBg: '#CCFA7D22',
  quizWrongBg: '#E8826E22',
} as const;

export const lumenPillar = {
  cardio: '#00C896',
  strength: '#E8826E',
  knowledge: '#F5E94E',
} as const;

/** Loader glyph colour cycle — KaleLumen.jsx LUMEN_BRAND */
export const lumenBrand = [
  '#00C896',
  '#00A284',
  '#E8826E',
  '#F5E94E',
  '#CCFA7D',
] as const;
