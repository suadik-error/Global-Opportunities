/**
 * Kredibble Design System
 * Single source of truth for all design tokens used across the app.
 * Import from here when building new screens — never hardcode values.
 */

// ─── Colors ───────────────────────────────────────────────────────────────────

export const Colors = {
  // Brand
  primary: '#6671E4',
  primaryLight: '#8B95FF',
  primaryDark: '#3654FF',
  primaryTransparent: 'rgba(102, 113, 228, 0.1)',
  primaryChip: 'rgba(102, 113, 228, 0.12)',  // multi-select chip background

  // Backgrounds
  bgScreen: '#F7F7F9',       // auth + main screen background
  bgOnboarding: '#6671E4',   // onboarding screen background
  bgDefault: '#F3F3F3',
  bgAlt: '#F6F7F9',
  bgCard: '#FFFFFF',
  bgAdsBanner: '#EBEBEE',    // ads placeholder banner
  bgAdsBannerInner: '#E0E0E6',

  // Text
  textDefault: '#000000',
  textBody: '#1A1A1A',
  textMuted: '#8A8D9F',      // subtitles, helper text, secondary labels
  textSecondary: '#595959',
  textPlaceholder: '#A1A1AA',
  textOnPrimary: '#FFFFFF',
  textAds: '#B0B0BC',        // ads banner label
  textHeading: '#1A1A1A',    // screen-level header titles

  // Borders
  borderDefault: '#E5E6F2',
  borderInput: '#EBEBEE',

  // States
  success: '#16A34A',
  error: '#ED4C5C',
  warning: '#F6B612',

  // Tab Bar (purple background, all icons white)
  tabBar: '#6671E4',
  tabIcon: '#FFFFFF',
  tabIndicator: '#FFFFFF',   // active underline

  // Role selector cards (signup)
  radioUnselected: '#C4C4C4',

  // Utility
  divider: '#EBEBEE',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────

export const FontFamily = {
  sans: 'Inter',             // primary font — use className="font-sans" with NativeWind
} as const;

export const FontSize = {
  xs: 12,    // captions, helper text, chip labels, ads text
  sm: 13,    // form labels, footer links, search placeholder
  base: 14,  // body text, input values
  md: 15,    // card titles, primary button text, forgot password heading
  screenTitle: 17,  // home / tab screen header title
  lg: 22,    // auth screen headings ("Welcome")
  xl: 36,    // hero/display headings (onboarding)
} as const;

export const LineHeight = {
  body: 18,      // paired with FontSize.sm (13)
  card: 22,      // paired with FontSize.md (15) on feature cards
  subtext: 20,   // signup/login subtitle paragraphs
  heading: 42,   // paired with FontSize.xl (36) for hero headings
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,    // card titles, form labels
  semibold: '600' as const,  // screen header titles
  bold: 'bold' as const,     // auth headings, buttons, links
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────
// Base unit is 4px. Scale follows 2/4/8/16/20/24/32/40/48/64.

export const Spacing = {
  0.5: 2,
  1: 4,
  2: 8,
  3: 16,
  4: 20,    // home screen padding + feature card gap
  5: 24,    // auth screen horizontal padding
  6: 32,
  7: 40,
  8: 48,
  9: 64,
} as const;

export const Layout = {
  screenPaddingH: 24,     // auth screens horizontal edge padding
  homePaddingH: 20,       // home + tab screens horizontal edge padding
  screenPaddingTop: 28,   // top padding inside scrollable auth screens
  screenPaddingBottom: 24,
  sectionGap: 32,         // gap between major content sections
  fieldGap: 20,           // gap between form fields
  labelGap: 8,            // gap between a label and its input
  buttonGap: 16,          // gap between stacked secondary buttons
  inlineGap: 12,          // gap between an icon and its adjacent label
  checkboxGap: 8,         // gap between checkbox and its text
  featureCardGap: 20,     // gap between home screen feature cards (rows + columns)
  maxContentWidth: 800,   // web cap — content never wider than this
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────

export const Radius = {
  sm: 4,      // checkboxes, small chips
  md: 8,      // buttons, text inputs
  lg: 12,     // ads banner, pickers, role selector cards
  searchBar: 15,  // home search bar
  card: 16,   // feature cards, sheet corners
  full: 9999, // pills, avatar circles, ellipse decorations
} as const;

// ─── Sizing ───────────────────────────────────────────────────────────────────

export const Size = {
  // Buttons & inputs
  buttonHeight: 52,       // signup/auth primary button height
  inputHeight: 52,        // all text inputs (signup/login)
  searchBarHeight: 50,    // home screen search bar

  // Logo
  logoSize: 56,           // auth screen logo (signup/login)
  logoSizeHome: 40,       // home header logo

  // Tab bar
  tabBarHeight: 64,       // tab bar total height
  tabIconSize: 24,        // tab icon size
  tabIndicatorW: 20,      // active tab underline width
  tabIndicatorH: 3,       // active tab underline height

  // Home screen
  adsBannerHeight: 59,    // ads placeholder banner
  featureCardHeight: 121.7, // home screen feature card height

  // Progress bar (signup)
  progressBarHeight: 4,

  // Misc
  paginationDotActive: 6,
  paginationDotInactive: 4,
  paginationDotGap: 6,
  borderWidth: 1,
  checkboxSize: 16,
  checkboxIconSize: 12,
  socialIconSize: 18,
} as const;

// ─── Feature Card Decoration ──────────────────────────────────────────────────
// White blur ellipses placed at top-left and bottom-right corners of every
// home screen feature card.

export const CardDecor = {
  ellipseW: 37.93,
  ellipseH: 45.32,
  blur: '12px',           // CSS filter: blur() — web only
  color: '#FFFFFF',
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────

export const Shadow = {
  primaryButton: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  searchBar: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
} as const;
