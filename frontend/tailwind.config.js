import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [daisyui],
	daisyui: {
		themes: [
			{
				linkedin: {
					primary: "#0A66C2", // LinkedIn Blue
					secondary: "#FFFFFF", // White
					accent: "#7FC15E", // LinkedIn Green (for accents)
					neutral: "#000000", // Black (for text)
					"base-100": "#F3F2EF", // Light Gray (background)
					info: "#5E5E5E", // Dark Gray (for secondary text)
					success: "#057642", // Dark Green (for success messages)
					warning: "#F5C75D", // Yellow (for warnings)
					error: "#CC1016", // Red (for errors)
				},
			},
			{
				"linkedin-dark": {
					primary: "#71B7FB",
					secondary: "#1B1F23",
					accent: "#8FD06B",
					neutral: "#F3F6F8",
					"base-100": "#0F1215",
					"base-200": "#252A2F",
					"base-300": "#353B42",
					info: "#B7C0C8",
					success: "#62C78E",
					warning: "#F5C75D",
					error: "#FF6B70",
				},
			},
		],
	},
};
