import { Outlet, useLocation, useNavigate } from "react-router-dom"
import Sidebar from "../../js/sidebar/sidebar"
import arrow from '../../img/arrow.png';

function MyPage() {
    const location = useLocation()
    const navigate = useNavigate()

    // 현재 활성화된 메뉴 항목 확인
    const getActiveMenu = () => {
        const path = location.pathname
        if (path.includes("/likes")) return "likes"
        if (path.includes("/comments")) return "comments"
        if (path.includes("/joinEdit")) return "joinEdit"
        if (path.includes("/notice")) return "notice"

        return "likes"
    }

    // 페이지 제목 가져오기
    // const getPageTitle = () => {
    //     switch (getActiveMenu()) {
    //         case "likes":
    //             return "찜 목록"
    //         case "comments":
    //             return "작성한 댓글"
    //         default:
    //             return "내 정보 수정"
    //     }
    // }

    return (
        <div className="container main-content" style={{marginTop: "4vh"}}>

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
    )
}
export default MyPage;