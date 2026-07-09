/** Calming gradient palette ported from the web design system (oklch → hex). */
export const GRADIENT_STOPS = {
  'g-lilac': ['#c7aff5', '#8972d8', '#5d53ae'],
  'g-dawn': ['#ff9685', '#d4679f', '#8156c0'],
  'g-forest': ['#94cf9f', '#338d6b', '#006267'],
  'g-sea': ['#83d4d8', '#008cba', '#3d51a0'],
  'g-dusk': ['#de9a60', '#b14d51', '#693375'],
  'g-clay': ['#e6bc8b', '#d0815d', '#a45953'],
  'g-mist': ['#add9e8', '#99a9d8', '#8e7ab5'],
  'g-night': ['#504c8a', '#272755', '#101836'],
} as const;

export type GradientKey = keyof typeof GRADIENT_STOPS;

export const GRADIENTS = Object.keys(GRADIENT_STOPS) as GradientKey[];

/** White-ish foreground used on top of gradients (web's --on-thumb). */
export const ON_THUMB = '#FBFAFF';

/** Stable gradient pick from any string key (program slug, session id, etc.). */
export function gradForKey(key: string): GradientKey {
  let h = 0;
  for (const c of String(key)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}
