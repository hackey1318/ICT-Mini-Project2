import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import './../../css/adminStyle.css';
import styled from 'styled-components';

const StyledLink = styled(Link)`
    text-decoration:none;
    &:link, &:visited, &:active{
    color:black;
    }
    &:hover{
        color:blue;
    }
`;
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: ${props => props.isOpen ? 'flex' : 'none'}; /* 모달 표시 여부 설정 */
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 70%;
    max-width: 800px;
`;

function CreateBanner() {
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchParams, setSearchParams] = useState({
        title: '',
        startDate: '',
        addr: '',
        areaCode: ''
    });

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    const handleSearchClickModal = async () => {
        console.log("검색어=>", searchParams);
        try {
            const response = await fetch('http://localhost:9988/banner/searchEvents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchParams),
            });

            if (response.ok) {
                const data = await response.json();
                setSearchResults(data.list);
            } else {
                console.error('행사 정보 검색 실패:', response.status);
                setSearchResults([]);
                alert('행사 정보 검색에 실패했습니다.');
            }
        } catch (error) {
            console.error('행사 정보 검색 오류:', error);
            setSearchResults([]);
            alert('행사 정보 검색 중 오류가 발생했습니다.');
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
        setSearchResults([]); // 모달 열 때 검색 결과 초기화
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSearchInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        setSearchParams({
            title: '',
            startDate: '',
            addr: '',
            areaCode: ''
        });
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(false);
    };

    return (
        <div className="container">
            <h1>관리자 페이지</h1>
            <div style={{ display: "flex" }}>
                <div className="left" style={{ backgroundColor: "#E7F0FF", width: "250px", height: "200px" }}>
                    <ul>
                        <li style={{ margin: "20px", fontSize: "20px" }}><StyledLink to="/admin/memberList">회원 정보 조회</StyledLink></li>
                        <li style={{ margin: "20px", fontSize: "20px" }}><StyledLink to="/admin/withdrawalList">회원 탈퇴 명단</StyledLink></li>
                        <li style={{ margin: "20px", fontSize: "20px" }}><StyledLink to="/admin/bannerList">배너관리</StyledLink></li>
                    </ul>
                </div>
                <div className="right" style={{ flex: 1, padding: "30px" }}>
                    <form onSubmit={''} className="BannerForm">
                        <ul>
                            <li style={{ margin: "10px" }}>행사 정보
                                <span style={{ marginLeft: "50px", marginRight: "50px" }}> | </span>
                                <input type="text" name="eventInfo" style={{ width: "350px" }} readOnly value={searchResults.length > 0 ? searchResults[0].title : ''}></input>
                                <button type="button" name="searchEvent" className="btn btn-primary" style={{ width: "60px", marginLeft: "10px" }} onClick={handleOpenModal}>검색</button>
                            </li>
                            <li style={{ margin: "10px" }}>배너 대표색
                                <span style={{ marginLeft: "34px", marginRight: "50px" }}> | </span>
                                <input type="text" name="bannerColor" placeholder="#" style={{ width: "350px" }}></input>
                            </li>
                            <li style={{ margin: "10px" }}>시작일
                                <span style={{ marginLeft: "72px", marginRight: "50px" }}> | </span>
                                <input type="text" name="startDate" placeholder="2025-05-01" style={{ width: "350px" }}></input>
                            </li>
                            <li style={{ margin: "10px" }}>종료일
                                <span style={{ marginLeft: "72px", marginRight: "50px" }}> | </span>
                                <input type="text" name="endDate" placeholder="2025-05-15" style={{ width: "350px" }}></input>
                            </li>
                            <li style={{ margin: "10px" }}>이미지
                                <span style={{ marginLeft: "72px", marginRight: "50px" }}> | </span>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                /></li>
                            {selectedImage && (
                                <div className="relative w-12 h-12 border rounded-md overflow-hidden">
                                    <img
                                        src={selectedImage || "/placeholder.svg"}
                                        alt="Selected"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </ul>
                        <div style={{ display: "flex", justifyContent: "flex-center" }}>
                            <button type="button" className="btn btn-primary" style={{ marginLeft: '10px' }}>등록</button>
                            <button type="reset" className="btn btn-warning" style={{ marginLeft: '10px' }}>취소</button>
                        </div>
                    </form>
                </div>

                <ModalOverlay isOpen={isModalOpen} onClick={handleCloseModal}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title" id="modalheadText">행사 검색</h4>
                                    <button type="button" className="btn-close" onClick={handleCloseModal} style={{ marginLeft: "auto" }}></button>
                                </div>
                                <div className="modal-body">
                                    <p id="modalbodyText">검색 조건을 입력해주세요.</p>
                                    <form id="eventSearchForm">
                                        <section>
                                            <div className="left">
                                                <ul>
                                                    <li>이벤트이름</li>
                                                    <li>시작 날짜</li>
                                                    <li>주소</li>
                                                    <li>지역코드</li>
                                                </ul>
                                            </div>
                                            <div className="right">
                                                <ul>
                                                    <li><input type="text" name="title" value={searchParams.title} onChange={handleSearchInputChange}
                                                        placeholder="잠실 벛꽃 축제" /></li>
                                                    <li><input type="text" name="startDate" value={searchParams.startDate} onChange={handleSearchInputChange}
                                                        placeholder="2025-04-01" /></li>
                                                    <li><input type="text" name="addr" value={searchParams.addr} onChange={handleSearchInputChange}
                                                        placeholder="서울시" /></li>
                                                    <li><input type="text" name="areaCode" value={searchParams.areaCode} onChange={handleSearchInputChange}
                                                        placeholder="1" /></li>
                                                </ul>
                                            </div>
                                        </section>
                                        <div className="button-container">
                                            <button type="button" className="btn btn-primary" onClick={handleSearchClickModal}>검색</button>
                                            <button type="button" className="btn btn-warning" onClick={handleReset}>취소</button>
                                        </div>
                                    </form>

                                    {searchResults.length > 0 ? (
                                        <ul>
                                            {searchResults.map((event) => (
                                                <li key={event.no} onClick={() => handleSelectEvent(event)}>
                                                    {event.title} - {event.startDate} - {event.addr}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>검색 결과가 없습니다.</p>
                                    )}

                                    <input type="text" name="eventInfo" readOnly
                                        value={selectedEvent ? selectedEvent.title : ''} />
                                </div>
                            </div>
                        </div>
                    </ModalContent>
                </ModalOverlay>
            </div>
        </div>
    );
}
export default CreateBanner;