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

function Mypage() {

    return (
        <div className="container">
            <h1>My 페이지</h1>
            <div style={{ display: "flex" }}>
                <div className="left" style={{ backgroundColor: "#E7F0FF", width: "250px", height: "200px", borderRadius: "12px" }}>
                    <ul>
                        <li style={{ margin: "20px", fontSize: "20px" }}><StyledLink to="/mypage/updateMyInfo">내 정보 수정</StyledLink></li>
                        <li style={{ margin: "20px", fontSize: "20px" }}><StyledLink to="/mypage/zzimList">찜 목록</StyledLink></li>
                        <li style={{ margin: "20px", fontSize: "20px" }}><StyledLink to="/mypage/replyList">작성한 댓글</StyledLink></li>
                    </ul>
                </div>
                <div className="right" style={{ flex: 1, padding: "30px" }}>
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
}
export default Mypage;