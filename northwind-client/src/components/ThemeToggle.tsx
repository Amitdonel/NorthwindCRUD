import React, { useEffect, useState } from "react";
import "./ThemeToggle.css";

// Toggle component for switching between light and dark mode using CSS variables
const ThemeToggle: React.FC = () => {

    // Initialize theme based on saved preference in localStorage
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    // Apply selected theme to the root element and persist it in localStorage
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
                    onChange={() => setDarkMode(!darkMode)} // Toggle dark mode state when checkbox is clicked
                />
                <span className="slider">
                    {darkMode ? "🌙" : "☀️"}  {/* Emoji for visual feedback */}
                </span>
            </label>
            <div className="theme-label">
                {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} {/* Label text updates based on mode */}
            </div>
        </div>
    );
};

export default ThemeToggle;
