import axios from "axios";
import { useEffect, useRef, useState } from "react";

import '../../eventCss/MainPageStyle.css';

import StopImage from '../../img/btn_slidem_stop.png'; // 멈춤 이미지 경로
import StartImage from '../../img/btn_slide_play.png'; // 재시작 이미지 경로
import LeftArrowImage from '../../img/btn_left.png'; // 왼쪽 화살표 이미지
import RightArrowImage from '../../img/btn_right.png'; // 오른쪽 화살표 이미지
import moment from "moment";

function BannerInfo() {
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

    return (
        <div className="top-banner">
            {bannerList.length > 0 && (
                <div key={bannerList[currentSlide].no} className="banner-content">
                    <div className="banner-background" style={{ background: bannerList[currentSlide].color }} />
                    <div className="banner-text">
                        <h2>{`banner-${bannerList[currentSlide].title}`}</h2>
                        <p>{moment(bannerList[currentSlide].startDate).format('YYYY-MM-DD')}~{moment(bannerList[currentSlide].endDate).format('YYYY-MM-DD')}</p>
                        <p><button className="button-readmore">자세히 보기</button></p>
                    </div>
                    {/* <div className="banner-img">
                        <img 
                            src="http://tong.visitkorea.or.kr/cms/resource/28/3474528_image2_1.jpg"
                            alt={`banner-${bannerList[currentSlide].no}`} 
                            className="banner-image"
                        />
                    </div> */}
                    {/* 고정된 이미지말고 밑에 소스로 수정해야함 ---- 현재 슬라이드에 해당하는 이미지 한 개만 출력 */}
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
