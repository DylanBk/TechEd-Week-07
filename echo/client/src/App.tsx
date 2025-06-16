import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './components/pages/Home/Home';
import Auth from "./components/pages/Auth/Auth";
import Profile from "./components/pages/Profile/Profile";
import Settings from "./components/pages/Settings/Settings";
import NotFound from "./components/pages/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/signup' element={<Auth />}/>
        <Route path='/login' element={<Auth />}/>
        <Route path='/profile' element={<Profile />}/>
        <Route path='/settings' element={<Settings />}/>
        <Route path='*' element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App
