import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ErrorModal from "../common/ErrorModal";

const accessToken = sessionStorage.getItem("accessToken"); 

function Announce() {

    let [announceData, setAnnounceData] = useState([]);
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(true)


    const mounted = useRef(false);
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
        } else {
            getAnnounce();
        }
    }, []);

    function getAnnounce() {

        axios.get("http://localhost:9988/announce",{
            headers: {
                Authorization: `Bearer ${accessToken}` // 헤더에 토큰 추가
            }
        }).then(function(res) {
            setAnnounceData([])
            res.data.map(function (record) {
                setAnnounceData(prev => {
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
    
    return(
        <div>
            <h3 className="mb-4 d-none d-md-block">공지 목록</h3>
            <ErrorModal show={showError} onClose={() => setShowError(false)} />

            <div style={{ display: "flex" }}>
                <div className="right" style={{ flex: 1, padding: "30px" }}>
                    <div className="row" style={{ borderBottom: 'solid #ddd 2px' }}>
                        <div className="col-sm-1 p-2">no</div>
                        <div className="col-sm-3 p-2">제목</div>
                        <div className="col-sm-6 p-2">내용</div>
                        <div className="col-sm-2 p-2">생성일</div>
                    </div>
                
                { announceData.length > 0 ? 
                    (announceData.map(function (record) {
                        return (
                            <div className="row" style={{ borderBottom: 'solid #ddd 2px' }}>
                                <div className="col-sm-1 p-2">{record.no}</div>
                                <div className="col-sm-3 p-2">{record.title}</div>
                                <div className="col-sm-6 p-2">{record.content}</div>
                                <div className="col-sm-2 p-2">{record.createAt}</div>
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
                <button className="btn btn-outline-primary btn rounded-pill px-3">공지 등록</button>
            </div>
        </div>
    );
}

export default Announce;