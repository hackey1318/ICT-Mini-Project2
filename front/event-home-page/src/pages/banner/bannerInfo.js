import axios from "axios";
import { useEffect, useRef, useState } from "react";

import '../../eventCss/MainPageStyle.css';

function BannerInfo() {

    const [bannerList, setBannerList] = useState([])
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