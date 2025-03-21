import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../js/sidebar/sidebar"
import arrow from '../../img/arrow.png';


function Admin() {

    const location = useLocation()
    const navigate = useNavigate()

    // 현재 활성화된 메뉴 항목 확인
    const getActiveMenu = () => {
        const path = location.pathname
        if (path.includes("/my/likes")) return "likes"
        if (path.includes("/my/comments")) return "comments"
        return "profile"
    }

    return (
        <div className="container main-content" style={{marginTop: "4vh"}}>
            <div className="page-header d-flex align-items-center">
                <button className="btn btn-link p-0 me-3" onClick={() => navigate(-1)} style={{fontSize:'20px', position:'absolute', top:'30px', left:'30px', background:'none', border:'none', cursor:'pointer', transition:'background-color 0.3s ease'}}>
                    <img src={arrow} alt="Back Arrow" style={{width: '20px', height:'20px', objectFit:'contain'}} />
                </button>
            </div>

            <div className="row">
                {/* 사이드바 */}
                <div className="col-md-3 mb-4 mb-md-0">
                    <Sidebar activeMenu={getActiveMenu()} />
                </div>

                {/* 메인 콘텐츠 */}
                <div className="col-md-9">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
export default Admin;