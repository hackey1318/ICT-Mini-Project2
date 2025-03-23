import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { markNotificationAsRead } from "../../js/notification/notificationService";
import apiClient from "../../js/axiosConfig";

const accessToken = sessionStorage.getItem("accessToken"); // 토큰 가져오기
const formatDate = (dateTimeString) => dateTimeString?.split('T')[0] || '';

function NoticePage () {
    const navigate = useNavigate(); 
    const [noticeList, setNoticeList] = useState([])

    const mounted = useRef(false);
    useEffect(() => {
        if (mounted.current) {
            mounted.current = true;
        } else {
            getNoticeList();
        }
    }, []);

    async function getNoticeList() {

        try {
            const response = await apiClient.get("/noti/ALL");
            setNoticeList(response.data);
        } catch (error) {
            console.error("댓글 목록 가져오기 실패:", error);
            if (error.response && error.response.status === 401) {
                // 토큰 만료 처리 (예: 로그인 페이지로 이동)
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                navigate('/login');
            } else {
                alert("댓글 목록을 불러오는데 실패했습니다.");
            }
        }
    }

    async function handleMarkAsRead(notificationId) {
        await markNotificationAsRead(notificationId);
        getNoticeList(); // ✅ 읽음 처리 후 목록 다시 로딩
    }


    return(
        <div className="container">
            <h3 className="mb-4 d-none d-md-block">받은 공지</h3>
            <div style={{ display: "flex" }}>
                <div className="right" style={{ flex: 1, padding: "30px" }}>
                    <div className="row" style={{ borderBottom: 'solid #ddd 2px' }}>
                        <div className="col-sm-1 p-2">no</div>
                        <div className="col-sm-9 p-2">공지 내용</div>
                        <div className="col-sm-2 p-2">작성 날짜</div>
                    </div>
                    {noticeList.map(function (record) {
                        return (
                            <div className="row" style={{ 
                                borderBottom: 'solid #ddd 2px',
                                opacity: record.status === 'READ' ? 0.5 : 1, 
                                pointerEvents: record.status === 'READ' ? 'none' : 'auto',
                                backgroundColor: record.status === 'READ' ? '#f8f9fa' : 'transparent', // 회색 배경
                                filter: record.status === 'READ' ? 'grayscale(100%)' : 'none', // 흑백 필터
                            }}  key={record.id} onClick={async () => handleMarkAsRead(record.id)}>
                                <div className="col-sm-1 p-2">{record.id}</div>
                                <div className="col-sm-9 p-2">{record.content}</div>
                                <div className="col-sm-2 p-2">{formatDate(record.createdAt)}</div>
                                {/* <div className="col-sm-2 p-2">
                                    <button className="btn btn-warning" style={{ margin: "1px" }} onClick={() => handleEdit(record.eventNo)}>수정</button>
                                    <button className="btn btn-danger" style={{ margin: "1px" }} onClick={() => handleDelete(record.no)}>삭제</button>
                                </div> */}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default NoticePage;
