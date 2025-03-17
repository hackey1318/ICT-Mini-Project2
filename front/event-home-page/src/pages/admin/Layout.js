import { Outlet, Link } from 'react-router-dom';
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

function Layout() {
    return (
        <div>
            <nav className="Menu">
                <ul>
                    <li><StyledLink to="/">홈</StyledLink></li>
                    <li><StyledLink to="/admin">Admin</StyledLink></li>
                </ul>
            </nav>
            <Outlet></Outlet>
        </div>
    )
}
export default Layout;