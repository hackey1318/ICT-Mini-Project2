import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import './../../css/myPageStyle.css';
import apiClient from "../../js/axiosConfig";

const StyledLink = styled(Link)`
    text-decoration:none;
    &:link, &:visited, &:active{
    color:black;
    }
    &:hover{
        color:blue;
    }
`;
const formatDate = (dateTimeString) => dateTimeString?.split('T')[0] || '';

function ReplyList() {
    let [replyData, setReplyData] = useState([]);
    let {replyNo} = useParams();
    const navigate = useNavigate();

    const mounted = useRef(false);
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
        } else {
            getReplyList();
        }
    }, []);

    async function getReplyList() {
        const accessToken = sessionStorage.getItem("accessToken"); // 토큰 가져오기
        try {
            const response = await apiClient.get("/reply/replyList");
            console.log(response.data);
            setReplyData(response.data.list);
        } catch (error) {
            console.error("댓글 목록 가져오기 실패:", error);
            if (error.response && error.response.status === 401) {
                // 토큰 만료 처리 (예: 로그인 페이지로 이동)
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                navigate('/login');
            } else {
                alert("댓글 목록을 불러오는데 실패했습니다.");
            }
        }
    }

    const handleEdit = (eventNo) => {
        //console.log(`댓글 ${eventNo} 수정`);\
        navigate(`/eventview/${eventNo}`);
    };

    const handleDelete = async (no) => {
        if (window.confirm("댓글을 삭제하시겠습니까?")) {
            const accessToken = sessionStorage.getItem("accessToken");
            try {
                await apiClient.put(`/reply/${no}`, {});
                alert("댓글이 삭제 되었습니다.");
                getReplyList();
            } catch (error) {
                console.log(error);
                alert("댓글 삭제 실패");
            }
        }
    };

    return (
        <div className="container">
            <h2 className="h4 mb-4 d-none d-md-block">찜 목록</h2>
            <div style={{ display: "flex" }}>
                <div className="left" style={{ backgroundColor: "#E7F0FF", width: "250px", height: "200px", borderRadius: "12px" }}>
                    <ul>
                        <li style={{ margin: "20px", fontSize: "20px" }}><StyledLink to="/mypage/updateMyInfo">내 정보 수정</StyledLink></li>
                        <li style={{ margin: "20px", fontSize: "20px" }}><StyledLink to="/mypage/zzimList">찜 목록</StyledLink></li>
                        <li style={{ margin: "20px", fontSize: "20px" }}><StyledLink to="/mypage/replyList">작성한 댓글</StyledLink></li>
                    </ul>
                </div>

                <div className="right" style={{ flex: 1, padding: "30px" }}>
                    <div className="row" style={{ borderBottom: 'solid #ddd 2px' }}>
                        <div className="col-sm-4 p-2">행사 이름</div>
                        <div className="col-sm-4 p-2">댓글 내용</div>
                        <div className="col-sm-2 p-2">작성 날짜</div>
                        <div className="col-sm-2 p-2">수정 / 삭제</div>
                    </div>
                    {replyData.map(function (record) {
                        return (
                            <div className="row" style={{ borderBottom: 'solid #ddd 2px' }} key={record.no}>
                                <div className="col-sm-4 p-2">{record.title}</div>
                                <div className="col-sm-4 p-2">{record.content}</div>
                                <div className="col-sm-2 p-2">{formatDate(record.createdAt)}</div>
                                <div className="col-sm-2 p-2">
                                <button className="btn btn-warning" style={{ margin: "1px" }} onClick={() => handleEdit(record.eventNo)}>수정</button>
                                <button className="btn btn-danger" style={{ margin: "1px" }} onClick={() => handleDelete(record.no)}>삭제</button>
                                </div>
                            </div>
                        );
                    })
                    }
                </div>
            </div>
        </div >
    );
}
export default ReplyList;
