import {BrowserRouter, Routes, Route} from 'react-router-dom';
import EventView from './pages/EventView';
import Reply from './pages/Reply';

function App() {

    return (
        <div className='container' style={{width: '100%', margin: "10% 10% 0"}}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<EventView/>}></Route>
                    <Route path='/pages/eventView' element={<EventView/>}></Route>
                    <Route path='/pages/reply' element={<Reply/>}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;


