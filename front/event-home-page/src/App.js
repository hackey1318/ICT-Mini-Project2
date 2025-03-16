import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Mainpage from './eventpages/MainPage';



function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Mainpage/>}>
          
          </Route>
        </Routes>
    </BrowserRouter>    
  );
}

export default App;
