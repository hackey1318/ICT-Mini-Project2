import { useState } from "react";
import "./../css/IdpwFind.css";
import axios from "axios";

function IdFind(){

    // 폼의 이름과 이메일과 연락처를 보관할 변수
    let [idFindForm, setIdFindForm] = useState({});

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
            document.getElementById("name").focus(); // 아이디 필드로 포커스 이동
            return false;
        }

        // 이메일 존재 유무 확인
        if(idFindForm.email==null || idFindForm.email==""){
            alert('이메일을 입력하세요.');
            document.getElementById("email").focus(); // 아이디 필드로 포커스 이동
            return false;
        }

        // 연락처 존재 유무 확인
        // if (idFindForm.tel1 == null || idFindForm.tel1 == "") {
        //     alert('연락처를 입력하세요.');
        //     document.getElementById("tel1").focus(); 
        //     return false;
        // }
        // if (idFindForm.tel2 == null || idFindForm.tel2 == "") {
        //     alert('연락처를 입력하세요.');
        //     document.getElementById("tel2").focus();
        //     return false;
        // }
        // if (idFindForm.tel3 == null || idFindForm.tel3 == "") {
        //     alert('연락처를 입력하세요.');
        //     document.getElementById("tel3").focus();
        //     return false;
        // }
        //let tel = `${idFindForm.tel1}-${idFindForm.tel2}-${idFindForm.tel3}`;

        // 비동기식으로 백엔드 
        axios.post("http://localhost:9988/member/idFindOk", {
            name:idFindForm.name
            , email:idFindForm.email
            // , tel:tel
        })
        .then(function(response){
            if(response.data=="idFindFail"){
                alert("아이디찾기실패");
            }else{
                console.log(response.data);
                alert("찾은 아이디 : "+response.data);
            }
        })
        .catch(function(error){
            console.log(error);
        })

    }

    return(
        <div className="id-find-container">
            <div className="id-find-form">
                <form onSubmit={formCheck}>
                    <h2>아이디 찾기</h2>
                    <div className="id-find-input">
                        <label htmlFor="name">이름</label>
                        <input type="text" id="name" name="name" style={{width:'30%'}} placeholder="이름을 입력하세요." onChange={setFormData}/>
                    </div>
                    <div className="id-find-input">
                        <label htmlFor="email">이메일</label>
                        <input type="text" id="email" name="email" style={{width:'70%'}} placeholder="이메일을 입력하세요." onChange={setFormData}/>
                    </div>
                    {/* <div className="id-find-input">
                        <label htmlFor="tel1">연락처</label>
                        <div style={{ display: 'flex' }}>
                            <input type="Number" min="01" max="999" id="tel1" name="tel1" style={{ width: '15%' }} onChange={setFormData}/>-
                            <input type="Number" min="1000" max="9999" id="tel2" name="tel2" style={{ width: '15%' }} onChange={setFormData}/>-
                            <input type="Number" min="1000" max="9999" id="tel3" name="tel3" style={{ width: '15%' }} onChange={setFormData}/>
                        </div>
                    </div> */}
                    <button type="submit" className="idfind-btn">아이디 찾기</button>
                </form>
            </div>
        </div>
    )
}

export default IdFind;