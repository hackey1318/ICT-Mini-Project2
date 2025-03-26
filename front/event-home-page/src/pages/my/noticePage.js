import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { markNotificationAsRead } from "../../js/notification/notificationService";
import apiClient from "../../js/axiosConfig";

const formatDate = (dateTimeString) => dateTimeString?.split('T')[0] || '';

function NoticePage () {
    const navigate = useNavigate(); 
    const [noticeCount, setNoticeCount] = useState(0)
    const [noticeList, setNoticeList] = useState([])

    const [page, setPage] = useState(0); // 현재 페이지
    const [size, setSize] = useState(10); // 페이지 당 항목 수
    const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수

    const mounted = useRef(false);
    useEffect(() => {
        if (mounted.current) {
            mounted.current = true;
        } else {
            getNoticeList();
        }
    }, [page, size]);

    async function getNoticeList() {

        try {
            const response = await apiClient.get("/noti/ALL", {
                params: {
                    page: page,  // 페이지 번호
                    size: size   // 페이지 크기
                }
            });
            if (!response.data) {
                throw new Error("공지 목록을 불러오는데 실패했습니다.");
            }
            const data = response.data.content;
            const totalPages = response.data.totalPages;
            setTotalPages(totalPages);
            setNoticeList(data);
        } catch (error) {
            console.error("공지 목록 가져오기 실패:", error);
            if (error.response && error.response.status === 401) {
                // 토큰 만료 처리 (예: 로그인 페이지로 이동)
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                navigate('/login');
            } else {
                alert("공지 목록을 불러오는데 실패했습니다.");
            }
        }
    }

    async function handleMarkAsRead(notificationId) {
        await markNotificationAsRead(notificationId);
        getNoticeList(); // ✅ 읽음 처리 후 목록 다시 로딩
    }

    // 페이지 변경 처리
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };
    // 페이지 크기 변경 처리
    const handleSizeChange = (newSize) => {
        setSize(newSize);
        setPage(0); // 페이지 크기 변경 시 첫 번째 페이지로 이동
    };

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
            {/* 페이지네이션 버튼 */}
            {totalPages > 0 && (
                <>
                    <div className="d-flex justify-content-center align-items-center mt-4">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 0}
                            className="btn btn-dark me-2"
                        >
                            이전
                        </button>
                        <span>{totalPages > 0 ? `${page + 1} / ${totalPages}` : '0 / 0'}</span>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages - 1}
                            className="btn btn-dark ms-2"
                        >
                            다음
                        </button>
                    </div>
                    <div className="d-flex justify-content-center mt-3">
                        <select onChange={(e) => handleSizeChange(e.target.value)} value={size} className="form-select w-auto">
                            <option value={10}>10개씩</option>
                            <option value={20}>20개씩</option>
                            <option value={100}>100개씩</option>
                        </select>
                    </div>
                </>
            )}
        </div>
    );
}

export default NoticePage;
