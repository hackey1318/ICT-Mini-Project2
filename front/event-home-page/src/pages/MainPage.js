import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(Link)`
        text-decoration:none;
        &:link, &:visited, &:active{
        color:black;
        }
        &:hover{
            color:blue;
        }
    `;
function MainPage() {
    return (
        <div className="container">
            <h1>이음 IEUM</h1>
            <ul>
                <li><StyledLink to="/">홈</StyledLink></li>
                <li><StyledLink to="/admin">Admin</StyledLink></li>
            </ul>
        </div>
    );
}
export default MainPage;