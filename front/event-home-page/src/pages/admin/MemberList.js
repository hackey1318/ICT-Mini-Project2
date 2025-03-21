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

function MemberList() {
    let [memberData, setMemberData] = useState([]);
    let [pageNumber, setPageNumber] = useState([]);
    let [nowPage, setNowPage] = useState(1);
    let [totalPage, setTotalPage] = useState(1)
    let [searchWord, setSearchWord] = useState('');

    const mounted = useRef(false);
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
        } else {
            getMemberList(1);
        }
    }, []);

    function getMemberList(page) {
        let url = "http://localhost:9988/member/memberList?nowPage=" + page;
        if (searchWord != null && searchWord != '') {
            url += "&searchWord=" + searchWord;
        }
        axios.get(url)
            .then(function (response) {
                console.log(response.data);
                setMemberData([]);
                response.data.list.map(function (record) {
                    setMemberData(prev => {
                        return [...prev, {
                            name: record.name,
                            userid: record.userid,
                            email: record.email,
                            tel: record.tel,
                            addr: record.addr,
                            writedate: record.createAt
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
        <div>
            <h3 className="mb-4 d-none d-md-block">회원 정보 조회</h3>

            <div style={{ display: "flex" }}>

                <div className="right" style={{ flex: 1, padding: "30px" }}>
                    <div className="row" style={{ borderBottom: 'solid #ddd 2px' }}>
                        <div className="col-sm-1 p-2">이름</div>
                        <div className="col-sm-2 p-2">아이디</div>
                        <div className="col-sm-3 p-2">이메일</div>
                        <div className="col-sm-2 p-2">연락처</div>
                        <div className="col-sm-2 p-2">주소</div>
                        <div className="col-sm-2 p-2">생성일</div>
                    </div>
                    {
                        memberData.map(function (record) {
                            return (
                                <div className="row" style={{ borderBottom: 'solid #ddd 2px' }}>
                                    <div className="col-sm-1 p-2">{record.name}</div>
                                    <div className="col-sm-2 p-2">{record.userid}</div>
                                    <div className="col-sm-3 p-2">{record.emil}</div>
                                    <div className="col-sm-2 p-2">{record.tel}</div>
                                    <div className="col-sm-2 p-2">{record.addr}</div>
                                    <div className="col-sm-2 p-2">{record.createAt}</div>
                                </div>
                            )
                        })
                    }
                    <ul className="pagination justify-content-center" style={{ margin: '20px 0' }}>
                        {
                            (function () {
                                if (nowPage > 1) {
                                    return (<li className="page-item"><a className="page-link" onClick={() => getMemberList(nowPage - 1)}>Previous</a></li>)
                                }
                            })()
                        }
                        {pageNumber.map(function (pg) {
                            var activeStyle = 'page-item';
                            if (nowPage == pg) {
                                activeStyle = 'page-item active';
                            }
                            return <li className={activeStyle}><a className="page-link" onClick={() => getMemberList(pg)}>{pg}</a></li>
                        })}

                        {
                            (function () {
                                if (nowPage < totalPage) {
                                    return (<li className="page-item"><a className="page-link" onClick={() => getMemberList(nowPage + 1)}>Next</a></li>)
                                }
                            })()
                        }
                    </ul>
                </div>
            </div>
            <div className="row">
                <input type="text" placeholder="이름 입력" name="searchWord" style={{ width: '200px' }}
                    value={searchWord}
                    onChange={setSearchWordChange}
                />
                <input type="button" value="Search" style={{ width: '100px' }} onClick={() => getMemberList(1)} />
            </div>
        </div >
    );
}
export default MemberList;