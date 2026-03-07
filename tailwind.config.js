import {} from 'tailwindcss';
const config = {
    content: ['./structure/**/*.{html,ts}', './scripts/**/*.{ts,js}'],
    theme: {
        extend: {
            colors: {
                'light-yellow': 'rgba(251, 208, 80, 1)',
                'dark-yellow': 'rgba(241, 180, 33, 1)',
            },
            fontFamily: {
                bitcount: ['Bitcount', 'sans-serif'],
                jetbrains: ['JetBrains Mono', 'monospace'],
            },
        },
    },
    plugins: [],
};
export default config;
//# sourceMappingURL=tailwind.config.js.map