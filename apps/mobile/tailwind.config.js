// tailwind.config.js

module.exports = {
    content: [],
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx"
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ["Averia Serif Libre", "serif"],
                "serif-bold": ["SerifBold", "serif"],
                "serif-italic": ["SerifItalic", "serif"],
                "serif-bold-italic": ["SerifBoldItalic", "serif"]
            },
            colors: {
                background: "#1C1C1C"
            }
        }
    },
    plugins: []
};
