/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#004526',
                    hover: '#046b3b',
                },
                secondary: {
                    DEFAULT: '#F3F4F6', // gray-100
                    text: '#111827', // gray-900
                },
                facebook: '#1877F2',
                google: '#EA4335',
                apple: '#000000',
                success: '#22C55E',
                error: '#EF4444',
                warning: '#EAB308',
            },
            fontFamily: {
                // Add custom fonts here if needed
            }
        },
    },
    plugins: [],
};
