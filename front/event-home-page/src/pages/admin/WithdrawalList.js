import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(Link)`
        text-decoration:none;
        &:link, &:visited, &:active{
        color:black;
        }
        &:hover{
            color:blue;
        }
    `;

function WithdrawalList() {
    let [withdrawalData, setWithdrawalData] = useState([]);
    let [pageNumber, setPageNumber] = useState([]);
    let [nowPage, setNowPage] = useState(1);
    let [totalPage, setTotalPage] = useState(1)
    let [searchWord, setSearchWord] = useState('');

    const mounted = useRef(false);
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
        } else {
            getWithdrawalList(1);
        }
    }, []);

    function getWithdrawalList(page) {
        let url = "http://localhost:9988/member/withdrawalList?nowPage=" + page;
        if (searchWord != null && searchWord != '') {
            url += "&searchWord=" + searchWord;
        }
        axios.get(url)
            .then(function (response) {
                console.log(response.data);
                setWithdrawalData([]);
                response.data.list.map(function (record) {
                    setWithdrawalData(prev => {
                        return [...prev, {
                            userid: record.joined.userid,
                            content: record.content,
                            createdAt: record.createdAt
                        }]
                    });
                });
                //console.log(boardData);
                setPageNumber([]);
                let pVO = response.data.pVO;
                for (let p = pVO.startPageNum; p < pVO.startPageNum + pVO.onePageCount; p++) {
                    //console.log(p);
                    if (p <= pVO.totalPage) {
                        setPageNumber((prev) => {
                            return [...prev, p];
                        });
                    }
                }
                setNowPage(pVO.nowPage);
                setTotalPage(pVO.totalPage);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function setSearchWordChange(event) {
        setSearchWord(event.target.value);
    }

    return (
        <div className="container">
            <h1>회원 탈퇴 명단</h1>
            <div style={{ display: "flex" }}>
                <div className="left" style={{ backgroundColor: "#E7F0FF", width: "250px", height: "200px" }}>
                    <ul>
                        <li style={{ margin: "20px", fontSize: "20px" }}><StyledLink to="/memberList">회원 정보 조회</StyledLink></li>
                        <li style={{ margin: "20px", fontSize: "20px" }}><StyledLink to="/withdrawalList">회원 탈퇴 명단</StyledLink></li>
                        <li style={{ margin: "20px", fontSize: "20px" }}><StyledLink to="/bannerList">배너관리</StyledLink></li>
                    </ul>
                </div>

                <div className="right" style={{ flex: 1, padding: "30px" }}>
                    <div className="row" style={{ borderBottom: 'solid #ddd 2px' }}>
                        <div className="col-sm-4 p-2">아이디</div>
                        <div className="col-sm-4 p-2">탈퇴일</div>
                        <div className="col-sm-4 p-2">탈퇴사유</div>
                    </div>
                    {
                        withdrawalData.map(function (record) {
                            return (
                                <div className="row" style={{ borderBottom: 'solid #ddd 2px' }}>
                                    <div className="col-sm-4 p-2">{record.joined.nameid}</div>
                                    <div className="col-sm-4 p-2">{record.content}</div>
                                    <div className="col-sm-4 p-2">{record.createdAt}</div>
                                </div>
                            )
                        })
                    }
                    <ul className="pagination justify-content-center" style={{ margin: '20px 0' }}>
                        {
                            (function () {
                                if (nowPage > 1) {
                                    return (<li className="page-item"><a className="page-link" onClick={() => getWithdrawalList(nowPage - 1)}>Previous</a></li>)
                                }
                            })()
                        }
                        {pageNumber.map(function (pg) {
                            var activeStyle = 'page-item';
                            if (nowPage == pg) {
                                activeStyle = 'page-item active';
                            }
                            return <li className={activeStyle}><a className="page-link" onClick={() => getWithdrawalList(pg)}>{pg}</a></li>
                        })}

                        {
                            (function () {
                                if (nowPage < totalPage) {
                                    return (<li className="page-item"><a className="page-link" onClick={() => getWithdrawalList(nowPage + 1)}>Next</a></li>)
                                }
                            })()
                        }
                    </ul>
                </div>
            </div>
            <div className="row">
                <label>이름:</label>
                <input type="text" placeholder="이름 입력" name="searchWord" style={{ width: '200px' }}
                    value={searchWord}
                    onChange={setSearchWordChange}
                />
                <input type="button" value="Search" style={{ width: '100px' }} onClick={() => getWithdrawalList(1)} />
            </div>
        </div >
    );
}
export default WithdrawalList;