/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#4F46E5", // Indigo 600
                secondary: "#10B981", // Emerald 500
                accent: "#F59E0B", // Amber 500
                dark: "#020617", // Slate 950 (Deepest)
                light: "#f8fafc", // Slate 50
                navy: {
                    800: "#1e293b",
                    900: "#0f172a",
                    950: "#020617",
                },
                royal: {
                    800: "#1e1b4b",
                    900: "#312e81",
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
