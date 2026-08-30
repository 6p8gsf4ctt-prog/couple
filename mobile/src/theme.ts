import { Platform } from 'react-native';

export const colors = {
  ivory: '#F7F2E8',
  paper: '#FBF7EF',
  paperDeep: '#EFE4D3',
  graphite: '#35312E',
  muted: '#776F68',
  sand: '#DCCBB6',
  blush: '#DCAEA3',
  blushLight: '#EFD8D1',
  burgundy: '#7A3036',
  burgundySoft: '#98535A',
  line: '#D9CBBB',
  white: '#FFFFFF',
  success: '#765F51',
};

export const typography = {
  ui: Platform.select({ ios: 'System', android: 'sans-serif' }),
  editorial: Platform.select({ ios: 'Georgia', android: 'serif' }),
};

export const radius = {
  s: 12,
  m: 18,
  l: 26,
  xl: 34,
};

export const spacing = {
  xs: 6,
  s: 10,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 44,
};

export const shadow = {
  shadowColor: '#3C2D25',
  shadowOpacity: 0.12,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 9 },
  elevation: 5,
};
