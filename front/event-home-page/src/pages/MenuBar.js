import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';
import axios from 'axios';

const StyledLink = styled(Link)`
    text-decoration: none;
    &:link, &:visited, &:active {
        color: black;
    }
    &:hover {
        text-decoration:underline;
        text-underline-offset:10px;
    }
`;

const HeaderContainer = styled.header`
    position:absolute;
    display: flex;
    align-items: center;
    padding: 10px 20px;
    width:100%;
`;

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    padding-top:5px;
`;

const LogoContainer = styled.div`
    margin-right: 10px;
    margin-bottom: 10px;
`;

const Logo = styled.img`
    width: 100px;
    height: 100px;
`;

const HeaderMenu = styled.div`
    ul {
        list-style: none;
        display: flex;
        margin: 0;
    }
    li {
        margin-left: 10px;
    }   
    margin-left:30%;
`;

const Nav = styled.nav`
    ul {
        list-style: none;
        display: flex;
        margin: 20px; // 로고 아래 간격 추가
        padding: 0;

    }
    li {
        margin-right: 45px;
        &:last-child {
            margin-right: 0;
        }
            font-size: 1.5rem;
    }
`;



function Menubar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('accessToken'));
    const [userRole, setUserRole] = useState();

    useEffect(() => {
        const fetchUserRole = async () => {
            if (isLoggedIn) {
                try {
                    const response = await axios.get('http://localhost:9988/auth', {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
                        },
                    });
                    setUserRole(response.data);
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    setUserRole(null);
                }
            } else {
                setUserRole(null);
            }
        };
        fetchUserRole();
    }, [isLoggedIn]);

    const handleLogout = () => {
        sessionStorage.removeItem('accessToken');
        setIsLoggedIn(false);
        setUserRole(null);
        navigate('/');
    };
    const handleLogoClick = () => { // 로고 클릭 핸들러 추가
        navigate('/');
    };

    const getMyPageLink = () => {
        console.log("유저롤롤", userRole);
        if (userRole && userRole.result === true) {
            return '/admin';
        } else if (isLoggedIn) {
            return '/my';
        } else {
            return '/login';
        }
    };

    return (
        <HeaderContainer>
            <HeaderLeft>
                <LogoContainer>
                    <Logo src={logo} alt="Logo" onClick={handleLogoClick} />
                </LogoContainer>
            </HeaderLeft>
            <HeaderMenu>
                <Nav>
                    <ul>
                        <li><StyledLink to="/">홈</StyledLink></li>
                        <li><StyledLink to={getMyPageLink()}>
                            {userRole && userRole.result === true ? '관리자 페이지' : '마이페이지'}
                        </StyledLink></li>
                        <li>{isLoggedIn ? (
                            <StyledLink to="/" onClick={handleLogout}>로그아웃</StyledLink>
                        ) : (
                            <StyledLink to="/login">로그인</StyledLink>
                        )}</li>
                        <li><StyledLink to="/notice">공지사항</StyledLink></li>
                    </ul>
                </Nav>
            </HeaderMenu>
        </HeaderContainer>
    );
}
export default Menubar;