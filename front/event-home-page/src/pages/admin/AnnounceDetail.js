import axios from "axios";
import { useEffect, useState } from "react";
import apiClient from "../../js/axiosConfig";

const generateDateFormat = (date) => {
    const d = new Date(date);
    return d.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function AnnouncementDetail({ announcementNo, accessToken, onClose }) {

    const [announcementInfo, setAnnouncementInfo] = useState(null); // 공지사항 상세 데이터
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 오류 상태

    useEffect(() => {
        const fetchAnnouncementDetail = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get(`/announce/${announcementNo}`);
                setAnnouncementInfo(response.data);
            } catch (err) {
                setError('공지사항을 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        if (announcementNo) {
            fetchAnnouncementDetail(announcementNo)
        }
    }, [announcementNo]);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    if (!announcementInfo) {
        return <div></div>;
    }

    return (
        <div className="modal-wrapper">
            <div className="modal show d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">공지 상세 정보</h5>
                            <button className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <p>
                                <strong>제목:</strong> {announcementInfo.title}
                            </p>
                            <p>
                                <strong>내용:</strong> {announcementInfo.content}
                            </p>
                            <p>
                                <strong>작성일:</strong> {generateDateFormat(announcementInfo.createdAt)}
                            </p>
                            <p>
                                <strong>상태:</strong> {announcementInfo.status}
                            </p>
                            <p>
                                <strong>공지 명단</strong>
                                <br/>
                                {announcementInfo.recipientList.length > 0 ? (
                                    <table className="table table-hover" style={{marginTop: '10px'}}>
                                        <thead>
                                            <tr style={{borderBottom: '1px solid #ddd'}}>
                                                <th>Email</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {announcementInfo.recipientList.map((record, index) => (
                                                <tr key={index} style={{borderBottom: '1px solid #ddd'}}>
                                                    <td>{record?.email}</td>
                                                    <td>{record?.status}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : null}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}