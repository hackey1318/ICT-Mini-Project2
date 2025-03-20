import { Link } from "react-router-dom"
import "../../css/sidebar/sidebar.css"

function Sidebar({ activeMenu }) {
    return (
        <div className="sidebar-menu p-4 bg-light rounded">
            <div className="list-group list-group-flush border-0">
                <Link
                    to="/my"
                    className={`list-group-item list-group-item-action border-0 bg-transparent ${activeMenu === "profile" ? "active text-primary" : ""}`}
                >
                    내 정보 수정
                </Link>
                <Link
                    to="/my/likes"
                    className={`list-group-item list-group-item-action border-0 bg-transparent ${activeMenu === "wishlist" ? "active text-primary" : ""}`}
                >
                    찜 목록
                </Link>
                <Link
                    to="/my/comments"
                    className={`list-group-item list-group-item-action border-0 bg-transparent ${activeMenu === "comments" ? "active text-primary" : ""}`}
                >
                    작성한 댓글
                </Link>
            </div>
        </div>
    )
}

export default Sidebar