import { useEffect, useState } from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
	const [theme, setTheme] = useState(() => {
		const savedTheme = localStorage.getItem("linkedin-theme");
		if (savedTheme) return savedTheme;

		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "linkedin-dark" : "linkedin";
	});

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("linkedin-theme", theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((currentTheme) => (currentTheme === "linkedin-dark" ? "linkedin" : "linkedin-dark"));
	};

	return (
		<div className='min-h-screen bg-base-100 text-neutral transition-colors duration-200'>
			<Navbar theme={theme} onToggleTheme={toggleTheme} />
			<main className='max-w-7xl mx-auto px-4 py-6'>{children}</main>
		</div>
	);
};
export default Layout;
