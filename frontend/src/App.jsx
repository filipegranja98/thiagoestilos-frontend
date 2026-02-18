import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Agendar from "./pages/Agendar";
import Reagendar from "./pages/Reagendar";
import Cancelar from "./pages/Cancelar.jsx";
import Home from "./pages/Home";
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agendar" element={<Agendar />} />
        <Route path="/reagendar" element={<Reagendar />} />
         <Route path="/cancelar" element={<Cancelar />} />
      </Routes>
    </Router>
  );
}

export default App;
