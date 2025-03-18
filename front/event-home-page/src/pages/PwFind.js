import { useRef, useState } from "react";
import "./../css/IdpwFind.css";
import axios from "axios";

function PwFind(){

    // 폼의 이름과 이메일과 연락처를 보관할 변수
    let [pwFindForm, setPwFindForm] = useState({});

    // 비밀번호를 찾기위해 데이터가 성공적으로 조회되었는지를 저장할 상태
    let [pwFound, setPwFound] = useState(false);

    // input 요소에 대한 ref
    const userIdRef = useRef(null);
    const emailRef = useRef(null);

    function setFormData(event){
        let name = event.target.name;
        let value = event.target.value;

        setPwFindForm(previous=>{ //한개일경우는 안써도되는데 데이터가 두개이상이면 데이터 보존을 위해 써준다.
            return {...previous, [name]:value};
        });
    }

    function formCheck(event){
        event.preventDefault(); // 기본이벤트 제거 (form은 기본적으로 페이지 이동하기때문에 기본 이벤트를 제거한다.)

        // 아이디 존재 유무 확인
        if(pwFindForm.userId==null || pwFindForm.userId==""){
            alert('아이디를 입력하세요.');
            userIdRef.current.focus();
            return false;
        }

        // 아이디 : 영어소문자와 숫자만 가능, 5글자이상 10글자이하, 특수문자 불가
        let regId = /^[a-z0-9]{5,10}$/;
        if(!regId.test(pwFindForm.userId)){ // true:조건에 맞다. , false:조건에 안맞음
            alert('아이디는 영어소문자와 숫자만 가능하며 5~10글자여야 합니다.');
            userIdRef.current.focus();
            return false;
        }

        // 이메일 존재 유무 확인
        if(pwFindForm.email==null || pwFindForm.email==""){
            alert('이메일을 입력하세요.');
            emailRef.current.focus();
            return false;
        }

        // 비동기식으로 백엔드 
        axios.post("http://localhost:9988/member/pwFindOk", {
            userId:pwFindForm.userId
            , email:pwFindForm.email
        })
        .then(function(response){
            console.log(response.data.result);

            // 응답의 result가 "idFindFail"인지 "idFindSuccess"인지 확인
            if (response.data.result === "pwFindFail") {
                alert("비밀번호 찾기 실패하였습니다. 다시 입력해주세요.");
                userIdRef.current.focus();
            } else if (response.data.result === "pwFindSuccess") {
                setPwFound(true);  // 비밀번호 찾기 성공 상태로 변경
            }
        })
        .catch(function(error){
            console.log(error);
        })
    }

    //비밀번호 재설정 -----------------------------------------------------------------------------------------------------------------------

    // 비밀번호재입력 폼의 비밀번호와 비밀번호 확인을 보관할 변수 
    let [pwResetForm, setPwResetForm] = useState({});

    // input 요소에 대한 ref
    const pwRef = useRef(null);
    const pwCheckRef = useRef(null);

    function setPwResetFormCheck(event){
        let name = event.target.name;
        let value = event.target.value;

        setPwResetForm(previous=>{ //한개일경우는 안써도되는데 데이터가 두개이상이면 데이터 보존을 위해 써준다.
            return {...previous, [name]:value};
        });
    }

    function pwFormCheck(event){
        event.preventDefault(); // 기본이벤트 제거 (form은 기본적으로 페이지 이동하기때문에 기본 이벤트를 제거한다.)

        // 비밀번호 존재 유무 확인
        if(pwResetForm.pw==null || pwResetForm.pw==""){
            alert('비밀번호를 입력하세요.');
            pwRef.current.focus();
            return false;
        }

        // 비밀번호 : 영대소문, 숫자만 가능 7글자이상 10글자이하 특수문자 !@#$%만 가능 
        let regPw = /^[A-Za-z0-9!@#$%]{7,10}$/;
        if(!regPw.test(pwResetForm.pw)){ // true:조건에 맞다. , false:조건에 안맞음
            alert('비밀번호는 영대소문자, 숫자, 특수문자(!@#$%)만 포함해야 하며 7글자이상 10글자이하여야 합니다.');
            pwRef.current.focus();
            return false;
        }
        
        // 비밀번호 재입력 존재 유무 확인 
        if(pwResetForm.pwCheck==null || pwResetForm.pwCheck==""){
            alert('비밀번호를 재입력하세요.');
            pwCheckRef.current.focus();
            return false;
        }

        // 비밀번호와 비밀번호 재입력이 서로 동일해야함으로 확인 
        if(pwResetForm.pw!=pwResetForm.pwCheck){
            alert('비밀번호를 동일하게 설정해야합니다.');
            pwCheckRef.current.focus();
            return false;
        }

        // 비동기식으로 백엔드 
        axios.post("http://localhost:9988/member/pwResetOk", {
            pw:pwResetForm.pw
            , userId:pwFindForm.userId
            , email:pwFindForm.email
        })
        .then(function(response){
            console.log(response.data.result);

            // 응답의 result가 "pwResetFail"인지 "pwResetSuccess"인지 확인
            if (response.data.result === "pwResetFail") {
                alert("비밀번호 재설정이 실패하였습니다. 다시 설정해주세요.");
            } else if (response.data.result === "pwResetSuccess") {
                alert("비밀번호 재설정이 성공하였습니다. 로그인페이지로 넘어갑니다.");
                window.location.href="/login"; // 홈으로 이동 
            }


        })
        .catch(function(error){
            console.log(error);
        })
    }

    return(
        <div className="id-find-container">
            <div className="id-find-form">
                {!pwFound ? (
                    <form onSubmit={formCheck}>
                        <div style={{textAlign:'left', fontSize:'20px', cursor:'pointer'}} onClick={() => window.history.back()}>←</div>
                        <h2>비밀번호 찾기</h2>
                        <div className="id-find-input">
                            <label htmlFor="userId">아이디</label>
                            <input type="text" id="userId" name="userId" style={{width:'50%'}} placeholder="아이디를 입력하세요." onChange={setFormData} ref={userIdRef} />
                        </div>
                        <div className="id-find-input">
                            <label htmlFor="email">이메일</label>
                            <input type="email" id="email" name="email" placeholder="이메일을 입력하세요." onChange={setFormData} ref={emailRef} />
                        </div>
                        <button className="idfind-btn">비밀번호 찾기</button>
                    </form>
                ) : (
                    <div>
                        <form onSubmit={pwFormCheck}>
                            <div style={{textAlign:'left', fontSize:'20px', cursor:'pointer'}} onClick={() => window.history.back()}>←</div>
                            <h2>비밀번호 <span style={{color:'blue'}}>재설정</span></h2>
                            <div className="id-find-input">
                                <label htmlFor="pw">비밀번호</label>
                                <input type="password" id="pw" name="pw" placeholder="비밀번호를 입력하세요." onChange={setPwResetFormCheck} ref={pwRef} />
                            </div>
                            <div className="id-find-input">
                                <label htmlFor="pwCheck">비밀번호 재입력</label>
                                <input type="password" id="pwCheck" name="pwCheck" placeholder="비밀번호를 다시 입력하세요." onChange={setPwResetFormCheck} ref={pwCheckRef} />
                            </div>
                            <button className="idfind-btn">비밀번호 재설정하기</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PwFind;