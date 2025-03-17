import { Link, Outlet } from "react-router-dom";
import './../../css/adminStyle.css';
import styled from 'styled-components';

const StyledLink = styled(Link)`
        text-decoration:none;
        &:link, &:visited, &:active{
        color:black;
        }
        &:hover{
            color:blue;
        }
    `;

function Admin() {

    return (
        <div className="container">
            <h1>관리자 페이지</h1>
            <div style={{ display: "flex" }}>
                <div className="left" style={{ backgroundColor: "#E7F0FF", width: "250px", height: "200px" }}>
                    <ul>
                        <li style={{ margin: "20px", fontSize: "20px" }}><StyledLink to="/admin/memberList">회원 정보 조회</StyledLink></li>
                        <li style={{ margin: "20px", fontSize: "20px" }}><StyledLink to="/admin/withdrawalList">회원 탈퇴 명단</StyledLink></li>
                        <li style={{ margin: "20px", fontSize: "20px" }}><StyledLink to="/admin/bannerList">배너관리</StyledLink></li>
                    </ul>
                </div>
                <div className="right" style={{ flex: 1, padding: "30px" }}>
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
}
export default Admin;