import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import './../eventCss/MainPageStyle.css';
import moment from 'moment';
import axios from 'axios'; // Import Axios

function MainPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem("logStatus") === "Y");
    const [imageData, setImageData] = useState([]); // 이벤트 데이터
    const [filteredImageData, setFilteredImageData] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/api/events'); // Replace with your actual API endpoint
                setImageData(response.data);
                setFilteredImageData(response.data); // Initialize filtered data with all events
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents(); // Fetch events when component mounts
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % imageData.length);
        }, 3000);

        return () => clearInterval(intervalId);
    }, [imageData.length]);

    useEffect(() => {
        setIsLoggedIn(sessionStorage.getItem("logStatus") === "Y");
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
                // Remove the trailing "&" if it exists
                apiUrl = apiUrl.replace(/&$/, '');

                const response = await axios.get(apiUrl);
                setFilteredImageData(response.data);
            } catch (error) {
                console.error('Error fetching filtered events:', error);
                setFilteredImageData([]); // Ensure filtered data is empty in case of error
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

    const DatePicker = () => {
        const [date, setDate] = useState(new Date());

        const handleDateChange = (date) => {
            setDate(date);
            setCurrentDate(date);
        };

        return (
            <div className="date-picker">
                <p>{date.toDateString()}</p>
                <Calendar
                    onChange={(date) => {
                        setDate(date);
                        setCurrentDate(date);
                    }}
                    value={date}
                    locale="ko-KR"
                    calendarType="hebrew"
                    formatShortWeekday={(locale, date) =>
                        ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]
                    }
                    formatDay={(locale, date) => `${date.getDate()}`}
                    showNeighboringMonth={false}
                    tileDisabled={({ date }) => date.getMonth() !== new Date().getMonth()}
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

    return (
        <div className="main-page">
            <header className="main-header">
                <div className="top-banner">
                    <div className="banner-content">
                        {imageData.length > 0 && ( // Check if imageData is not empty before accessing elements
                            <>
                                <div className="banner-text">
                                    <h2>{imageData[currentSlide % imageData.length].title}</h2>
                                </div>
                                {/* 이미지를 어떻게 처리할지에 따라 아래 로직을 변경해야 합니다. */}
                                {/* <img src={imageData[currentSlide % imageData.length].imageUrl} alt={imageData[currentSlide % imageData.length].title} /> */}
                            </>
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
                    <DatePicker />
                </div>

                <div className="image-grid">
                    {/* 검색 결과에 따라 이미지 목록 렌더링 */}
                    {filteredImageData.length > 0 ? (
                        filteredImageData.map((image) => (
                            <div key={image.no} className="image-item">
                                {/* 이미지를 어떻게 처리할지에 따라 아래 로직을 변경해야 합니다. */}
                                {/* <img src={image.imageUrl} alt={image.title} /> */}
                                <h3>{image.title}</h3>
                                <p>{moment(image.startDate).format('YYYY-MM-DD')} ~ {moment(image.endDate).format('YYYY-MM-DD')}</p>
                                <p>행사장소: {image.addr}</p>
                                <button className="viewButton">자세히 보기</button>
                            </div>
                        ))
                    ) : (
                        <div>선택된 날짜에 해당하는 이벤트가 없습니다.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MainPage;