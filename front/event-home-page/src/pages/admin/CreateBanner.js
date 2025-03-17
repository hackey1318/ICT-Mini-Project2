import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import './../css/Style.css';
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

function CreateBanner() {
    const [selectedImage, setSelectedImage] = useState(null)
    const fileInputRef = useRef(null)

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    return (
        <div className="container">
            <h1>관리자 페이지</h1>
            <div style={{ display: "flex" }}>
                <div className="left" style={{ backgroundColor: "#E7F0FF", width: "250px", height: "200px" }}>
                    <ul>
                        <li style={{ margin: "20px", fontSize: "20px" }}><StyledLink to="/memberList">회원 정보 조회</StyledLink></li>
                        <li style={{ margin: "20px", fontSize: "20px" }}><StyledLink to="/withdrawalList">회원 탈퇴 명단</StyledLink></li>
                        <li style={{ margin: "20px", fontSize: "20px" }}><StyledLink to="/bannerList">배너관리</StyledLink></li>
                    </ul>
                </div>
                <div className="right" style={{ flex: 1, padding: "30px" }}>
                    <form onSubmit={''} className="BannerForm">
                        <ul>
                            <li style={{ margin: "10px" }}>행사 정보
                                <span style={{ marginLeft: "50px", marginRight: "50px" }}> | </span>
                                <input type="text" name="eventInfo" style={{ width: "350px" }}></input>
                            </li>
                            <li style={{ margin: "10px" }}>링크
                                <span style={{ marginLeft: "88px", marginRight: "50px" }}> | </span>
                                <input type="text" name="linkTo" placeholder="http://링크할 주소를 입력해주세요." style={{ width: "350px" }}></input>
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
                            <button type="button" className="btn btn-warning" style={{ marginLeft: '10px' }}>취소</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default CreateBanner;