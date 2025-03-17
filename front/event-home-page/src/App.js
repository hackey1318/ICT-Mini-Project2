import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Admin from './pages/admin/Admin';
import Layout from './pages/admin/Layout';
import MemberList from './pages/admin/MemberList';
import WithdrawalList from './pages/admin/WithdrawalList';
import BannerList from './pages/admin/BannerList';
import CreateBanner from './pages/admin/CreateBanner';
import MainPage from './pages/MainPage';
import Mainpage from './eventpages/MainPage';
import EventView from './eventpages/EventView';
import Reply from './pages/Reply';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/eventView" element={<EventView/>}></Route>
        <Route path='/pages/reply' element={<Reply/>}></Route>

        <Route path="/admin" element={<Layout />}>
          <Route index element={<Admin />}></Route>
          <Route path="memberList" element={<MemberList />}></Route>
          <Route path="withdrawalList" element={<WithdrawalList />}></Route>
          <Route path="bannerList" element={<BannerList />}></Route>
          <Route path="createBanner" element={<CreateBanner />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
