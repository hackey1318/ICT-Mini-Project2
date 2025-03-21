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
import IdFind from './pages/IdFind';
import PwFind from './pages/PwFind';
import MypageLayout from './pages/mypage/MypageLayout';
import Mypage from './pages/mypage/Mypage';
import UpdateMyInfo from './pages/mypage/UpdateMyInfo';
import ReplyList from './pages/mypage/ReplyList';
import Announce from './pages/admin/Announce';

import MyPage from './pages/my/MyPage';
import ProfilePage from './pages/my/ProfilePage';
import LikePage from './pages/my/likePage';
import CommentsPage from './pages/my/CommentPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/eventView/:no" element={<EventView />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/join' element={<Join />}></Route>

        <Route path="/admin" element={<MyPage />}>
          <Route index element={<MemberList />}></Route>
          <Route path="memberList" element={<MemberList />}></Route>
          <Route path="withdrawalList" element={<WithdrawalList />}></Route>
          <Route path="bannerList" element={<BannerList />}></Route>
          <Route path="createBanner" element={<CreateBanner />}></Route>
          <Route path='announce' element={<Announce />}></Route>
        </Route>

        <Route path="/mypage" element={<MypageLayout />}>
          <Route index element={<Mypage />}></Route>
          <Route path="updateMyInfo" element={<UpdateMyInfo />}></Route>
          <Route path="zzimList" element={<zzimList />}></Route>
          <Route path="replyList" element={<ReplyList />}></Route>
        </Route>

        <Route path="/joinEdit" element={<JoinEdit />}></Route>
        <Route path="/idFind" element={<IdFind />}></Route>
        <Route path="/pwFind" element={<PwFind />}></Route>

        <Route path="/my" element={<MyPage />}>
          <Route index element={<ProfilePage />} />
          <Route path="likes" element={<LikePage />} />
          <Route path="comments" element={<CommentsPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
