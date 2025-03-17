import {Link} from 'react-router-dom';
import "./../css/Login.css";
import styled from 'styled-components';
import { useRef, useState } from 'react';
import axios from 'axios';


// Link 모듈에 스타일 지정하기
// npm install styled-components
const StyledLink = styled(Link)`
    text-decoration: none;
    color: #444444;
    margin: 0 5px;
    font-size: 13px;
    
    &:hover {
        color: #B8DFDD;
    }
`;

function Login(){
    // 폼의 아이디와 비밀번호를 보관할 변수
    const [loginForm, setLoginForm] = useState({
        userId: '',
        pw: ''
    });

    // input 요소에 접근하기 위한 ref
    const userIdRef = useRef(null);
    const pwRef = useRef(null);

    function setFormData(event) {
        const { name, value } = event.target;

        setLoginForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    //form의 값 유효성검사 
    function formCheck(event){
        event.preventDefault(); // 기본이벤트 제거 (form은 기본적으로 페이지 이동하기때문에 기본 이벤트를 제거한다.)

        // 아이디 존재 유무 확인
        if(loginForm.userId==null || loginForm.userId==""){
            alert('아이디를 입력하세요.');
            userIdRef.current.focus(); // userId input 필드로 포커스 이동
            return false;
        }

        // 아이디 : 영어소문자와 숫자만 가능, 5글자이상 10글자이하, 특수문자 불가
        let regId = /^[a-z0-9]{5,10}$/;
        if(!regId.test(loginForm.userId)){ // true:조건에 맞다. , false:조건에 안맞음
            alert('아이디는 영어소문자와 숫자만 가능하며 5~10글자여야 합니다.');
            userIdRef.current.focus(); // userId input 필드로 포커스 이동
            return false;
        }

        // // 비밀번호 존재 유무 확인
        // if(loginForm.pw==null || loginForm.pw==""){
        //     alert('비밀번호를 입력하세요.');
        //     pwRef.current.focus(); // pw input 필드로 포커스 이동
        //     return false;
        // }

        // // 비밀번호 : 영대소문, 숫자만 가능 7글자이상 10글자이하 특수문자 !@#$%만 가능 
        // let regPw = /^[A-Za-z0-9!@#$%]{7,10}$/;
        // if(!regPw.test(loginForm.pw)){ // true:조건에 맞다. , false:조건에 안맞음
        //     alert('비밀번호는 영대소문자, 숫자, 특수문자(!@#$%)만 포함해야 하며 7글자이상 10글자이하여야 합니다.');
        //     pwRef.current.focus(); // pw input 필드로 포커스 이동
        //     return false;
        // }

        // 비동기식으로 백엔드 
        axios.post("http://localhost:9988/member/loginOk", {
            userId:loginForm.userId,
            pw:loginForm.pw
        })
        .then(function(response){
            console.log(response.data);
            if(response.data.result===true){
                console.log("Response Headers:", response.headers);

                const accessToken = response.headers["accesstoken"];
                console.log("acc : " + accessToken)
                sessionStorage.setItem('accessToken', accessToken);

                alert("로그인 성공!!");
            }
        })
        .catch(function(error){
            if (error.response) {
                // 서버에서 응답한 에러 메시지
                console.error("Error:", error.response.data);
                // 실제 에러 메시지를 추출하여 표시
                alert("로그인 실패: " + (error.response.data.message || error.response.data));
            } else if (error.request) {
                // 요청이 이루어졌지만 응답을 받지 못한 경우
                console.error("Request Error:", error.request);
                alert("서버와의 연결이 실패했습니다.");
            } else {
                // 기타 오류 처리
                console.error("Unknown Error:", error.message);
                alert("알 수 없는 오류가 발생했습니다.");
            }
        })

    }

    return(
        <div className="login-container">
            <div className="login-style">
                <form onSubmit={formCheck}>
                    <h1>LOGIN</h1>
                    <div className="input-container">
                        <label htmlFor="userId">아이디</label>
                        <input type="text" id="userId" name="userId" className="input-style" placeholder="아이디를 입력하세요." onChange={setFormData} ref={userIdRef}/>
                    </div>
                    <div className="input-container">
                        <label htmlFor="pw">비밀번호</label>
                        <input type="password" id="pw" name="pw" className="input-style" placeholder="비밀번호를 입력하세요." onChange={setFormData} ref={pwRef}/>
                    </div>
                    <input type="submit" className="login-btn" value="로그인"/>
                    <div className="link-style">
                        <StyledLink to="/#">회원가입</StyledLink> | 
                        <StyledLink to="/idFind">아이디 찾기</StyledLink> | 
                        <StyledLink to="/pwFind">비밀번호 찾기</StyledLink>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;