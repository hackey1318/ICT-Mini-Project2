import { useState } from "react";
import "./../css/IdpwFind.css";
import axios from "axios";

function PwFind(){

    // 폼의 이름과 이메일과 연락처를 보관할 변수
    let [pwFindForm, setPwFindForm] = useState({});

    //form의 값 유효성검사 
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
            document.getElementById("userId").focus();
            return false;
        }

        // 아이디 : 영어소문자와 숫자만 가능, 5글자이상 10글자이하, 특수문자 불가
        let regId = /^[a-z0-9]{5,10}$/;
        if(!regId.test(pwFindForm.userId)){ // true:조건에 맞다. , false:조건에 안맞음
            alert('아이디는 영어소문자와 숫자만 가능하며 5~10글자여야 합니다.');
            document.getElementById("userId").focus();
            return false;
        }

        // 이름 존재 유무 확인
        // if(pwFindForm.name==null || pwFindForm.name==""){
        //     alert('이름을 입력하세요.');
        //     document.getElementById("name").focus();
        //     return false;
        // }

        // 이메일 존재 유무 확인
        if(pwFindForm.email==null || pwFindForm.email==""){
            alert('이메일을 입력하세요.');
            document.getElementById("email").focus();
            return false;
        }

        // 연락처 존재 유무 확인
        // if (pwFindForm.tel1 == null || pwFindForm.tel1 == "") {
        //     alert('연락처를 입력하세요.');
        //     document.getElementById("tel1").focus(); 
        //     return false;
        // }
        // if (pwFindForm.tel2 == null || pwFindForm.tel2 == "") {
        //     alert('연락처를 입력하세요.');
        //     document.getElementById("tel2").focus();
        //     return false;
        // }
        // if (pwFindForm.tel3 == null || pwFindForm.tel3 == "") {
        //     alert('연락처를 입력하세요.');
        //     document.getElementById("tel3").focus();
        //     return false;
        // }
        //let tel = `${pwFindForm.tel1}-${pwFindForm.tel2}-${pwFindForm.tel3}`;

        // 비동기식으로 백엔드 
        axios.post("http://localhost:9988/member/pwFindOk", {
            userId:pwFindForm.userId
            // , name:pwFindForm.name
            , email:pwFindForm.email
            //, tel:tel
        })
        .then(function(response){
            console.log(response.data);
        })
        .catch(function(error){
            console.log(error);
        })

    }

    return(
        <div className="id-find-container">
            <div className="id-find-form">
                <form onSubmit={formCheck}>
                    <h2>비밀번호 찾기</h2>
                    <div className="id-find-input">
                        <label htmlFor="userId">아이디</label>
                        <input type="text" id="userId" name="userId" style={{width:'50%'}} placeholder="아이디를 입력하세요." onChange={setFormData}/>
                    </div>
                    {/* <div className="id-find-input">
                        <label htmlFor="name">이름</label>
                        <input type="text" id="name" name="name" style={{width:'50%'}} placeholder="이름을 입력하세요." onChange={setFormData}/>
                    </div> */}
                    <div className="id-find-input">
                        <label htmlFor="email">이메일</label>
                        <input type="email" id="email" name="email" style={{width:'70%'}} placeholder="이메일을 입력하세요." onChange={setFormData}/>
                    </div>
                    {/* <div className="id-find-input">
                        <label htmlFor="tel1">연락처</label>
                        <div style={{ display: 'flex' }}>
                            <input type="Number" min="01" max="999" id="tel1" name="tel1" style={{ width: '15%' }} onChange={setFormData}/>-
                            <input type="Number" min="1000" max="9999" id="tel2" name="tel2" style={{ width: '15%' }} onChange={setFormData}/>-
                            <input type="Number" min="1000" max="9999" id="tel3" name="tel3" style={{ width: '15%' }} onChange={setFormData}/>
                        </div>
                    </div> */}
                    <button className="idfind-btn">비밀번호 찾기</button>
                </form>
            </div>
        </div>
    )
}

export default PwFind;