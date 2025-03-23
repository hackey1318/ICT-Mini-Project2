import { Link } from "react-router-dom"
import "./../../css/admin.css";
import { useEffect, useState } from "react"
import apiClient from "../axiosConfig";

function AdminSidebar({ activeMenu }) {

    const [role, setrole] = useState(false)

    useEffect(() => {

        const isAdmin = async () => {


            const accessToken = sessionStorage.getItem("accessToken"); // 토큰 가져오기
            const response = await apiClient.get("/auth", {
                headers: {
                    Authorization: `Bearer ${accessToken}` // 헤더에 토큰 추가
                }
            })
            if (response.data['result'] === false) {
                alert("권한이 부족합니다.")
                window.location.href = "/";
            }
            setrole(response.data['result']);
        }
        isAdmin()
    }, []);


    return (
        <div className="admin-sidebar" style={{ marginTop: "13vh" }}>
            <h1 className="admin-title">관리자 메뉴</h1>
            <ul>
                <li className="admin-nav-item">
                    <Link
                        to="/admin/memberList"
                        className={`admin-nav-link  ${activeMenu === "memberList" ? "active text-primary" : ""}`}
                    >
                        회원 정보 조회
                    </Link>
                </li>
                <li className="admin-nav-item">
                    <Link
                        to="/admin/memberDelList"
                        className={`admin-nav-link ${activeMenu === "memberDelList" ? "active text-primary" : ""}`}
                    >
                        회원 탈퇴 명단
                    </Link>
                </li>
                <li className="admin-nav-item">
                    <Link
                        to="/admin/bannerList"
                        className={`admin-nav-link ${activeMenu === "bannerList" ? "active text-primary" : ""}`}
                    >
                        배너관리
                    </Link>
                </li>
                <li className="admin-nav-item">
                    <Link
                        to="/admin/announce"
                        className={`admin-nav-link ${activeMenu === "announce" ? "active text-primary" : ""}`}
                    >
                        공지 조회
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default AdminSidebar;