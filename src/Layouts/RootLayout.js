import "../Views/RootLayoutViews.css"
import { useEffect, useState } from "react";
import { useLocation, Outlet, Link } from "react-router-dom";
import ThemeSwitch from "../Components/ThemeSwitch.js";

export default function RootLayout() {

    const [playlistConfirmLink, setPlaylistConfirmLink] = useState(null);
    const [destSelectLink, setDestSelectLink] = useState(null);

    const currentLocation = useLocation();

    const updateBreadcrumbs = () => {

        if(currentLocation.pathname.includes('playlist-confirm')) {
            setPlaylistConfirmLink(currentLocation.pathname);
            setDestSelectLink(null);
        }
        else if(currentLocation.pathname.includes('destination-select')) {
            setDestSelectLink(currentLocation.pathname);
        }
        else {
            setPlaylistConfirmLink(null);
            setDestSelectLink(null);
        }
    };

    useEffect(() => {
        updateBreadcrumbs();
    }, [currentLocation]);
    



    return(
        <div className="RootLayout">
            <header>
                <ThemeSwitch />

                <nav>
                    <div className="breadcrumbs">
                        <div className="crumb">
                            <Link to={"/"}>
                                <p>
                                    Find Playlist
                                </p>
                            </Link>
                        </div>
                        {playlistConfirmLink &&
                            <div className="crumb">
                                
                                    <Link to={playlistConfirmLink}>
                                        <p>
                                            Playlist Confirm
                                        </p>
                                    </Link>
                            </div>
                        }
                        {playlistConfirmLink === null &&
                            <p>
                                Playlist Confirm
                            </p>
                        }

                        {destSelectLink && 
                            <div className="crumb">
                            
                                    <Link to={destSelectLink}>
                                        <p>
                                            Destination Select
                                        </p>
                                    </Link>
                            </div>
                         }
                        {destSelectLink === null &&
                             <p>
                                 Destination Select
                             </p>
                         }
                    </div>
                </nav>
            </header>
            
            <main>
                <Outlet />
            </main>
        </div>
    );
}