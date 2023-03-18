import './App.css';
import "./Components/FontAwesomeIcons";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/** PAGES **/
import Homepage from './Pages/Homepage';
import Detector from './Pages/Detector';
import Finish from './Pages/Finish';
import ThankYou from './Pages/ThankYou';


function App() {
  //APP NAME
  document.title = "MSERS";
  document.body.style = "background: #FFFFFF;";

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Homepage/>}/>
          <Route path="/detector" element={<Detector/>}/>
          <Route path="/survey" element={<Finish/>}/>
          <Route path="/thank-you" element={<ThankYou/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
