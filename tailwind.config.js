/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 苹果风格配色
        'apple-white': '#FFFFFF',
        'apple-bg': '#F5F5F7',
        'apple-gray-100': '#E5E5EA',
        'apple-gray-400': '#86868B',
        'apple-gray-900': '#1D1D1F',
        'apple-black': '#000000',
        'apple-blue': '#007AFF',
        'apple-blue-hover': '#409CFF',
        'apple-blue-light': '#E8F2FF',
        'apple-red': '#FF3B30',
        'apple-green': '#34C759',
        'apple-orange': '#FF9500',
      },
      fontFamily: {
        'sans': ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'mono': ['"JetBrains Mono"', '"Noto Sans SC"', 'monospace'],
      },
      borderRadius: {
        'apple': '16px',
        'apple-sm': '8px',
        'apple-tag': '12px',
      },
      boxShadow: {
        'apple': '0 2px 12px rgba(0, 0, 0, 0.04)',
        'apple-hover': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'apple-drawer': '-4px 0 40px rgba(0, 0, 0, 0.08)',
      },
      backdropBlur: {
        'apple': '20px',
      },
    },
  },
  plugins: [],
}
