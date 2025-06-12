import React, { useEffect, useState } from "react";
import "./ThemeToggle.css";


const ThemeToggle: React.FC = () => {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            root.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    return (
        <div className="theme-toggle-container">
            <label className="switch">
                <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                />
                <span className="slider">
                    {darkMode ? "🌙" : "☀️"}
                </span>
            </label>
            <div className="theme-label">
                {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </div>
        </div>
    );
};

export default ThemeToggle;
