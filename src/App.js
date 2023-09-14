import "./App.css";
import Landing, { playlistLinkAction } from "./Pages/Landing";
import PlaylistConfirm, { playlistConfirmLoadeer } from "./Pages/PlaylistConfirm"
import DestinationSelect from "./Pages/DestinationSelect";
import RootLayout from "./Layouts/RootLayout";
import { BrowserRouter, createBrowserRouter, createRoutesFromElements, RouterProvider, Route, NavLink } from 'react-router-dom';
import PlatformSelector from "./Components/PlatformSelector";
import PlaylistDetails, { playlistDetailsLoader } from "./Components/PlaylistDetails";

function App() {

  const router = createBrowserRouter(
                      createRoutesFromElements(
                        <Route path="" element={<RootLayout />} >
                          {/* <Route path="first" element={<Landing />} action={playlistLinkAction}/> */}

                          <Route index element={<Landing />} action={playlistLinkAction}/>
                          <Route path="playlist-confirm" element={<PlaylistConfirm />} >
                            <Route path=":id" element={<PlaylistDetails />} />
                          </Route>
                          <Route path="destination-select" element={<DestinationSelect />} />

                          {/* <Route index element={<DestinationSelect />} /> */}

                        </Route>
                      ));
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
