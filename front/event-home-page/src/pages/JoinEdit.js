import { useEffect, useRef, useState } from 'react';
import '../css/Join.css';
import axios from 'axios';

function JoinEdit(){
    //회원정보를 보관할 변수
    let [joinData, setJoinData] = useState({
        user_id: '',
        user_pw: '',
        pw_check: '',
        user_name: '',
        email: '',
        tel: '',
        zipcode: '',
        addr: '',
        /*
        birth: '',*/
    });

    //생년월일을 보관할 변수
    let [year, setYear] = useState('');
    let [month, setMonth] = useState('');
    let [day, setDay] = useState('');

    //연락처를 보관할 변수
    let [tel1, setTel1] = useState('');
    let [tel2, setTel2] = useState('');
    let [tel3, setTel3] = useState('');

    //우편번호, 주소 보관할 변수
    let [zipcode, setZipcode] = useState('');
    let [addr, setAddr] = useState('');

    //회원정보 불러오기
    const mounted = useRef(false);
    useEffect(()=>{
        if(!mounted.current){
            mounted.current = true;
        }else{
            getJoinEdit();
        }
    },[]);

    //생년월일
    let today = new Date();
    let current_year = today.getFullYear();
    //console.log(current_year);

    let BIRTHDAY_YEAR_LIST = Array.from(
        { length: 100 },
        (_, i) => `${current_year - i}년`,
    );
    let BIRTHDAY_MONTH_LIST = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);
    let BIRTHDAY_DAY_LIST = Array.from({ length: 31 }, (_, i) => `${i + 1}일`);

    //사용자가 입력하는 값을 셋팅
    function setFormData(event){
        let name = event.target.name;
        let value = event.target.value;

        setJoinData(prev=>{
            return {...prev, [name]:value}
        });
        console.log(joinData);
    }

    //생년월일 값 셋팅
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

    // 생년월일이 모두 입력되었을 때 생년월일을 joinData에 반영
    useEffect(() => {
        if (year && month && day) {
            let formattedBirthday = `${year.replace('년', '')}${month.replace('월', '').padStart(2, '0')}${day.replace('일', '').padStart(2, '0')}`;
            //console.log("생년월일=" + formattedBirthday);
            setJoinData(prev => ({
                ...prev,
                birth: formattedBirthday
            }));
        }
    }, [year, month, day]);  // year, month, day 값이 변경될 때마다 실행됨

    //연락처 셋팅
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
    useEffect(() => {
        if (tel1 && tel2 && tel3) {
            let formattedTel = `${tel1}${tel2}${tel3}`;
            console.log(formattedTel);
            setJoinData(prev => ({
                ...prev, 
                tel: formattedTel
            }));
        }
    }, [tel1, tel2, tel3]);

    //우편번호버튼 클릭시 우편번호 검색창 나옴
    let daumPostCodeSearch = () => {
        new window.daum.Postcode({
            oncomplete: function(data) {
                let address = data.roadAddress || data.jibunAddress;

                setZipcode(data.zonecode);
                setAddr(address);
            }
        }).open();
    };
    useEffect(() => {
        if (zipcode && addr) {
            setJoinData((prev) => ({
                ...prev,
                zipcode: zipcode,
                addr: addr
            }));
        }
    }, [zipcode, addr]);

    
    //회원가입 폼에 입력값이 바뀔때 유효성검사
    function handleBlur(event){
        //기본이벤트 제거
        event.preventDefault();

        let alert_id = document.getElementById("alert-id");
        let alert_pw = document.getElementById("alert-pw");
        let alert_pwChk = document.getElementById("alert-pw-check");
        let alert_username = document.getElementById("alert-username");
        let alert_birth = document.getElementById("alert-birth");
        let alert_email = document.getElementById("alert-email");
        let alert_tel = document.getElementById("alert-tel");
        let alert_zipcode = document.getElementById("alert-zipcode");

        let id_ok = 0;
        let pw_ok = 0;
        let pwChk_ok = 0;
        let username_ok = 0;
        let birth_ok = 0;
        let email_ok = 0;
        let tel_ok = 0;
        let zipcode_ok = 0;
    
        //유효성 검사
        let regex_id = /^[a-z0-9]{5,10}$/;
        if(joinData.user_id==null || !regex_id.test(joinData.user_id)){
            alert_id.innerHTML = "5~10자 영어소문자, 숫자 가능";
            id_ok = 0;
        }else{
            alert_id.innerHTML = "ok";
            id_ok = 1; 
        }

        let regex_pw = /^[A-Za-z0-9!@#$%]{7,10}$/;
        if(joinData.user_pw == null || !regex_pw.test(joinData.user_pw)){
            alert_pw.innerHTML = "7~10자 영어대소문자, 숫자, 특수문자 !@#$% 가능";
            pw_ok = 0;
        }else if(joinData.user_pw != null || regex_pw.test(joinData.user_pw)){
            alert_pw.innerHTML = "ok";
            pw_ok = 1;
        }
        
        let regex_username = /^[A-Za-z가-힣]{2,20}$/;
        if(joinData.user_name == null || joinData.user_name == '' || !regex_username.test(joinData.user_name)){
            alert_username.innerHTML = "이름을 입력하세요.";
            username_ok = 0;

        }else{
            alert_username.innerHTML = "ok";
            username_ok = 1;
        }

        let regex_email = /^[A-Za-z0-9._-]{2,10}@[A-Za-z0-9.-]{2,10}\.[A-Za-z]{2,3}$/;
        if(joinData.email==null || joinData.email==''){
            alert_email.innerHTML = "이메일을 입력하세요.";
            email_ok = 0;
        }else if(!regex_email.test(joinData.email)){
            alert("!!!!!");
            alert_email.innerHTML = "이메일 형식에 맞지 않습니다.";
            email_ok = 0;
        }else{
            alert_email.innerHTML = "ok";
            email_ok = 1;
        }

        let regex_tel1 = /^0[1-9]{1}[0-9]{1,2}$/;
        let regex_tel2 = /^[1-9]{3,4}$/;
        let regex_tel3 = /^[0-9]{4}$/;
        if((tel1 == null || tel2 == null || tel3 == null) || !(tel1.length == 3 || (tel2.length == 3 || tel2.length == 4) || tel3.length ==4)){
            alert_tel.innerHTML = "전화번호를 입력하세요.";
            tel_ok = 0;
        }else if(!regex_tel1.test(tel1) || !regex_tel2.test(tel2) || !regex_tel3.test(tel3)){
            alert_tel.innerHTML = "전화번호 형식이 올바르지 않습니다.";
            tel_ok = 0;
        }else{
            alert_tel.innerHTML = "ok";
            tel_ok = 1;
        }

        if(joinData.zipcode == null || joinData.zipcode == ''){
            alert_zipcode.innerHTML = "우편번호를 검색하세요.";
            zipcode_ok = 0;
        }else{
            alert_zipcode.innerHTML = "ok";
            zipcode_ok = 1;
        }

        /*
        if((id_ok+pw_ok+pwChk_ok+username_ok+birth_ok+email_ok+tel_ok+zipcode_ok)==8){
            alert("회원가입 성공!");
        }
        */
    }

    //회원수정 버튼 클릭시 호출
    function formCheck(event){
        event.preventDefault();

        let isValid = true;

        // 각 입력 필드 유효성 검사
        const fields = ['user_id', 'user_pw', 'pw_check', 'user_name', 'email', 'tel', 'zipcode'];
        fields.forEach((field) => {
            const alertElement = document.getElementById(`alert-${field}`);
            if (alertElement && alertElement.innerHTML !== "ok") {
                isValid = false;
            }
        });

        if (isValid) {
            alert("회원수정 성공!");
        } else {
            alert("입력값을 다시 확인해주세요.");
        }

        //비동기식으로 서버 요청
        axios.post("http://127.0.0.1:9988/member/joinEditOk",
            {
                userId: "admin",
                /*pw: joinData.user_pw,*/
                name: joinData.user_name,
                birth: joinData.birth,
                email: joinData.email,
                tel: joinData.tel,
                postalCode: joinData.zipcode,
                addr: joinData.addr
            }
        ).then(function(response){
            console.log(response);
            console.log(response.data);
            
            if(response.data==='pwdFail'){ 
                alert("비밀번호를 잘못 입력하였습니다.");
            }else if(response.data==="updateFail"){
                alert("회원정보 수정 실패");
            }else if(response.data==="updateOk"){
                alert("회원정보 수정 성공");
            }else{
                alert("잘못 처리됨");
            }
        }).catch(function(error){
            console.log(error);
        });
    }

    function getJoinEdit(){
        //현재 로그인한 회원정보 가져오기
        //                                                 ??세션말고 토큰값 가져오기??
        axios.post("http://localhost:9988/member/joinEdit", {/*userid : sessionStorage.getItem("logId")*/userId:"qqqq1111"})
        .then(function(response){
            console.log(response.data);

            setJoinData({
                user_id: response.data.userId,
                user_pw: response.data.pw,
                user_name: response.data.name,
                email: response.data.email,
                tel: response.data.tel,
                zipcode: response.data.postalCode,
                addr: response.data.addr,
                birth: response.data.birth
            });
            
            //전화번호 나눠서 셋팅
            setTel1(response.data.tel.substring(0,3));
            setTel2(response.data.tel.substring(3,7));
            setTel3(response.data.tel.substring(7,11));

            //생년월일 나눠서 셋팅
            setYear(response.data.birth.substring(0,4));
            setMonth(response.data.birth.substring(4,6));
            setDay(response.data.birth.substring(6,8));
        }).catch(function(error){
            console.log(error);
        })
    }

    return(
        <div id='wrap'>
            <div className='join-form'>
                <form onSubmit={formCheck}>
                    <h2 id="join-form-title">회원정보수정</h2>
                    <div className='join-form-inner'>
                        <div className='join-form-line'>
                            <div className='join-title'>아이디</div><div className='join-input-box'><input type="text" name="user_id" value={joinData.user_id} className='text-box' onChange={setFormData} onBlur={handleBlur} readOnly/></div>
                            <div id='alert-id' className='alert-text'></div>
                        </div>
                        {/*
                        <div className='join-form-line'>
                            <div className='join-title'>비밀번호</div><div className='join-input-box'><input type="password" name="user_pw" className='text-box' onChange={setFormData} onBlur={handleBlur}/></div>
                            <div id='alert-pw' className='alert-text'></div>
                        </div>
                        */}
                        <div className='join-form-line'>
                            <div className='join-title'>이름</div><div className='join-input-box'><input type="text" name="user_name" value={joinData.user_name} className='text-box' onChange={setFormData} onBlur={handleBlur} minLength={2} readOnly/></div>
                            <div id='alert-username' className='alert-text'></div>
                        </div>
                        <div className='join-form-line'>
                            <div className='join-title'>생년월일</div>
                            <div className='join-input-box'>
                                <input type="text" value={`${year}년`} className='text-box tel' readOnly/>
                                <input type="text" value={`${month}월`} className='text-box tel' readOnly/>
                                <input type="text" value={`${day}일`} className='text-box tel' readOnly/>
                            </div>
                        </div>
                        <div className='join-form-line'>
                            <div className='join-title'>이메일</div><div className='join-input-box'><input type="email" name="email" value={joinData.email} className='text-box' onChange={setFormData} onBlur={handleBlur}/></div>
                            <div id='alert-email' className='alert-text'></div>
                        </div>
                        <div className='join-form-line'>
                            <div className='join-title'>연락처</div>
                            <div className='join-input-box'>
                                <input type="text" name="tel1" value={tel1} className='text-box tel' onChange={(event)=>handleTelChange('tel1',event.target.value)} maxLength={3}/>
                                -<input type="text" name="tel2" value={tel2} className='text-box tel' onChange={(event)=>handleTelChange('tel2',event.target.value)} maxLength={4}/>
                                -<input type="text" name="tel3" value={tel3} className='text-box tel' onChange={(event)=>handleTelChange('tel3',event.target.value)} maxLength={4}/>
                                <div id='alert-tel' className='alert-text'></div>
                            </div>
                        </div>
                        <div className='join-form-line addr-zipcode'>
                            <div className='join-title'>주소</div><div className='join-input-box'><input type="text" name="zipcode" value={joinData.zipcode} className='text-box zipcode' onChange={setFormData} onBlur={handleBlur} readOnly/></div>
                            <br/><div id='alert-zipcode' className='alert-text'></div>
                        </div>
                        <input type="button" value="우편번호" className='text-box zipcode-btn' onClick={daumPostCodeSearch}/>
                        <div className='join-form-line'>
                            <div className='join-title'></div>
                            <div className='join-input-box'><input type="text" name="addr" value={joinData.addr} className='addr-input' onChange={setFormData} onBlur={handleBlur} readOnly/></div>
                        </div>
                        <div>
                            <input type="submit" value="회원정보수정" className='join-btn'/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default JoinEdit;