import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Mainpage from './eventpages/MainPage';
import EventView from './eventpages/EventView';




function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Mainpage/>}>
          </Route>
          <Route path="/eventView" element={<EventView/>}></Route>
          
        </Routes>
    </BrowserRouter>    
  );
}

export default App;
