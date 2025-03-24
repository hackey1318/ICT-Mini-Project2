import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import apiClient from "../../js/axiosConfig";

const formatDate = (dateTimeString) => dateTimeString?.split('T')[0] || '';
const StyledLink = styled(Link)`
    text-decoration:none;
    &:link, &:visited, &:active{
    color:black;
    }
    &:hover{
        color:blue;
    }
`;

function CommentsPage() {

    let [replyData, setReplyData] = useState([]);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(0); // Initialize currentPage to 0
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const mounted = useRef(false);
    useEffect(() => {
        if (mounted.current) {
            mounted.current = true;
        } else {
            getReplyList();
        }
    }, [currentPage, itemsPerPage]);

    async function getReplyList() {
        try {
            const response = await apiClient.get(`/reply/replyList?page=${currentPage}&size=${itemsPerPage}`);
            const data = response.data.content;  // 페이지네이션을 고려하여 content에서 데이터 추출
            const totalPages = response.data.totalPages;  // 전체 페이지 수

            setReplyData(data);
            setTotalPages(totalPages);

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

    const handleDelete = async (replyNo) => {
        console.log(`댓글 ${replyNo} 삭제`);
        if (window.confirm("댓글을 삭제하시겠습니까?")) {
            const accessToken = sessionStorage.getItem("accessToken");
            try {
                await apiClient.patch(`/reply/${replyNo}`, {});
                alert("댓글이 삭제 되었습니다.");
                getReplyList();
            } catch (error) {
                console.log(error);
                alert("댓글 삭제 실패");
            }
        }
    };
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber - 1); 
    };

    return (
        <div className="container">
            <h3 className="mb-4 d-none d-md-block">작성한 댓글</h3>
            <div style={{ display: "flex" }}>

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
            <div className="d-flex justify-content-center mt-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                        key={pageNumber}
                        className={`btn btn-outline-primary mx-1 ${currentPage + 1 === pageNumber ? "active" : ""}`} 
                        onClick={() => handlePageChange(pageNumber)}
                    >
                        {pageNumber}
                    </button>
                ))}
            </div>
        </div >
    );
}

export default CommentsPage