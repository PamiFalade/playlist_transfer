import "../Views/RootLayoutViews.css"
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export default function RootLayout() {

    let rootElem = document.documentElement;    // Gets a reference to the root node of the document
    // State variables for setting the theme of the web app
    const [colorTheme, setColorTheme] = useState("");   //Change default to be the system setting

    // Get the the system's color theme
    const setInitialTheme = () => {
        let systemTheme = window.matchMedia("(prefers-color-scheme: dark)");    // Check if the system's theme is dark theme
        if(systemTheme.matches) {
            rootElem.setAttribute('data-theme', 'dark');
        }
        else {
            rootElem.setAttribute('data-theme', 'light');
        }
        setColorTheme(rootElem.getAttribute('data-theme'));
    }

    useEffect(setInitialTheme, []);
    
    const toggleColorTheme = () => {
        (colorTheme === "light") ? rootElem.setAttribute('data-theme', "dark") : rootElem.setAttribute('data-theme', "light");
        setColorTheme(rootElem.getAttribute('data-theme'));
    }

    return(
        <div className="RootLayout">

            <main>
                    {/* Switch that will toggle dark and light mode */}
                <div className="modeSwitch">
                    <label className="switch" for="switch">
                        <input id="switch" type="checkbox" class="circle" checked={colorTheme==="light"} onChange={toggleColorTheme}/>
                        <svg
                        viewBox="0 0 384 512"
                        xmlns="http://www.w3.org/2000/svg"
                        class="moon svg"
                        >
                        !Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License
                        - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.
                        <path
                            d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"
                        ></path>
                        </svg>
                        <div class="sun svg">
                        <span class="dot"></span>
                        </div>
                    </label>
                </div>

                <Outlet />
            </main>
        </div>
    );
}