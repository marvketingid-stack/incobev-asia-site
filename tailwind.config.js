/**
 * IncoBev Asia — single source of truth for design tokens.
 * Values consolidated from IncoBev-Design-Build-Spec.md Sections 1–5.
 * (Replaces the 6 duplicated per-page inline configs from the source.)
 *
 * Responsive typography/section-padding steps (Spec Section 7) are applied
 * in src/css/input.css via component/utility layers, since Section 7 defines
 * per-breakpoint values rather than single fixed sizes.
 */
module.exports = {
  content: ['./dist/**/*.html'],
  darkMode: 'class',
  theme: {
    extend: {
      // ---- Section 1: Material Design 3 color tokens ----
      colors: {
        primary: '#003861',
        'primary-container': '#184f7f',
        'on-primary': '#ffffff',
        'on-primary-container': '#93c1f8',
        'primary-fixed': '#d1e4ff',
        'primary-fixed-dim': '#9ecaff',
        'on-primary-fixed': '#001d36',
        'on-primary-fixed-variant': '#0e4979',
        'inverse-primary': '#9ecaff',

        secondary: '#506075',
        'secondary-container': '#d3e4fd',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#56667b',
        'secondary-fixed': '#d3e4fd',
        'secondary-fixed-dim': '#b7c8e0',
        'on-secondary-fixed': '#0b1c2f',
        'on-secondary-fixed-variant': '#38485c',

        tertiary: '#512d00',
        'tertiary-container': '#714100',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#f4af69',
        'tertiary-fixed': '#ffdcbd',
        'tertiary-fixed-dim': '#feb871',
        'on-tertiary-fixed': '#2c1600',
        'on-tertiary-fixed-variant': '#693c00',

        background: '#f8f9fe',
        surface: '#f8f9fe',
        'surface-bright': '#f8f9fe',
        'surface-dim': '#d9dade',
        'surface-variant': '#e1e2e7',
        'surface-tint': '#306192',
        'on-background': '#191c1f',
        'on-surface': '#191c1f',
        'on-surface-variant': '#42474f',

        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f3f3f8',
        'surface-container': '#edeef2',
        'surface-container-high': '#e7e8ec',
        'surface-container-highest': '#e1e2e7',

        'inverse-surface': '#2e3134',
        'inverse-on-surface': '#f0f0f5',

        outline: '#727780',
        'outline-variant': '#c2c7d0',

        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
      },

      // ---- Section 4: Border radius ----
      borderRadius: {
        DEFAULT: '0.25rem', // 4px
        lg: '0.5rem', // 8px
        xl: '0.75rem', // 12px
        '2xl': '1rem', // 16px
        '3xl': '1.5rem', // 24px
        full: '9999px',
      },

      // ---- Section 2: Spacing scale ----
      spacing: {
        gutter: '32px',
        'margin-desktop': '64px',
        'margin-tablet': '32px',
        'margin-mobile': '16px',
      },
      maxWidth: {
        'container-max': '1280px',
      },

      // ---- Section 3: Font family ----
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      // ---- Section 3: Type scale (DESKTOP sizes; tablet/mobile steps in input.css) ----
      fontSize: {
        'display-lg': ['56px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-xl': ['40px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '1.3', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'label-sm': ['14px', { lineHeight: '1.2', letterSpacing: '0.05em', fontWeight: '600' }],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
