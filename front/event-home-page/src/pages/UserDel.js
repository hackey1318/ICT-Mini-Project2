import axios from 'axios';
import { useState } from 'react';
import '../css/userDel.css';
import arrow from '../img/arrow.png';

function UserDel() {
    const [selectReason, setSelectReason] = useState('');
    const [writeReason, setWriteReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('accessToken'));
    const [userRole, setUserRole] = useState();

    const handleReasonChange = (e) => {
        setSelectReason(e.target.value);
        if (e.target.value !== "기타(직접 입력)") {
            setWriteReason('');
        }
    };

    const handleWriteReasonChange = (e) => {
        setWriteReason(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectReason) {
            alert("탈퇴 이유를 선택해주세요.");
            return;
        }
        if (selectReason==="기타(직접 입력)" && (writeReason==null || writeReason.trim() === "")) {
            alert("탈퇴 이유를 작성해주세요.");
            return;
        }

        const finalReason = selectReason === "기타(직접 입력)" ? writeReason : selectReason;

        const confirmDelete = window.confirm("정말로 회원탈퇴를 하시겠습니까?");
        if (!confirmDelete) return;

        try {
            setIsSubmitting(true);
            const accessToken = sessionStorage.getItem("accessToken");
            const response = await axios.post(
                "http://127.0.0.1:9988/member/userDelOk",
                { content: finalReason },
                {
                    headers: {
                            Authorization: `Bearer ${accessToken}`
                    }
                }
            ).then(function(response){
                console.log(response.data);
                alert("회원탈퇴가 완료되었습니다. 메인페이지로 이동합니다.");
                handleLogout(); //세션에서 토큰 삭제.
                window.location.href = "/";
            }).catch(function(error){
                console.log(error);
            });
        } catch (error) {
            alert("회원탈퇴 중 오류가 발생했습니다.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    //세션에 있는 토큰 삭제.
    const handleLogout = () => {
        sessionStorage.removeItem('accessToken');
        setIsLoggedIn(false);
        setUserRole(null);
    };

    return (
        <div className="wrap">
            <div className="user-del-form">
                <button onClick={() => window.history.back()} style={{fontSize:'20px', position:'absolute', top:'15px', left:'15px', background:'none', border:'none', cursor:'pointer', transition:'background-color 0.3s ease'}}>
                    <img src={arrow} alt="Back Arrow" style={{width: '20px', height:'20px', objectFit:'contain'}} />
                </button>
                <form onSubmit={handleSubmit}>
                    <h2 className='del-form-title'>회원탈퇴</h2>
                    <div className='del-select-content'>
                        <p>
                            회원 탈퇴시 계정은 즉시 삭제되며 복구되지 않습니다.<br/>
                            탈퇴 이유를 알려주시면 향후 서비스 개선에 도움이 됩니다.<br/>
                            소중한 의견 부탁드립니다.
                        </p>
                        탈퇴 이유 :<br/>
                        <select value={selectReason} className='select-reason' onChange={handleReasonChange}>
                            <option value="" disabled>탈퇴 이유를 선택해주세요.</option>
                            <option value="사이트를 이용하지 않아서">사이트를 이용하지 않아서</option>
                            <option value="서비스에 만족하지 않아서">서비스에 만족하지 않아서</option>
                            <option value="다른 사이트가 더 좋아서">다른 사이트가 더 좋아서</option>
                            <option value="자주 발생하는 오류나 문제로 인한 불만">자주 발생하는 오류나 문제로 인한 불만</option>
                            <option value="개인정보 보호 우려">개인정보 보호 우려</option>
                            <option value="기타(직접 입력)">기타(직접 입력)</option>
                        </select><br/>
                        <textarea type="text" className="textarea-reason" onChange={handleWriteReasonChange} placeholder="탈퇴 이유를 200자 이내로 작성해주세요."
                            readOnly={selectReason !== "기타(직접 입력)"}
                            value={writeReason} maxLength={200}
                            style={{backgroundColor: selectReason !== "기타(직접 입력)" ? '#ddd' : 'white'}}>
                        </textarea>
                        <input type="submit" value="회원탈퇴" className='del-btn'/>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserDel;
