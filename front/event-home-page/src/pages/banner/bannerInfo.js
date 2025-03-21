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

    const [bannerList, setBannerList] = useState([])

    const navigate = useNavigate();
    const [bannerList, setBannerList] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    const goToPrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + bannerList.length) % bannerList.length);
    };

    const goToNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % bannerList.length);
    };


    const mounted = useRef(false);
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
        } else {
            getBannerList();
        }

    }, [])

    async function getBannerList() {
        const res = await axios.get("http://localhost:9988/banner");

        setBannerList(res.data);
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
                    <div className="banner-background" style={{ background: bannerList[currentSlide].color }}/>
                    {bannerList.map((item) => (
                            <img
                                src={`http://localhost:9988/file-system/download/${item.fileId}`}
                                alt={`banner-${item.no}`}
                                className="banner-image"
                            />
                    ))}
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
                <span>{currentSlide + 1} / {bannerList.length}</span>
                <button onClick={goToPrevSlide}>←</button>
                <button onClick={goToNextSlide}>→</button>
            </div>
        </div>
    );


}

export default BannerInfo;