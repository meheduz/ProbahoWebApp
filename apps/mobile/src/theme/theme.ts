import { MD3LightTheme, configureFonts } from 'react-native-paper'

// Custom colors matching the web app
const colors = {
  primary: '#2563eb',
  primaryContainer: '#dbeafe',
  secondary: '#22c55e',
  secondaryContainer: '#dcfce7',
  tertiary: '#facc15',
  tertiaryContainer: '#fef3c7',
  surface: '#ffffff',
  surfaceVariant: '#f9fafb',
  background: '#ffffff',
  error: '#ef4444',
  errorContainer: '#fef2f2',
  onPrimary: '#ffffff',
  onSecondary: '#ffffff',
  onTertiary: '#000000',
  onSurface: '#111827',
  onSurfaceVariant: '#6b7280',
  onBackground: '#111827',
  onError: '#ffffff',
  outline: '#e5e7eb',
  outlineVariant: '#f3f4f6',
}

const fonts = configureFonts({
  config: {
    fontFamily: 'System',
  },
})

export const theme = {
  ...MD3LightTheme,
  colors,
  fonts,
  roundness: 12,
}

// Additional custom theme properties
export const customColors = {
  // MFS Provider Colors
  bkash: '#E2136E',
  rocket: '#1E40AF', 
  nagad: '#059669',
  upay: '#7C3AED',
  tapp: '#EA580C',
  mycash: '#DC2626',
  
  // Status Colors
  success: '#22c55e',
  warning: '#f59e0b',
  info: '#3b82f6',
  error: '#ef4444',
  
  // Background Colors
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  body1: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    lineHeight: 16,
  },
}
