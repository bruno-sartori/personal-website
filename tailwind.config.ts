import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const rgb = (token: string) => `rgb(var(--${token}) / <alpha-value>)`;

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: rgb('ink'),
        'ink-2': rgb('ink-2'),
        fg: rgb('fg'),
        muted: rgb('muted'),
        line: rgb('line'),
        neon: rgb('neon'),
        plasma: rgb('plasma'),
        flux: rgb('flux'),
        signal: rgb('signal'),
      },
      fontFamily: {
        sans: ['Geist Sans', ...defaultTheme.fontFamily.sans],
        mono: ['Geist Mono', ...defaultTheme.fontFamily.mono],
      },
      maxWidth: {
        site: '72rem',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
