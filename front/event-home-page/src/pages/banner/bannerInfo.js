import axios from "axios";
import { useEffect, useRef, useState } from "react";

import '../../eventCss/MainPageStyle.css';

import StopImage from '../../img/btn_slidem_stop.png'; // 멈춤 이미지 경로
import StartImage from '../../img/btn_slide_play.png'; // 재시작 이미지 경로
import LeftArrowImage from '../../img/btn_left.png'; // 왼쪽 화살표 이미지
import RightArrowImage from '../../img/btn_right.png'; // 오른쪽 화살표 이미지
import moment from "moment";
import { useNavigate } from 'react-router-dom';

function BannerInfo() {

    const navigate = useNavigate();
    const [bannerList, setBannerList] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isRunning, setIsRunning] = useState(true); // 슬라이드 진행 여부
    const slideInterval = useRef(null); // 슬라이드 타이머를 저장할 변수

    // 슬라이드 자동 이동 함수
    const autoSlide = () => {
        if (isRunning && bannerList.length > 0) {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % bannerList.length);
        }
    };

    const goToPrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + bannerList.length) % bannerList.length);
    };

    const goToNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % bannerList.length);
    };

    // 슬라이드 자동 전환을 위한 useEffect
    useEffect(() => {
        // 배너 리스트를 불러오는 함수 호출
        getBannerList();
    }, []); // 빈 배열을 넣어 최초 컴포넌트 렌더링 시 한 번만 실행되도록 함

    useEffect(() => {
        if (bannerList.length > 0 && isRunning) {
            // 슬라이드가 자동으로 넘어가도록 설정 (5초 간격)
            slideInterval.current = setInterval(autoSlide, 5000);
        } else {
            clearInterval(slideInterval.current);  // 자동 슬라이드 멈추기
        }

        return () => {
            // 컴포넌트 언마운트될 때 타이머를 정리
            clearInterval(slideInterval.current);
        };
    }, [isRunning, bannerList]); // isRunning 상태와 bannerList에 변화가 있을 때마다 실행

    async function getBannerList() {
        try {
            const res = await axios.get("http://localhost:9988/banner");
            setBannerList(res.data);  // API 응답 데이터가 올바르게 들어오는지 확인
        } catch (error) {
            console.error("Failed to fetch banner list", error);
        }
    }

    const toggleAutoSlide = () => {
        setIsRunning((prev) => !prev); // 슬라이드 진행 여부를 토글
    };

    // 배너 리스트가 비어있거나 currentSlide가 잘못된 경우를 처리
    if (bannerList.length === 0) {
        return <div>Loading...</div>;
    }

    const getTextColorBasedOnBackground = (backgroundColor) => {
        // Hex 색상에서 RGB로 변환
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
    
        // 밝기 계산 (luminosity)
        const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    
        // 밝으면 검정색, 어두우면 흰색
        return brightness > 128 ? '#000' : '#fff';
    };

    const handleViewDetailsClick = (event, no) => {
        event.preventDefault();  // 기본 동작을 막음 (페이지 리로드 방지)
        navigate(`/eventview/${no}`);  // 페이지 이동
    };

    return (
        <div className="top-banner">
            {bannerList.length > 0 && (
                <div key={bannerList[currentSlide].no} className="banner-content">
                    <div className="banner-background" style={{ background: bannerList[currentSlide].color }} />
                    <div className="banner-text">
                        <h2>{bannerList[currentSlide].title}</h2>
                        <p>{moment(bannerList[currentSlide].startDate).format('YYYY-MM-DD')}~{moment(bannerList[currentSlide].endDate).format('YYYY-MM-DD')}</p>
                        <p><button onClick={(event) => handleViewDetailsClick(event, bannerList[currentSlide].no)}  className="button-readmore" style={{color: getTextColorBasedOnBackground(bannerList[currentSlide].color)}}>자세히 보기</button></p>
                    </div>
                    <div className="banner-img">
                        <img 
                            src={`http://localhost:9988/file-system/download/${bannerList[currentSlide].fileId}`} 
                            alt={`banner-${bannerList[currentSlide].no}`} 
                            className="banner-image"
                        />
                    </div>
                </div>
            )}
            
            {/* 페이지네이션 */}
            <div className="pagination">
                {/* 진행 표시 바 */}
                <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${((currentSlide + 1) / bannerList.length) * 100}%` }} />
                </div>
                
                <span className="pagination-text">{currentSlide + 1} / {bannerList.length}</span>
                <button onClick={goToPrevSlide}><img src={LeftArrowImage} alt="Previous Slide" className="arrow-button"/></button>
                <button onClick={toggleAutoSlide}> <img src={isRunning ? StopImage : StartImage} alt={isRunning ? "멈춤" : "재시작"} className="slider-toggle-image"/></button>
                <button onClick={goToNextSlide}><img src={RightArrowImage} alt="Next Slide" className="arrow-button"/></button>
            </div>
        </div>
    );
}

export default BannerInfo;
