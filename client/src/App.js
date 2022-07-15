import Toolbar from "./components/Toolbar"
import Settingbar from "./components/Settingbar"
import Canvas from "./components/Canvas"
import "./styles/app.scss"
import {Navigate, Route, BrowserRouter, Routes} from "react-router-dom"
import { v4 as uuidv4 } from 'uuid';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/:id" element={<><Toolbar /><Settingbar /><Canvas /></>} />
          <Route path="/" element={<Navigate to={`${uuidv4()}`} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
