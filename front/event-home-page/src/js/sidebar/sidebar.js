import { Link } from "react-router-dom"
import "../../css/sidebar/sidebar.css"
import { useEffect, useState } from "react"
import axios from "axios";

function Sidebar({ activeMenu }) {

        const [role, setrole] = useState(true)

        useEffect(() => {

            const isAdmin = async () => {

            
                const accessToken = sessionStorage.getItem("accessToken"); // 토큰 가져오기
                const response = await axios.get("http://localhost:9988/auth", {
                    headers: {
                        Authorization: `Bearer ${accessToken}` // 헤더에 토큰 추가
                    }
                })
                setrole(response.data['result']);
            }

        }, []);
    

    return (
        <div className="sidebar-menu" style={{marginTop: "13vh"}}>
            <div className="list-group list-group-flush border-0" style={{ backgroundColor: "#E7F0FF", width: "250px", borderRadius: "12px", padding: "15px" }}>
                <Link
                    to="/my"
                    className={`list-group-item list-group-item-action border-0 bg-transparent ${activeMenu === "likes" ? "active text-primary" : ""}`}
                >
                    찜 목록
                </Link>
                <Link
                    to="/my/comments"
                    className={`list-group-item list-group-item-action border-0 bg-transparent ${activeMenu === "comments" ? "active text-primary" : ""}`}
                >
                    작성한 댓글
                </Link>
                <Link
                    to="/my/joinEdit"
                    className={`list-group-item list-group-item-action border-0 bg-transparent ${activeMenu === "joinEdit" ? "active text-primary" : ""}`}
                >
                    내 정보 수정
                </Link>
                {
                    role ?
                    <>
                        <Link
                            to="/admin/memberList"
                            className={`list-group-item list-group-item-action border-0 bg-transparent ${activeMenu === "memberList" ? "active text-primary" : ""}`}
                        >
                            회원 정보 조회
                        </Link>
                        <Link
                            to="/admin/withdrawalList"
                            className={`list-group-item list-group-item-action border-0 bg-transparent ${activeMenu === "withdrawalList" ? "active text-primary" : ""}`}
                        >
                            회원 탈퇴 명단
                        </Link>
                        <Link
                            to="/admin/bannerList"
                            className={`list-group-item list-group-item-action border-0 bg-transparent ${activeMenu === "bannerList" ? "active text-primary" : ""}`}
                        >
                            배너관리
                        </Link>
                        <Link
                            to="/admin/announce"
                            className={`list-group-item list-group-item-action border-0 bg-transparent ${activeMenu === "announce" ? "active text-primary" : ""}`}
                        >
                            공지 조회
                        </Link>
                    </>
                    : null
                }
            </div>
        </div>
    )
}

export default Sidebar