import { useEffect, useRef, useState } from 'react';
import '../css/Join.css';
import axios from 'axios';

function JoinEdit(){
    //회원정보를 보관할 변수
    let [joinData, setJoinData] = useState({
        user_id: '',
        pw: '',
        pw_check: '',
        user_name: '',
        email: '',
        tel1: '',
        tel2: '',
        tel3: '',
        tel: '',
        zipcode: '',
        addr: '',
        birth: ''
    });

    //회원정보페이지 접속하면 데이터 불러오기
    const mounted = useRef(false);
    useEffect(()=>{
        if(!mounted.current){
            mounted.current = true;
        }else{
            getJoinEdit(); //회원정보 불러오는 함수
        }
    },[]);

    //입력하는 값이 변경되면 호출됨
    function setFormData(event) {
        const { name, value } = event.target;

        if (name === 'tel1' || name === 'tel2' || name === 'tel3') {
            setJoinData(prevState => {
                const updatedData = {
                    ...prevState,
                    [name]: value
                };
                // tel 업데이트
                updatedData.tel = `${updatedData.tel1}-${updatedData.tel2}-${updatedData.tel3}`;
                return updatedData;
            });
        }

        setJoinData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    //start : 생년월일 -----------------------
    //생년월일을 보관할 변수
    let [year, setYear] = useState('');
    let [month, setMonth] = useState('');
    let [day, setDay] = useState('');
    //DB에서 생년월일 불러와서, 년월일로 쪼개서 값 셋팅
    let handleBirthdayChange = (type, value) => {
        if (type === 'year') {
            setYear(value);
        } else if (type === 'month') {
            setMonth(value);
        } else if (type === 'day') {
            setDay(value);
        }
        console.log(year, month, day)
    };
    // end ----------------------------------------------

    //start : 연락처 -----------------------
    //연락처를 보관할 변수
    let [tel1, setTel1] = useState('');
    let [tel2, setTel2] = useState('');
    let [tel3, setTel3] = useState('');
    //DB에서 연락처 불러와서, 쪼개서 값 셋팅
    let handleTelChange = (type, value) =>{
        if (type === 'tel1') {
            console.log("tel1="+tel1);
            setTel1(value);
        } else if (type === 'tel2') {
            console.log("tel2="+tel2);
            setTel2(value);
        } else if (type === 'tel3') {
            console.log("tel3="+tel3);
            setTel3(value);
        }
    }
    // end ----------------------------------------------

    //start : 우편번호 -----------------------
    //우편번호, 주소 보관할 변수
    let [zipcode, setZipcode] = useState('');
    let [addr, setAddr] = useState('');
    //우편번호버튼 클릭시 우편번호 검색창 나옴
    let daumPostCodeSearch = () => {
        new window.daum.Postcode({
            oncomplete: function(data) {
                let address = data.roadAddress || data.jibunAddress;

                setZipcode(data.zonecode);
                setAddr(address);

                //setJoinData에서 zipcode, addr 한꺼번에 관리하기 위해 추가로 셋팅.
                setJoinData((prev)=>{
                    return {
                        ...prev,
                        zipcode: data.zonecode,
                        addr: address
                    }
                });

            }
        }).open();
    };
    // end ----------------------------------------------


    // 비밀번호를 찾기위해 데이터가 성공적으로 조회되었는지를 저장할 상태
    let [pwFound, setPwFound] = useState(false);

    async function pwdCheck(event) {
        event.preventDefault();
    
        // 현재 로그인한 회원정보 가져오기
        try {
            const accessToken = sessionStorage.getItem("accessToken"); // 토큰 가져오기
    
            // 비동기 요청을 처리하기 위해 await 사용
            const response = await axios.post(
                "http://localhost:9988/member/pwdCheck",
                {
                    userId: joinData.user_id,
                    pw: joinData.pw
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );
    
            // 서버로부터 받은 응답 처리
            if (response.data === "pwdOk") {
                alert("비밀번호 확인 성공");
                setPwFound(true);  // 비밀번호 찾기 성공 상태로 변경
            } else {
                alert("비밀번호 확인 실패");
            }
    
        } catch (error) {
            console.error("비밀번호 정보 찾기 실패", error);
            alert("비밀번호 확인 중 오류가 발생했습니다.");
        }
    }


    //회원수정 버튼 클릭시 호출
    function formCheck(event){
        event.preventDefault();

        // 이메일 존재유무 확인
        if(joinData.email==null || joinData.email==""){
            alert('이메일을 입력하세요.');
            document.querySelector('input[name="email"]').focus();
            return false;
        }

        // 연락처에 빈칸이거나 숫자가 아닌 값이 들어가면 확인
        if (tel1 === "" || tel2 === "" || tel3 === "") {
            alert('연락처를 모두 입력해주세요.');
            document.querySelector('input[name="tel1"]').focus();
            return false;
        }
        if (!/^\d+$/.test(tel1) || !/^\d+$/.test(tel2) || !/^\d+$/.test(tel3)) {
            alert('연락처는 숫자만 입력 가능합니다.');
            document.querySelector('input[name="tel1"]').focus();
            return false;
        }

        // 주소 존재유무 확인
        if(joinData.zipcode==null || joinData.zipcode=="" || joinData.addr==null || joinData.addr==""){
            alert('주소를 입력하세요');
            document.querySelector('input[name="zipcode"]').focus();
            return false;
        }

        //비동기식으로 회원수정 요청
        const accessToken = sessionStorage.getItem("accessToken");
        const response = axios.post(
            "http://localhost:9988/member/joinEditOk",
            {
                userId: joinData.user_id,
                name: joinData.user_name,
                birth: joinData.birth,
                email: joinData.email,
                tel: tel1+'-'+tel2+'-'+tel3,
                postalCode: joinData.zipcode,
                addr: joinData.addr},
            {
                headers: {
                        Authorization: `Bearer ${accessToken}`
                }
        }).then(function(response){
            if (response.data === "ok") {
                alert("회원정보 수정 성공. 메인페이지로 이동합니다.");
                window.location.href = "/";
            } else {
                alert("회원정보 수정 실패");
            }
        }).catch(error => {
            console.error("회원정보 수정 중 에러 발생:", error);
            alert("회원정보 수정 실패. 다시 시도해 주세요.");
        });
    }

    async function getJoinEdit(){
        //현재 로그인한 회원정보 가져오기
        try{
            const accessToken = sessionStorage.getItem("accessToken"); // 토큰 가져오기

            const response = await axios.post(
                "http://localhost:9988/member/joinEdit",
                {},
                {
                    headers: {
                            Authorization: `Bearer ${accessToken}`
                    }
            });

            console.log(response.data);

            setJoinData({
                user_id: response.data.userId,
                user_name: response.data.name,
                email: response.data.email,
                tel: response.data.tel,
                zipcode: response.data.postalCode,
                addr: response.data.addr,
                birth: response.data.birth
            });

            //생년월일 나눠서 셋팅
            const birthParts = response.data.birth.split('.');
            setYear(birthParts[0]);
            setMonth(birthParts[1]);
            setDay(birthParts[2]);

            //전화번호 tel1, tel2, tel3로 나눠서 셋팅
            const telParts = response.data.tel.split('-');
            //전화번호 길이에 따라 처리
            if (telParts[0].length === 3) { //전화번호가 031, 010 등으로 시작할 때
                setTel1(telParts[0]);
                setTel2(telParts[1]);
                setTel3(telParts[2]);
            } else if (telParts[0].length === 2) { //전화번호가 02로 시작할 때
                setTel1(telParts[0]);
                setTel2(telParts[1]);
                setTel3(telParts[2]);
            }
        }catch(error){
            console.error("회원정보수정 페이지에서 데이터 가져오기 실패", error);
        }
    }

    return (
        !pwFound ? (
            <>
                <form onSubmit={pwdCheck} className='joinEdit-pwFind'>
                    <h2 style={{textAlign:'center', fontWeight:'600', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'}}>비밀번호 <span style={{color:'#3e9ca7'}}>확인</span></h2>
                    <div className="pw-find-input">
                        <label htmlFor="pw">비밀번호</label><br/>
                        <input type="password" id="pw" name="pw" className="joinEdit-pw-style" value={joinData.pw} onChange={setFormData} placeholder='비밀번호를 입력하세요.'/>
                    </div>
                    <input type="submit" value="비밀번호 확인" className='join-btn'/>
                </form>
            </>
        ) : (
            <>
                <div className='join-edit-form container'>
                    <form onSubmit={formCheck}>
                        <h3 className='edit-form-title mb-4 d-none d-md-block'>회원정보수정</h3>
                        <div className='edit-form-inner'>
                            <div className='join-form-line'>
                                <div className='join-title'>아이디</div>
                                <div className='join-input-box'>
                                    <input type="text" name="user_id" value={joinData.user_id} className='text-box' readOnly/>
                                </div>
                                <div id='alert-id' className='alert-text'></div>
                            </div>
                            <div className='join-form-line'>
                                <div className='join-title'>이름</div>
                                <div className='join-input-box'>
                                    <input type="text" name="user_name" value={joinData.user_name} className='text-box' minLength={2} readOnly/>
                                </div>
                                <div id='alert-username' className='alert-text'></div>
                            </div>
                            <div className='join-form-line'>
                                <div className='join-title'>생년월일</div>
                                <div className='join-input-box'>
                                    <input type="text" value={`${year}년`} className='text-box birth' readOnly/>
                                    <input type="text" value={`${month}월`} className='text-box birth' readOnly/>
                                    <input type="text" value={`${day}일`} className='text-box birth' readOnly/>
                                </div>
                            </div>
                            <div className='join-form-line'>
                                <div className='join-title'>이메일</div>
                                <div className='join-input-box'>
                                    <input type="email" name="email" value={joinData.email} className='text-box' onChange={setFormData}/>
                                </div>
                                <div id='alert-email' className='alert-text'></div>
                            </div>
                            <div className='join-form-line'>
                                <div className='join-title'>연락처</div>
                                <div className='join-input-box'>
                                    <input type="text" name="tel1" value={tel1} className='text-box tel' minLength={2} maxLength={3} onChange={(event)=>handleTelChange('tel1',event.target.value)}/>
                                    -<input type="text" name="tel2" value={tel2} className='text-box tel' minLength={3} maxLength={4} onChange={(event)=>handleTelChange('tel2',event.target.value)}/>
                                    -<input type="text" name="tel3" value={tel3} className='text-box tel' maxLength={4} minLength={4} onChange={(event)=>handleTelChange('tel3',event.target.value)}/>
                                    <div id='alert-tel' className='alert-text'></div>
                                </div>
                            </div>
                            <div className='join-form-line addr-zipcode'>
                                <div className='join-title'>주소</div>
                                <div className='join-input-box'>
                                    <input type="text" name="zipcode" value={joinData.zipcode} className='text-box zipcode' onChange={setFormData} readOnly/>
                                </div>
                                <br/>
                                <div id='alert-zipcode' className='alert-text'></div>
                            </div>
                            <input type="button" value="우편번호" className='text-box zipcode-btn' onClick={daumPostCodeSearch}/>
                            <div className='join-form-line'>
                                <div className='join-title'></div>
                                <div className='join-input-box'>
                                    <input type="text" name="addr" value={joinData.addr} className='addr-input' onChange={setFormData} readOnly/>
                                </div>
                            </div>
                            <div>
                                <input type="submit" value="회원정보수정" className='join-btn'/>
                            </div>
                            
                        </div>
                    </form>
                    <a href="/userDel" className='user-del-btn'>회원탈퇴</a>
                </div>
            </>
        )
    );
}

export default JoinEdit;