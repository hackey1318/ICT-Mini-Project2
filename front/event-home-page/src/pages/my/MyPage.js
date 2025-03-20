import { Outlet, useLocation, useNavigate } from "react-router-dom"
import Sidebar from "../../js/sidebar/sidebar"

function MyPage() {
    const location = useLocation()
    const navigate = useNavigate()

    // 현재 활성화된 메뉴 항목 확인
    const getActiveMenu = () => {
        const path = location.pathname
        if (path.includes("/my/likes")) return "likes"
        if (path.includes("/my/comments")) return "comments"
        return "profile"
    }

    // 페이지 제목 가져오기
    const getPageTitle = () => {
        switch (getActiveMenu()) {
            case "likes":
                return "찜 목록"
            case "comments":
                return "작성한 댓글"
            default:
                return "내 정보 수정"
        }
    }

    return (
        <div className="container main-content">
            <div className="page-header d-flex align-items-center d-md-none">
                <button className="btn btn-link p-0 me-3" onClick={() => navigate(-1)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="h4 mb-0">{getPageTitle()}</h1>
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
    )
}
export default MyPage;