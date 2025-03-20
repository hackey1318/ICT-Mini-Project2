import axios from 'axios';
import { useState } from 'react';
import '../css/userDel.css';

function UserDel() {
    const [selectReason, setSelectReason] = useState('');
    const [writeReason, setWriteReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        const finalReason = selectReason === "기타(직접 입력)" ? writeReason : selectReason;
        
        if (!finalReason) {
            alert("탈퇴 사유를 선택해주세요.");
            return;
        }

        const confirmDelete = window.confirm("정말로 회원탈퇴를 하시겠습니까?");
        if (!confirmDelete) return;

        try {
            setIsSubmitting(true);
            alert("finalReason="+finalReason);
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
                alert("회원탈퇴가 완료되었습니다. 메인페이지로 갑니다.");
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

    return (
        <div className="wrap">
            <div className="user-del-form">
                <form onSubmit={handleSubmit}>
                    <h2 className='del-form-title'>회원탈퇴</h2>
                    <div>
                        탈퇴 이유<br />
                        <select value={selectReason} onChange={handleReasonChange}>
                            <option value="" disabled>탈퇴 이유를 선택해주세요.</option>
                            <option value="사이트를 이용하지 않아서">사이트를 이용하지 않아서</option>
                            <option value="서비스에 만족하지 않아서">서비스에 만족하지 않아서</option>
                            <option value="다른 사이트가 더 좋아서">다른 사이트가 더 좋아서</option>
                            <option value="자주 발생하는 오류나 문제로 인한 불만">자주 발생하는 오류나 문제로 인한 불만</option>
                            <option value="개인정보 보호 우려">개인정보 보호 우려</option>
                            <option value="기타(직접 입력)">기타(직접 입력)</option>
                        </select><br/>
                        
                        {/* 기타(직접 입력) 선택시 입력 가능 */}
                        <input type="text" className="del-reason" onChange={handleWriteReasonChange} placeholder="탈퇴사유를 작성해주세요"
                            readOnly={selectReason !== "기타(직접 입력)"}
                            value={writeReason}
                            style={{backgroundColor: selectReason !== "기타(직접 입력)" ? '#ddd' : 'white'}}/>
                    </div>
                    <input type="submit" value="회원탈퇴"/>
                </form>
            </div>
        </div>
    );
}

export default UserDel;
