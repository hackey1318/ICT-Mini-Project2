import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Admin from './pages/admin/Admin';
import Layout from './pages/admin/Layout';
import MemberList from './pages/admin/MemberList';
import WithdrawalList from './pages/admin/WithdrawalList';
import BannerList from './pages/admin/BannerList';
import CreateBanner from './pages/admin/CreateBanner';
import MainPage from './eventpages/MainPage';
import EventView from './eventpages/EventView';
import JoinEdit from './pages/JoinEdit';
import Login from './pages/Login';
import Join from './pages/Join';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/eventView" element={<EventView/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/join' element={<Join/>}></Route>

        <Route path="/admin" element={<Layout />}>
          <Route index element={<Admin />}></Route>
          <Route path="memberList" element={<MemberList />}></Route>
          <Route path="withdrawalList" element={<WithdrawalList />}></Route>
          <Route path="bannerList" element={<BannerList />}></Route>
          <Route path="createBanner" element={<CreateBanner />}></Route>
        </Route>
        <Route path="/member/joinEdit" element={<JoinEdit/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
