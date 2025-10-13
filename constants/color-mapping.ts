/**
 * Color Mapping Constants
 * 
 * This file maps static hex colors to semantic color names
 * to improve maintainability and consistency across the application.
 */

// Common static colors found in the codebase mapped to semantic names
export const COLOR_MAPPING = {
    // Primary Blue Colors
    PRIMARY_BLUE: '#1C68DA',
    PRIMARY_BLUE_LIGHT: '#175CD3',
    PRIMARY_BLUE_DARK: '#2949A4',

    // Secondary Colors
    SECONDARY_GRAY: '#717680',
    SECONDARY_GRAY_DARK: '#414651',
    SECONDARY_GRAY_LIGHT: '#637381',

    // Background Colors
    BACKGROUND_WHITE: '#FFFFFF',
    BACKGROUND_LIGHT: '#FDFDFD',
    BACKGROUND_CARD: '#FCFCFD',
    BACKGROUND_NEUTRAL: '#FAFAFA',

    // Border Colors
    BORDER_LIGHT: '#D3D3D3',
    BORDER_NEUTRAL: '#D5D7DA',
    BORDER_CARD: '#E9EAEB',
    BORDER_BLUE: '#DEEBFB',

    // Text Colors
    TEXT_PRIMARY: '#18181B',
    TEXT_SECONDARY: '#212B36',
    TEXT_MUTED: '#181D27',
    TEXT_DISABLED: '#A1A1AA',
    TEXT_CALENDAR: '#72777C',
    TEXT_SUMMARY: '#535862',

    // Status Colors - Success
    SUCCESS_PRIMARY: '#039855',
    SUCCESS_LIGHT: '#ECFDF3',
    SUCCESS_DARK: '#087443',
    SUCCESS_BG: '#EDFCF2',

    // Status Colors - Warning
    WARNING_PRIMARY: '#F79009',
    WARNING_LIGHT: '#FFFAEB',
    WARNING_BG: '#FEF6EE',
    WARNING_BORDER: '#DC6803',
    WARNING_DARK: '#B93815',

    // Status Colors - Error/Danger
    ERROR_PRIMARY: '#F04438',
    ERROR_LIGHT: '#FEF3F2',
    ERROR_BORDER: '#FCCEEE',
    ERROR_DARK: '#D92D20',

    // Status Colors - Info
    INFO_PRIMARY: '#1C68DA',
    INFO_LIGHT: '#F2F7FE',
    INFO_BG: '#EFF8FF',

    // Package Colors
    PACKAGE_GOLD: '#F8AC3F',
    PACKAGE_SILVER: '#B6BCC2',
    PACKAGE_BRONZE: '#BF8970',
    PACKAGE_WHITE: '#6B7280',

    // Calendar Event Colors
    EVENT_PINK: '#C11574',
    EVENT_PINK_BG: '#FDF2FA',
    EVENT_PINK_BORDER: '#EF26B2',
    EVENT_PINK_TEXT: '#DD2590',
    EVENT_PURPLE: '#6941C6',
    EVENT_PURPLE_BG: '#F9F5FF',
    EVENT_PURPLE_BORDER: '#7500FE',
} as const;

// Utility function to get color value
export const getColorValue = (colorName: keyof typeof COLOR_MAPPING): string => {
    return COLOR_MAPPING[colorName];
};

// CSS Variable equivalents for colors that should use the design system
export const CSS_VARIABLE_MAPPING = {
    // Map static colors to existing CSS variables where possible
    PRIMARY_BLUE: 'hsl(var(--primary-active))',
    SECONDARY_GRAY: 'hsl(var(--foreground-mute))',
    BACKGROUND_WHITE: 'hsl(var(--card))',
    BORDER_LIGHT: 'hsl(var(--border))',
    TEXT_PRIMARY: 'hsl(var(--foreground))',
    SUCCESS_PRIMARY: 'hsl(var(--success-active))',
    WARNING_PRIMARY: 'hsl(var(--warning-active))',
    ERROR_PRIMARY: 'hsl(var(--destructive))',
    INFO_PRIMARY: 'hsl(var(--info-active))',
} as const;

