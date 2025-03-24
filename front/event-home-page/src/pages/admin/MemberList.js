import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./../../css/admin.css";
import apiClient from "../../js/axiosConfig";
import ErrorModal from "../common/ErrorModal";

const formatDate = (dateTimeString) => dateTimeString?.split("T")[0] || "";

function MemberList() {
	const [memberData, setMemberData] = useState([]);
	const [pageNumber, setPageNumber] = useState([]);
	const [nowPage, setNowPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
	const [searchWord, setSearchWord] = useState("");
	const mounted = useRef(false);
	const [showErrorModal, setShowErrorModal] = useState(false)

	useEffect(() => {
		if (!mounted.current) {
			mounted.current = true;
			getMemberList(1);
		}
	}, []);

	function generateDateFormat(date) {
        const dateInfo = new Date(date);
        const formattedDate = dateInfo.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        return formattedDate
    }

	function getMemberList(page) {
		let url = `/member/memberList?nowPage=${page}`;
		if (searchWord) {
			url += `&searchWord=${searchWord}`;
		}
		apiClient
			.get(url)
			.then((response) => {
				setMemberData(response.data.list);
				const pVO = response.data.pVO;
				setPageNumber(
					Array.from(
						{
							length: Math.min(
								pVO.onePageCount,
								pVO.totalPage - pVO.startPageNum + 1
							),
						},
						(_, i) => pVO.startPageNum + i
					)
				);
				setNowPage(pVO.nowPage);
				setTotalPage(pVO.totalPage);
			})
			.catch((error) => {
				console.error(error);
				if (error.status === 403) {
					setShowErrorModal(true)
				}
			});
	}

	function setSearchWordChange(event) {
		setSearchWord(event.target.value);
	}

	return (
		<>
			<ErrorModal show={showErrorModal} onClose={() => setShowErrorModal(false)} />
			<h3 className="mb-4 d-none d-md-block">회원 정보 조회</h3>
			<div className="admin-search-container">
				<label className="admin-form-label">이름:</label>
				<input
					className="admin-search-input"
					type="text"
					placeholder="이름 입력"
					value={searchWord}
					onChange={setSearchWordChange}
				/>
				<button className="admin-button" onClick={() => getMemberList(1)}>
					검색
				</button>
			</div>
			<div className="admin-container">
				<div style={{ display: "flex" }}>
					<div className="right" style={{ flex: 1, padding: "30px" }}>
						<div className="row" style={{ borderBottom: "solid #ddd 2px", display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "10px" }}>
							<div className="p-2" style={{ wordBreak: "break-word" }}>이름</div>
							<div className="p-2" style={{ wordBreak: "break-word" }}>아이디</div>
							<div className="p-2" style={{ wordBreak: "break-word" }}>이메일</div>
							<div className="p-2" style={{ wordBreak: "break-word" }}>연락처</div>
							<div className="p-2" style={{ wordBreak: "break-word" }}>주소</div>
							<div className="p-2" style={{ wordBreak: "break-word" }}>생성일</div>
						</div>
						{
							memberData.map(function (record) {
								return (
									<div className="row" style={{ borderBottom: "solid #ddd 2px", display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "10px" }}>
										<div className="p-2" style={{ wordBreak: "break-word" }}>{record.name}</div>
										<div className="p-2" style={{ wordBreak: "break-word" }}>{record.userId}</div>
										<div className="p-2" style={{ wordBreak: "break-word" }}>{record.email}</div>
										<div className="p-2" style={{ wordBreak: "break-word" }}>{record.tel}</div>
										<div className="p-2" style={{ wordBreak: "break-word" }}>{record.addr}</div>
										<div className="p-2" style={{ wordBreak: "break-word" }}>{generateDateFormat(record.createdAt)}</div>
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
						</ul>
						<ul className="admin-pagination">
							{nowPage > 1 && (
								<li className="admin-page-item">
									<a
										className="admin-page-link"
										onClick={() => getMemberList(nowPage - 1)}
									>
										Previous
									</a>
								</li>
							)}
							{pageNumber.map((pg) => (
								<li key={pg} className="admin-page-item">
									<a
										className={`admin-page-link ${nowPage === pg ? "active" : ""
											}`}
										onClick={() => getMemberList(pg)}
									>
										{pg}
									</a>
								</li>
							))}
							{nowPage < totalPage && (
								<li className="admin-page-item">
									<a
										className="admin-page-link"
										onClick={() => getMemberList(nowPage + 1)}
									>
										Next
									</a>
								</li>
							)}
						</ul>
					</div>
				</div>
			</div>
		</>
	);
}

export default MemberList;