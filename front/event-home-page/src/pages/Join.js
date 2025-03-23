import { useRef, useState } from 'react';
import '../css/Join.css';
import arrow from '../img/arrow.png';

//생년월일 관련
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; 
import axios from 'axios';

function Join(){
    //회원정보를 보관할 변수
    let [joinData, setJoinData] = useState({
        user_id: '',
        user_pw: '',
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

    // start : 아이디 중복확인 -----------------------------
    const [idCheckMessage, setIdCheckMessage] = useState(''); //중복확인 메시지
    const [idChecked, setIdChecked] = useState(false); //아이디 중복확인 상태(중복확인 했으면 true, 안했으면 false)
    // end ------------------------------------------------

    //아이디 중복확인 함수
    const handleIdCheck = () => {
        console.log(joinData.user_id);
        
        if(idValid){
            //아이디가 비어있으면 중복확인 X
            if(joinData.user_id==null || joinData.user_id=="") return;

            //아이디 길이 검사 추가
            if (joinData.user_id.length < 5) {
                setIdCheckMessage('아이디는 최소 5자 이상이어야 합니다.');
                setIdChecked(false); // 중복확인 상태 초기화
                return;
            }
            
            axios.post("http://127.0.0.1:9988/member/checkId", {userId : joinData.user_id}).then(response =>{
                console.log(response.data); //중복이면 true, 중복이 아니면 false를 반환.
                const isExist = response.data; 
                if (isExist) {
                    setIdChecked(true); //아이디 중복확인을 했으면 true
                    setIdValid(false);
                    setIdCheckMessage('이미 사용 중인 아이디입니다.');
                } else {
                    setIdChecked(true); //아이디 중복확인을 했으면 true
                    setIdValid(true);
                    setIdCheckMessage('사용 가능한 아이디입니다.');
                }
            }).catch(error => {
                console.error("아이디 중복 확인 실패", error);
                setIdCheckMessage("아이디 중복 확인 실패. 다시 시도해주세요.");
            });
        }
    }
    // end ----------------------------------------------

    // start : 생년월일 관련 상태 추가 ---------------
    const [startDate, setStartDate] = useState(null); // 생년월일을 저장할 상태
    const handleDateChange = (date) => {
        setStartDate(date);
    
        // 선택된 날짜를 joinData에 업데이트
        if (date) {  // 날짜가 null이 아닐 때만 처리
            //월, 일을 두자리로 변경
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');  // 월은 0부터 시작하므로 1을 더함
            const day = String(date.getDate()).padStart(2, '0');  // 일도 두 자리로 포맷

            const birth = `${year}.${month}.${day}`;
            setJoinData(prevState => ({
                ...prevState,
                birth
            }));
        }
    };
    const dateInputRef = useRef(null);  // 생년월일 input에 대한 ref 추가 (생년월일을 적지않으면 포커스주기위해)
    // 생년월일 포커스를 설정하는 함수
    const focusDatePicker = () => {
        if (dateInputRef.current && dateInputRef.current.input) {
            dateInputRef.current.input.focus();
        }
    };
    // ----------------------------------------------

    // start : onChange할때마다 유효성 검사 ---------
    const [idValid, setIdValid] = useState(null);  // 아이디 유효성 상태
    const [pwValid, setPwValid] = useState(null);  // 비밀번호 유효성 상태
    const [pwCheckValid, setPwCheckValid] = useState(null); // 비밀번호 확인 상태
    const userIdRef = useRef(null); 
    const userPwRef = useRef(null);
    // end -----------------------------------------

    // start : 우편번호 관련 ---------------------------
    let [zipcode, setZipcode] = useState('');
    let [addr, setAddr] = useState('');

    let daumPostCodeSearch = () => { //우편번호버튼 클릭시 우편번호 검색창 나옴
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
    // end --------------------------------------------------

    function setFormData(event) {
        const { name, value } = event.target;

        // 아이디가 변경되면 중복확인 상태 초기화 ----------
        if (name === 'user_id') {
            setIdValid(false);  //중복확인 상태 초기화
            setIdChecked(false);
            setIdCheckMessage('');  //중복확인 메시지 초기화
            
        }
        // ----------------------------------------------

        // start : onChange할때마다 아이디와 비밀번호, 비밀번호 확인값 유효성 검사 ---------
        if (name === 'user_id') {
            let regId = /^[a-z0-9]{5,10}$/;
            if (value === '') {
                setIdValid(null);  // 아이디가 비어있으면 오류 메시지 숨김
            } else if (!regId.test(value)) {
                setIdValid(false);  // 유효성 검사 실패
            } else {
                setIdValid(true);  // 유효성 검사 성공
            }
        }else if (name === 'user_pw') {
            let regPw = /^[A-Za-z0-9!@#$%]{7,10}$/;
            setPwValid(value === '' ? null : regPw.test(value));
            // 비밀번호가 비어 있을 경우 pwCheckValid도 null로 설정
            if (value === '') {
                setPwCheckValid(null); // 비밀번호가 비어 있으면 확인값도 유효하지 않다고 처리
            } else if (joinData.pw_check !== '' && joinData.pw_check !== value) {
                // 비밀번호 확인값과 비밀번호가 다르면 false 처리
                setPwCheckValid(false);
            } else if (joinData.pw_check === value) {
                // 비밀번호 확인값과 비밀번호가 같으면 true 처리
                setPwCheckValid(true);
            }
        }else if (name === 'pw_check') {
            // 비밀번호와 확인값이 일치하면 true, 일치하지 않으면 false
            if (joinData.user_pw === '' || value === '') {
                setPwCheckValid(null); // 비밀번호나 확인값이 비어 있으면 OK가 안 뜨게 null로 설정
            } else {
                setPwCheckValid(value === joinData.user_pw ? true : false);
            }
        }else if (name === 'tel1' || name === 'tel2' || name === 'tel3') {
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
        // end -------------------------------------------------------------------------------

        setJoinData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    function formCheck(event){
        event.preventDefault();

        // 유효성 검사 추가 (OK 문구가 나와야만 진행 가능!)
        if (!idValid) {
            alert('아이디값이 유효하지 않습니다.');
            userIdRef.current.focus();
            return false;
        }
        if (!pwValid) {
            alert('비밀번호값이 유효하지 않습니다.');
            userPwRef.current.focus();
            return false;
        }
        if (!pwCheckValid) {
            alert('비밀번호 확인값이 비밀번호값과 일치하지 않습니다.');
            document.querySelector('input[name="pw_check"]').focus();
            return false;
        }

        // 이름 존재유무 확인
        if(joinData.user_name==null || joinData.user_name==""){
            alert('이름을 입력하세요.');
            document.querySelector('input[name="user_name"]').focus();
            return false;
        }

        // 생년월일 유효성 검사 추가
        if (joinData.birth === "") {
            alert('생년월일을 선택해주세요.');
            focusDatePicker();  // DatePicker에 포커스
            return false;
        }

        // 이메일 존재유무 확인
        if(joinData.email==null || joinData.email==""){
            alert('이메일을 입력하세요.');
            document.querySelector('input[name="email"]').focus();
            return false;
        }

        // 연락처에 빈칸이거나 숫자가 아닌 값이 들어가면 확인
        if (joinData.tel1 === "" || joinData.tel2 === "" || joinData.tel3 === "") {
            alert('연락처를 모두 입력해주세요.');
            document.querySelector('input[name="tel1"]').focus();
            return false;
        }
        if (!/^\d+$/.test(joinData.tel1) || !/^\d+$/.test(joinData.tel2) || !/^\d+$/.test(joinData.tel3)) {
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

        //아이디 중복확인 여부 확인
        if(idChecked==false){
            alert('아이디 중복확인을 해주세요');
            return false;
        }

        //비동기식으로 회원가입 요청
        axios.post("http://127.0.0.1:9988/member/joinFormOk",
            {
                userId: joinData.user_id,
                pw: joinData.user_pw,
                name: joinData.user_name,
                birth: joinData.birth,
                email: joinData.email,
                tel: joinData.tel,
                postalCode: joinData.zipcode,
                addr: joinData.addr
            }
        ).then(function(reponse){
            console.log(reponse.data);
            if(reponse.data === "ok"){
                alert("회원등록 성공! 로그인 페이지로 이동!");
                window.location.href = '/login';
            }else{
                alert("회원등록 실패!!");
            }
        }).catch(function(error){
            console.log(error);
        });
    }

    return(
        <div id='wrap'>
            <div className='join-form'>
                <button onClick={() => window.history.back()} style={{fontSize:'20px', position:'absolute', top:'15px', left:'15px', background:'none', border:'none', cursor:'pointer', transition:'background-color 0.3s ease'}}>
                    <img src={arrow} alt="Back Arrow" style={{width: '20px', height:'20px', objectFit:'contain'}} />
                </button>
                <form onSubmit={formCheck}>
                    <h2 id="join-form-title" style={{textShadow: "rgba(0, 0, 0, 0.2) 2px 2px 4px"}}>회원가입</h2>
                    <div className='join-form-inner'>
                        <div className='join-form-line'>
                            <div className='join-title'>아이디</div><div className='join-input-box'><input type="text" name="user_id" className='text-box' onChange={setFormData} ref={userIdRef} placeholder='5~10자의 영어소문자, 숫자 가능'/></div>
                            {idValid === false && !idChecked && (
                                <div id='alert-id' className='alert-text'>5~10자의 영어소문자, 숫자만 가능</div>
                            )}
                            {idValid === true && !idChecked && (
                                <div id='alert-id' className='alert-text' style={{ color: 'orange' }}>중복확인을 해주세요.</div>
                            )}
                            {idChecked ===true && idValid === false && (
                                <div id='alert-id' className='alert-text' style={{ color: 'red' }}>
                                    {idCheckMessage} {/* 아이디 중복인 경우 문구 출력 */}
                                </div>
                            )}
                            {idValid === true && idChecked &&(
                                <div id='alert-id' className='alert-text' style={{ color: 'green' }}>OK</div>
                            )}
                        </div>
                        <input type="button" value="중복확인" className='id-check' onClick={handleIdCheck}/>
                        <div className='join-form-line'>
                            <div className='join-title'>비밀번호</div><div className='join-input-box'><input type="password" name="user_pw" className='text-box pw-style' style={{fontFamily: "'Gowun Batang', sans-serif"}} onChange={setFormData} ref={userPwRef} placeholder='7~10자의 영문 대소문자, 숫자, !@#$% 가능'/></div>
                            {pwValid === false && (
                                <div className='alert-text' style={{ color: 'red' }}>7~10자의 영문 대소문자, 숫자, !@#$% 가능</div>
                            )}
                            {pwValid === true && (
                                <div className='alert-text' style={{ color: 'green' }}>OK</div>
                            )}
                        </div>
                        <div className='join-form-line'>
                            <div className='join-title'>비밀번호 확인</div><div className='join-input-box'><input type="password" name="pw_check" className='text-box pw-style' style={{fontFamily: "'Gowun Batang', sans-serif"}} onChange={setFormData} placeholder='비밀번호를 한 번 더 입력해주세요.'/></div>
                            {pwCheckValid === false && (
                                <div className='alert-text' style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</div>
                            )}
                            {pwCheckValid === true && (
                                <div className='alert-text' style={{ color: 'green' }}>OK</div>
                            )}
                        </div>
                        <div className='join-form-line'>
                            <div className='join-title'>이름</div><div className='join-input-box'><input type="text" name="user_name" className='text-box'  minLength={2} onChange={setFormData} placeholder='이름을 입력하세요.'/></div>
                        </div>
                        <div className='join-form-line'>
                            <div className='join-title'>생년월일</div>
                            <div className='join-input-box'>
                            <DatePicker
                                selected={startDate}
                                onChange={handleDateChange}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="생년월일을 선택하세요."
                                maxDate={new Date()} // 오늘 날짜 이후로는 선택 불가
                                className='text-box'
                                ref={dateInputRef}  // DatePicker input에 ref 추가
                                showYearDropdown // 년도 드롭다운 추가
                                yearDropdownItemNumber={100} // 선택할 수 있는 연도 범위 (예: 최근 100년)
                                scrollableYearDropdown // 스크롤 가능한 연도 드롭다운
                            />
                            </div>
                        </div>
                        <div className='join-form-line'>
                            <div className='join-title'>이메일</div><div className='join-input-box'><input type="email" name="email" className='text-box' onChange={setFormData} placeholder='example@naver.com'/></div>
                        </div>
                        <div className='join-form-line'>
                            <div className='join-title'>연락처</div>
                            <div className='join-input-box'>
                                <input type="text" name="tel1" className='text-box tel'  minLength={2} maxLength={3} onChange={setFormData} placeholder='010'/>
                                -<input type="text" name="tel2" className='text-box tel' minLength={3} maxLength={4} onChange={setFormData} placeholder='0000'/>
                                -<input type="text" name="tel3" className='text-box tel' maxLength={4} minLength={4} onChange={setFormData} placeholder='0000'/>
                            </div>
                        </div>
                        <div className='join-form-line addr-zipcode'>
                            <div className='join-title'>주소</div><div className='join-input-box'><input type="text" name="zipcode" value={zipcode} className='text-box zipcode' onChange={setFormData} readOnly/></div>
                        </div>
                        <input type="button" value="우편번호" className='zipcode-btn' onClick={daumPostCodeSearch}/>
                        <div className='join-form-line'>
                            <div className='join-title'></div>
                            <div className='join-input-box'><input type="text" name="addr" value={addr} className='addr-input' onChange={setFormData} placeholder='우편번호 버튼을 눌러 검색하세요.' readOnly/></div>
                        </div>
                        <div>
                            <input type="submit" value="회원가입" className='join-btn'/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Join;