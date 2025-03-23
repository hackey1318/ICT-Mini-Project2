import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ErrorModal from "../common/ErrorModal";
import RegisterAnnounce from "./RegisterAnnounce";
import AnnouncementDetail from "./AnnounceDetail";
import apiClient from './../../js/axiosConfig';

const accessToken = sessionStorage.getItem("accessToken"); 

function Announce() {

    const [showModal, setShowModal] = useState(false)
    const [DetailModal, setDetailModal] = useState(false)
    const [DetailNo, setDetailNo] = useState(null)
    const [announcements, setAnnouncements] = useState(null)
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(true)


    const mounted = useRef(false);
    useEffect(() => {
        if (!mounted.current) {
            getAnnounce();
            mounted.current = true;
        }
    }, []);

    const handleAddAnnouncement = (newAnnouncement) => {
            setAnnouncements([
            ...announcements, newAnnouncement])
        setShowModal(false)
    }

    function generateDateFormat(date) {
        const dateInfo = new Date(date);
        const formattedDate = dateInfo.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
        return formattedDate
    }

    function getAnnounce() {

        apiClient.get("/announce").then(function(res) {
            setAnnouncements([])
            res.data.map(function (record) {
                setAnnouncements(prev => {
                    return [...prev, {
                        no: record.id,
                        title: record.title,
                        content: record.content,
                        status: record.status,
                        createdAt: record.createdAt
                    }]
                });
            });
            setLoading(false)
        }).catch(function(err) {
            console.log(err)
            if (err.status === 403) {
                sessionStorage.removeItem("accessToken");
                setShowError(true);
            }
        }) 
    }
    if (loading) {
        return <div className="text-center py-5">로딩 중...</div>
    }

    const handleAnnounceDetail = (announcementNo) => {
        setDetailNo(announcementNo)
        setDetailModal(true);
    };

    const handleCloseDetail = () => {
        setDetailModal(false);
        setDetailNo(null); // 모달 닫을 때 선택된 공지의 번호 초기화
    };

    const handleRegisterAnnounce = () => {
        setShowModal(false)
        getAnnounce()
    }
    
    return(
        <div>
            <h3 className="mb-4 d-none d-md-block">공지 목록</h3>
            <ErrorModal show={showError} onClose={() => setShowError(false)} />
			<div className="admin-container">
                <div style={{ display: "flex" }}>
                <div className="admin-content">
                    <div className="admin-table-header" style={{ gridTemplateColumns: "1fr 2fr 3fr 2fr" }}>
                            <div>no</div>
                            <div>제목</div>
                            <div>내용</div>
                            <div>생성일</div>
                        </div>

                    { announcements.length > 0 ?
                        (announcements.map(function (record) {
                            return (
                                <div onClick={() => handleAnnounceDetail(record.no)} className="admin-table-row" style={{cursor: 'pointer', gridTemplateColumns: "1fr 2fr 3fr 2fr" }}>
                                    <div>{record.no}</div>
                                    <div>{record.title}</div>
                                    <div>{record.content}</div>
                                    <div>{generateDateFormat(record.createdAt)}</div>
                                </div>
                            )
                        })) : ( <div className="row" style={{ borderBottom: 'solid #ddd 2px' }}>
                                    <div style={{textAlign: "center"}} className="col-sm-11 p-2">등록된 공지가 없습니다</div>
                                </div>
                        )
                    }
                    </div>
                </div>
                <div className="text-center mt-2">
                    <button onClick={() => setShowModal(true)} className="btn btn-outline-primary btn rounded-pill px-3">공지 등록</button>
                </div>
                {showModal && (
                    <RegisterAnnounce show={showModal} onClose={() => handleRegisterAnnounce()} onSave={handleAddAnnouncement} />
                )}
                {DetailModal && DetailNo && (
                    <AnnouncementDetail announcementNo={DetailNo} accessToken={accessToken} onClose={handleCloseDetail}/>
                )}
            </div>
        </div>
    );
}

export default Announce;