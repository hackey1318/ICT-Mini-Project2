import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import './../eventCss/MainPageStyle.css';
import moment from 'moment';
import axios from 'axios';
import EventModal from './EventModal'; // 모달 컴포넌트 import

function MainPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem("logStatus") == "Y");
    const [imageData, setImageData] = useState([]);
    const [filteredImageData, setFilteredImageData] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null); // 선택된 이벤트 상태

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                //const response = await axios.get('http://localhost:9988/api/events'); // 전체 이벤트 가져오기
                const response = await axios.get('http://localhost:9988/api/events/ongoing'); // 진행 중인 이벤트만 가져오기
                setImageData(response.data);
                setFilteredImageData(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % imageData.length);
        }, 3000);

        return () => clearInterval(intervalId);
    }, [imageData.length]);

    useEffect(() => {
        setIsLoggedIn(sessionStorage.getItem("logStatus") == "Y");
    }, []);

    useEffect(() => {
        const fetchFilteredEvents = async () => {
            try {
                let apiUrl = `/api/events/search?`;
                if (searchTerm) {
                    apiUrl += `searchTerm=${searchTerm}&`;
                }
                if (currentDate) {
                    apiUrl += `selectedDate=${moment(currentDate).format('YYYY-MM-DDTHH:mm:ss')}&`;
                }

                apiUrl = apiUrl.replace(/&$/, '');

                const response = await axios.get('http://localhost:9988' + apiUrl);
                setFilteredImageData(response.data);
            } catch (error) {
                console.error('Error fetching filtered events:', error);
                setFilteredImageData([]);
            }
        };

        fetchFilteredEvents();
    }, [searchTerm, currentDate]);

    const goToPrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + imageData.length) % imageData.length);
    };

    const goToNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % imageData.length);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const DatePicker = ({ currentDate, setCurrentDate }) => {
        const [date, setDate] = useState(currentDate);

        useEffect(() => {
            setDate(currentDate);
        }, [currentDate]);

        const handleDateChange = (date) => {
            setDate(date);
            setCurrentDate(date);
        };

        const formatDate = (date) => {
            return moment(date).format('YYYY년 MM월 DD일');
        };

        return (
            <div className="date-picker">
                <p>{formatDate(date)}</p>
                <Calendar
                    onChange={handleDateChange}
                    value={date}
                    locale="ko-KR"
                    calendarType="hebrew"
                    formatShortWeekday={(locale, date) =>
                        ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]
                    }
                    formatDay={(locale, date) => `${date.getDate()}`}
                    showNeighboringMonth={false}
                    className="custom-calendar"
                    tileClassName={({ date }) => {
                        const day = date.getDay();
                        if (day === 0) return "sunday";
                        if (day === 6) return "saturday";
                        if (day === 5) return "friday";
                        return "";
                    }}
                />
            </div>
        );
    };

    const openModal = (event) => {
        setSelectedEvent(event);
    };

    const closeModal = () => {
        setSelectedEvent(null);
    };

    return (
        <div className="main-page">
            <header className="main-header">
                <div className="top-banner">
                <div className="banner-content">
                            {imageData.length > 0 ? (
                                <>
                                    <img
                                        src={imageData[currentSlide % imageData.length]?.img_list && imageData[currentSlide % imageData.length]?.img_list[0]?.originImgurl
                                            ? imageData[currentSlide % imageData.length].img_list[0].originImgurl
                                            : ''}
                                        alt={imageData[currentSlide % imageData.length].title}
                                        className="banner-image"
                                    />
                                    <div className="banner-text">
                                        <h2>{imageData[currentSlide % imageData.length].title}</h2>
                                    </div>
                                </>
                            ) : (
                                <div>표시할 이벤트가 없습니다.</div>
                            )}
                        </div>

                    {/* 페이지네이션 */}
                    <div className="pagination">
                        <span>{currentSlide + 1} / {imageData.length}</span>
                        <button onClick={goToPrevSlide}>←</button>
                        <button onClick={goToNextSlide}>→</button>
                    </div>
                </div>
                {/* 로그인 상태에 따라 메뉴 변경 */}
                <div className="header-menu">
                    {isLoggedIn ? (
                        <ul>
                            <li>마이페이지</li>
                            <li>공지사항</li>
                            <li>찜목록</li>
                        </ul>
                    ) : (
                        <ul>
                            <li>회원가입</li>
                            <li>로그인</li>
                        </ul>
                    )}
                </div>
            </header>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="검색어를 입력해주세요"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="content-area">
                <div className="date-picker-container">
                    <DatePicker
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                    />
                </div>

                <div className="image-grid">
                    {filteredImageData.length > 0 ? (
                        filteredImageData.map((image) => (
                            <div key={image.no} className="image-item">
                                  <img
                                    src={ image.img_list && image.img_list[0].originImgurl} 
                                    alt={image.title}
                                    className="grid-image"
                                />
                                <h3>{image.title}</h3>
                                <p>{moment(image.startDate).format('YYYY-MM-DD')} ~ {moment(image.endDate).format('YYYY-MM-DD')}</p>
                                <p>행사장소: {image.addr}</p>
                                <button className="viewButton" onClick={() => openModal(image)}>자세히 보기</button>
                            </div>
                        ))
                    ) : (
                        <div>입력한 검색어와 연관된 검색어가 없습니다.</div>
                    )}
                </div>
            </div>
             {/* 모달 */}
            {selectedEvent && (
                <EventModal event={selectedEvent} onClose={closeModal} />
            )}
        </div>
    );
}

export default MainPage;