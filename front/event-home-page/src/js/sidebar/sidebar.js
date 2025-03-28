import { Link } from "react-router-dom"
import "../../css/sidebar/sidebar.css"
import { useEffect, useState } from "react"
import apiClient from "../axiosConfig";

function Sidebar({ activeMenu }) {

        const [role, setrole] = useState(false)

        useEffect(() => {

            const isAdmin = async () => {

            
                const accessToken = sessionStorage.getItem("accessToken"); // 토큰 가져오기
                const response = await apiClient.get("/auth", {
                    headers: {
                        Authorization: `Bearer ${accessToken}` // 헤더에 토큰 추가
                    }
                })
                setrole(response.data['result']);
            }
            isAdmin()
        }, []);
    

    return (
        <div className="sidebar-menu" style={{marginTop: "13vh", marginBottom:"150px"}}>
            <div className="list-group list-group-flush border-0" style={{ backgroundColor: "#E7F0FF", width: "250px", borderRadius: "12px", padding: "15px" }}>
                <Link
                    to="/my/likes"
                    className={`list-group-item list-group-item-action border-0 bg-transparent ${activeMenu === "likes" ? "active text-primary" : ""}`}
                >
                    찜 목록
                </Link>
                <Link
                    to="/my/comments"
                    className={`list-group-item list-group-item-action border-0 bg-transparent ${activeMenu === "comments" ? "active text-primary" : ""}`}
                >
                    작성한 후기
                </Link>
                <Link
                    to="/my/notice"
                    className={`list-group-item list-group-item-action border-0 bg-transparent ${activeMenu === "notice" ? "active text-primary" : ""}`}
                >
                    공지사항
                </Link>
                <Link
                    to="/my/joinEdit"
                    className={`list-group-item list-group-item-action border-0 bg-transparent ${activeMenu === "joinEdit" ? "active text-primary" : ""}`}
                >
                    내 정보 수정
                </Link>
            </div>
        </div>
    )
}

export default Sidebar