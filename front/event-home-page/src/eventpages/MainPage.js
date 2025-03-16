import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import './../eventCss/MainPageStyle.css';
import i01 from '../img/01.jpg';
import i02 from '../img/02.jpg';
import i03 from '../img/03.jpg';
import i04 from '../img/04.jpg';

function MainPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem("logStatus") == "Y"); // 로그인 상태 관리
    const [filteredImageData, setFilteredImageData] = useState([]);
    const imageData = [
        {
            id: 1,
            title: '가나다 1',
            startDate: '2024-01-01', // 시작 날짜 추가
            endDate: '2024-01-05', // 종료 날짜 추가
            location: '서울',
            subtitle: '부제목 1',
            imageUrl: i01,
        },
        {
            id: 2,
            title: '다라마 2',
            startDate: '2024-02-10', // 시작 날짜 추가
            endDate: '2024-02-15', // 종료 날짜 추가
            location: '부산',
            subtitle: '부제목 2',
            imageUrl: i02,
        },
        {
            id: 3,
            title: '바사아 3',
            startDate: '2024-03-20', // 시작 날짜 추가
            endDate: '2024-03-25', // 종료 날짜 추가
            location: '대구',
            subtitle: '부제목 3',
            imageUrl: i03,
        },
        {
            id: 4,
            title: '아자차 4',
            startDate: '2024-04-01', // 시작 날짜 추가
            endDate: '2024-04-05', // 종료 날짜 추가
            location: '광주',
            subtitle: '부제목 4',
            imageUrl: i04,
        },
    ];

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % imageData.length);
        }, 3000);

        return () => clearInterval(intervalId);
    }, [imageData.length]);

    useEffect(() => {
        // sessionStorage의 변경을 감지하여 로그인 상태 업데이트
        setIsLoggedIn(sessionStorage.getItem("logStatus") == "Y");
    }, []);
    useEffect(() => {
        // 검색어 변경 시 필터링
        const filtered = imageData.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredImageData(filtered);
    }, [searchTerm, imageData]);

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

        return (
            <div className="date-picker">
                <p>{date.toDateString()}</p>
                <Calendar
                    onChange={setDate}
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
                        <div className="banner-text">
                            <h2>{imageData[currentSlide].title}</h2>
                            <p>{imageData[currentSlide].subtitle}</p>
                        </div>
                        <img src={imageData[currentSlide].imageUrl} alt={imageData[currentSlide].title} />
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
                            <div key={image.id} className="image-item">
                                <img src={image.imageUrl} alt={image.title} />
                                <h3>{image.title}</h3>
                                <p>{image.startDate} ~ {image.endDate}</p>
                                <p>행사장소: {image.location}</p>
                                <button className="viewButton">자세히 보기</button>
                            </div>
                        ))
                    ) : (
                        imageData.map((image) => (
                            <div key={image.id} className="image-item">
                                <img src={image.imageUrl} alt={image.title} />
                                <h3>{image.title}</h3>
                                <p>{image.startDate} ~ {image.endDate}</p>
                                <p>행사장소: {image.location}</p>
                                <button className="viewButton">자세히 보기</button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default MainPage;