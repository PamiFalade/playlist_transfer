import "./App.css";
import Landing, { playlistLinkAction } from "./Pages/Landing";
import PlaylistConfirm, { playlistConfirmLoadeer } from "./Pages/PlaylistConfirm"
import DestinationSelect from "./Pages/DestinationSelect";
import RootLayout from "./Layouts/RootLayout";

import { BrowserRouter, createBrowserRouter, createRoutesFromElements, RouterProvider, Route, NavLink } from 'react-router-dom';
import PlatformSelector from "./Components/PlatformSelector";

function App() {

  const router = createBrowserRouter(
                      createRoutesFromElements(
                        <Route path="" element={<RootLayout />} >
                          <Route index element={<Landing />} action={playlistLinkAction}/>
                          <Route path="playlist-confirm" element={<PlaylistConfirm />} loader={playlistConfirmLoadeer}>
                            <Route path=":id" element={<PlatformSelector />} />
                          </Route>
                          <Route path="destination-select" element={<DestinationSelect />} />
                        </Route>
                      ));
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
