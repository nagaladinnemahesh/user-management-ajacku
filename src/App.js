import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

// all application routes and navigations

function App(){
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<Dashboard />} /> 
      </Routes>
    </Router>
  );
}

export default App;