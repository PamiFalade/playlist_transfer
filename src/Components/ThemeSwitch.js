import { useEffect, useState } from "react";
import "../Views/ThemeSwitch.css";

const ThemeSwitch = () => {

    let rootElem = document.documentElement;    // Gets a reference to the root node of the document

    // State variables for setting the theme of the web app
    const [colorTheme, setColorTheme] = useState("");   //Change default to be the system setting

    // Helper method to change the color theme and update the icons
    const updateColorTheme = (newTheme) => {
        rootElem.setAttribute('data-theme', newTheme);
        setColorTheme(rootElem.getAttribute('data-theme'));
        newTheme === 'dark' ? localStorage.setItem("iconColor", "white") : localStorage.setItem("iconColor", "black");   // Set the icon path in the local storage
        window.dispatchEvent(new Event("storage"));     // Notify event listeners of the update
    };


    // Get the the system's color theme
    const setInitialTheme = () => {
        let theme = localStorage.getItem('theme');    // Check the theme that the user last selected
        if(theme === null) {                            // If the user doesn't have a theme setting saved, match the system default
            let systemTheme = window.matchMedia("(prefers-color-scheme: dark)");    // Check if the system's theme is dark theme
            if(systemTheme.matches) {
                theme = 'dark';
            }
            else {
                theme = 'light';
            }
        }
        
        updateColorTheme(theme);
    };

    // Set the initial app color theme as soon as this component loads, which is when the main page loads
    useEffect(setInitialTheme, []);
    
    const toggleColorTheme = () => {
        let theme = "";
        (colorTheme === "light") ? theme = "dark" : theme = "light";
        updateColorTheme(theme);
        localStorage.setItem("theme", theme);
    };

    return(
        <div>
            {/* Switch that will toggle dark and light mode */}
            <div className="modeSwitch">
                <label className="switch" htmlFor="switch">
                    <input id="switch" type="checkbox" className="circle" checked={colorTheme==="light"} onChange={toggleColorTheme}/>
                    <svg
                    viewBox="0 0 384 512"
                    xmlns="http://www.w3.org/2000/svg"
                    className="moon svg"
                    >
                    !Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License
                    - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.
                    <path
                        d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"
                    ></path>
                    </svg>
                    <div className="sun svg">
                    <span className="dot"></span>
                    </div>
                </label>
            </div>
        </div>
    );
};

export default ThemeSwitch;