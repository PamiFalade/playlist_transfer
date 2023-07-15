import "./App.css";
import Landing from "./Pages/Landing";
import PlaylistConfirm from "./Pages/PlaylistConfirm"
import DestinationConfirm from "./Pages/DestinationConfirm";
import RootLayout from "./Layouts/RootLayout";

import { BrowserRouter, createBrowserRouter, createRoutesFromElements, RouterProvider, Route, NavLink } from 'react-router-dom';

function App() {

  const router = createBrowserRouter(
                      createRoutesFromElements(
                        <Route path="/" element={<RootLayout />} >
                          <Route path="/mi" element={<Landing />} />
                          <Route path="playlist-confirm" element={<PlaylistConfirm />} />
                          <Route index element={<DestinationConfirm />} />
                        </Route>
                      ));
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
