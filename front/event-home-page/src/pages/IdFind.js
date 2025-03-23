import { useRef, useState } from "react";
import "./../css/IdpwFind.css";
import arrow from '../img/arrow.png';
import apiNoAccessClient from "../js/axiosConfigNoAccess";

function IdFind(){

    // 폼의 이름과 이메일과 연락처를 보관할 변수
    let [idFindForm, setIdFindForm] = useState({});

    // 아이디 찾기 성공 여부를 저장할 상태
    let [idFound, setIdFound] = useState(false);
    // 찾은 아이디를 저장할 상태
    let [userId, setUserId] = useState("");

    // input 요소들에 대한 ref 생성
    const nameRef = useRef(null);
    const emailRef = useRef(null);


    //form의 값 유효성검사 
    function setFormData(event){
        let name = event.target.name;
        let value = event.target.value;

        setIdFindForm(previous=>{ //한개일경우는 안써도되는데 데이터가 두개이상이면 데이터 보존을 위해 써준다.
            return {...previous, [name]:value};
        });
    }

    function formCheck(event){
        event.preventDefault(); // 기본이벤트 제거 (form은 기본적으로 페이지 이동하기때문에 기본 이벤트를 제거한다.)

        // 이름 존재 유무 확인
        if(idFindForm.name==null || idFindForm.name==""){
            alert('이름을 입력하세요.');
            nameRef.current.focus(); // 이름 필드로 포커스 이동
            return false;
        }

        // 이메일 존재 유무 확인
        if(idFindForm.email==null || idFindForm.email==""){
            alert('이메일을 입력하세요.');
            emailRef.current.focus(); // 이메일 필드로 포커스 이동
            return false;
        }

        // 비동기식으로 백엔드 
        apiNoAccessClient.post("/member/idFindOk", {
            name: idFindForm.name,
            email: idFindForm.email
        })
        .then(function(response) {
            console.log("Response:", response.data.result);  // 응답 데이터 확인
        
            // 응답의 result가 "idFindFail", "idFindSuccess", "idFindDelete"인지 확인
            if (response.data.result === "idFindFail") {
                // 실패 시 메시지 처리
                alert(response.data.message || "아이디 찾기 실패하였습니다. 다시 입력해주세요.");
            } else if (response.data.result === "idFindSuccess") {
                // 아이디 찾기 성공
                setUserId(response.data.userId);  // 찾은 아이디 저장
                setIdFound(true);  // 아이디 찾기 성공 상태로 변경
            } else if (response.data.result === "idFindDelete") {
                // 탈퇴한 사용자 처리
                alert(response.data.message || "이미 탈퇴한 사용자입니다.");
            }
        })
        .catch(function(error) {
            // 네트워크 오류나 서버 오류 처리
            console.error("Error:", error);
            alert("서버와의 통신에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        });
    }

    // 뒤로가기 버튼 눌렀을 때
    function goBack() {
        window.history.back(); // 뒤로가기 기능 추가
    }

    function copyToClipboard() {
        // 아이디 텍스트를 복사
        navigator.clipboard.writeText(userId).then(() => {
            alert("아이디가 복사되었습니다!");
        }).catch(err => {
            alert("복사에 실패했습니다. 다시 시도해주세요.");
        });
    }

    return(

        <div className="find-container">
            <div className="find-form">
                {!idFound ? (
                    <>
                    <button onClick={() => window.history.back()} style={{fontSize:'20px', position:'absolute', top:'15px', left:'15px', background:'none', border:'none', cursor:'pointer', transition:'background-color 0.3s ease'}}>
                        <img src={arrow} alt="Back Arrow" style={{width: '20px', height:'20px', objectFit:'contain'}} />
                    </button>
                    <form onSubmit={formCheck}>
                        <h2 style={{textAlign:'center', fontWeight:'600', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'}} >아이디 찾기</h2>
                        <div className="id-find-input">
                            <label htmlFor="name">이름</label>
                            <input type="text" id="name" name="name" style={{ width: '50%' }} placeholder="이름을 입력하세요." onChange={setFormData} ref={nameRef}/>
                        </div>
                        <div className="id-find-input">
                            <label htmlFor="email">이메일</label>
                            <input type="email" id="email" name="email" placeholder="이메일을 입력하세요." onChange={setFormData} ref={emailRef}/>
                        </div>
                        <button type="submit" className="idfind-btn">아이디 찾기</button>
                    </form>
                    </>
                ) : (
                    <div>
                        <div>
                            <h2 style={{textAlign:'center', fontWeight:'600', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', marginBottom:'40px'}} >아이디찾기 <span style={{color:'#3e9ca7'}}>성공</span></h2>
                            <div className="findIdSuccess">ID찾기에 성공하였습니다.<br />
                            찾은 아이디 : <span className="userId-style">{userId}</span>
                            <button onClick={copyToClipboard} className="namecopy-style" style={{marginBottom:'30px'}}>복사하기</button>
                            </div>
                            
                            <div className="button-container">
                                <a href="/login" className="login-button">로그인 페이지로 이동</a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default IdFind;