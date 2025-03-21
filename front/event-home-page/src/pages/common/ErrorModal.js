import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ErrorModal({ show, onClose }) {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("🔍 ErrorModal 렌더링됨, show 상태:", show);
    }, [show]);

    if (!show) return null;

    return (
        <>
            {/* 모달 */}
            <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header d-flex justify-content-between w-100 border-0">
                            <h5 className="modal-title">오류 발생</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body border-0">
                            <p>로그인 정보가 만료되었습니다.<br/>다시 로그인해 주세요.</p>
                        </div>
                        <div className="modal-footer border-0">
                            <button type="button" className="btn btn-primary" onClick={() => navigate("/login")}>
                                로그인으로 이동
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => navigate("/")}>
                                닫기 (홈으로 이동)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 모달 오버레이 */}
            <div className="modal-backdrop fade show" onClick={onClose}></div>
        </>
    );
}

export default ErrorModal;