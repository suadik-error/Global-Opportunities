/**
 * Kredibble Admin Design Tokens
 * Ported from kredibble-app/src/constants/design.ts to keep the admin
 * dashboard visually consistent with the mobile/web app. Use these for
 * inline styles or logic; Tailwind utility classes (bg-primary, text-muted,
 * etc.) are wired to the same values via globals.css.
 */

export const Colors = {
  // Brand
  primary: '#6671E4',
  primaryLight: '#8B95FF',
  primaryDark: '#3654FF',
  primaryTransparent: 'rgba(102, 113, 228, 0.1)',
  primaryChip: 'rgba(102, 113, 228, 0.12)',

  // Backgrounds
  bgScreen: '#F7F7F9',
  bgCard: '#FFFFFF',
  bgAlt: '#F6F7F9',

  // Text
  textBody: '#1A1A1A',
  textMuted: '#8A8D9F',
  textSecondary: '#595959',
  textPlaceholder: '#A1A1AA',
  textHeading: '#1A1A1A',

  // Borders
  borderDefault: '#E5E6F2',
  borderInput: '#EBEBEE',

  // States
  success: '#16A34A',
  error: '#ED4C5C',
  warning: '#F6B612',

  // Utility
  divider: '#EBEBEE',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  card: 16,
  full: 9999,
} as const;

export const FontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;
