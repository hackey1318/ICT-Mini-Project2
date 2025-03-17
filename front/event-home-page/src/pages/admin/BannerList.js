import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import './../../css/adminStyle.css';
import styled from 'styled-components';
import axios from "axios";

const StyledLink = styled(Link)`
        text-decoration:none;
        &:link, &:visited, &:active{
        color:black;
        }
        &:hover{
            color:blue;
        }
    `;

function BannerList() {
    let [bannerData, setBannerData] = useState([]);
    const navigate = useNavigate();

    const mounted = useRef(false);
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
        } else {
            getBannerList(1);
        }
    }, []);

    function getBannerList() {
        let url = "http://localhost:9988/banner/bannerList"

        axios.get(url)
            .then(function (response) {
                console.log(response.data);
                setBannerData([]);
                response.data.list.map(function (record) {
                    setBannerData(prev => {
                        return [...prev, {
                            no: record.no,
                            title: record.joined.title,
                            color: record.color,
                            startDate: record.startDate,
                            enddDate: record.endDate,
                        }]
                    });
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const handleCreateBanner = () => {
        navigate("/admin/createBanner");
    };

    return (
        <div className="container">
            <h1>배너 목록</h1>
            <div style={{ display: "flex" }}>
                <div className="left" style={{ backgroundColor: "#E7F0FF", width: "250px", height: "200px" }}>
                    <ul>
                        <li style={{ margin: "20px", fontSize: "20px" }}><StyledLink to="/admin/memberList">회원 정보 조회</StyledLink></li>
                        <li style={{ margin: "20px", fontSize: "20px" }}><StyledLink to="/admin/withdrawalList">회원 탈퇴 명단</StyledLink></li>
                        <li style={{ margin: "20px", fontSize: "20px" }}><StyledLink to="/admin/bannerList">배너관리</StyledLink></li>
                    </ul>
                </div>

                <div className="right" style={{ flex: 1, padding: "30px" }}>
                    <div className="row" style={{ borderBottom: 'solid #ddd 2px' }}>
                        <div className="col-sm-1 p-2">번호</div>
                        <div className="col-sm-2 p-2">이름</div>
                        <div className="col-sm-3 p-2">시작일</div>
                        <div className="col-sm-2 p-2">종료일</div>
                        <div className="col-sm-2 p-2">이미지</div>
                        <div className="col-sm-2 p-2">색상</div>
                    </div>
                    {
                        bannerData.map(function (record) {
                            return (
                                <div className="row" style={{ borderBottom: 'solid #ddd 2px' }}>
                                    <div className="col-sm-1 p-2">{record.no}</div>
                                    <div className="col-sm-2 p-2">{record.joined.title}</div>
                                    <div className="col-sm-3 p-2">{record.startDate}</div>
                                    <div className="col-sm-2 p-2">{record.endDate}</div>
                                    <div className="col-sm-2 p-2">{record.image}</div>
                                    <div className="col-sm-2 p-2">{record.color}</div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-right" }}>
                <button type="button" className="btn btn-primary" onClick={handleCreateBanner}>배너생성</button>
            </div>
        </div >
    );
}
export default BannerList;