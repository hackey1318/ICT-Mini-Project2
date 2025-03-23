import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "./../../css/admin.css";
import { HexColorPicker } from "react-colorful";
import axios from "axios";
import apiClient from "../../js/axiosConfig";
import apiFileClient from "../../js/axiosFileConfig";

function CreateBanner() {
	const [selectedImage, setSelectedImage] = useState(null);
	const fileInputRef = useRef(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchResults, setSearchResults] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [bannerInfo, setBannerInfo] = useState({
		eventInfo: "",
		startDate: "",
		endDate: "",
		bannerColor: "#ffffff",
		file: null,
		eventNo: null,
		status: "active",
	});
	const [searchParams, setSearchParams] = useState({
		title: "",
		startDate: "",
		addr: "",
	});
	const [showColorPicker, setShowColorPicker] = useState(false);
	const navigate = useNavigate();

	const handleImageChange = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			if (!file.type.startsWith("image/")) {
				alert("이미지 파일만 업로드 가능합니다.");
				return;
			}
			if (file.size > 5 * 1024 * 1024) {
				alert("파일 크기는 5MB를 초과할 수 없습니다.");
				return;
			}
			const imageUrl = URL.createObjectURL(file);
			setSelectedImage(imageUrl);
			setBannerInfo((prev) => ({ ...prev, file }));
		}
	};

	const handleSearchClickModal = async () => {
		setIsLoading(true);
		try {
			const response = await apiClient.post(
				"/banner/searchEvents",
				searchParams
			);
			setSearchResults(response.data.list || []);
			if (!response.data.list || response.data.list.length === 0) {
				alert("검색 결과가 없습니다.");
			}
		} catch (error) {
			console.error("Error:", error);
			alert("행사 정보 검색 중 오류가 발생했습니다.");
			setSearchResults([]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (
			!bannerInfo.eventInfo ||
			!bannerInfo.startDate ||
			!bannerInfo.endDate ||
			!bannerInfo.file
		) {
			alert("모든 필수 필드를 입력해주세요.");
			return;
		}

		const formData = new FormData();
		formData.append("files", bannerInfo.file);

		const accessToken = sessionStorage.getItem("accessToken");
		try {
			const fileUpload = await apiFileClient.post(
				"/file-system/upload",
				formData
			);

			const response = await apiClient.post(
				"/banner/create",
				{
					eventNo: bannerInfo.eventNo,
					title: searchParams.title,
					startDate: bannerInfo.startDate + "T00:00:00",
					endDate: bannerInfo.endDate + "T23:59:59",
					color: bannerInfo.bannerColor,
					fileId: fileUpload.data[0].imageId,
					status: bannerInfo.status,
				}
			);

			if (response.data["result"] === true) {
				alert("배너가 성공적으로 등록되었습니다.");
				setBannerInfo({
					eventInfo: "",
					startDate: "",
					endDate: "",
					bannerColor: "#ffffff",
					file: null,
					eventNo: null,
					status: "active",
				});
				setSelectedImage(null);
				navigate("/admin/bannerList", { state: { refresh: true } });
			} else {
				alert("배너 등록에 실패하였습니다.");
			}
		} catch (error) {
			console.error(
				"Submit error:",
				error.response ? error.response.data : error.message
			);
			alert(
				"배너 등록 중 오류가 발생했습니다: " +
				(error.response?.data || error.message)
			);
		}
	};

	const handleOpenModal = () => setIsModalOpen(true);
	const handleCloseModal = () => setIsModalOpen(false);

	const handleSearchInputChange = (e) => {
		const { name, value } = e.target;
		setSearchParams((prev) => ({ ...prev, [name]: value }));
	};

	const handleReset = () => {
		setSearchParams({ title: "", startDate: "", addr: "" });
		setSearchResults([]);
	};

	const handleSelectEvent = (event) => {
		setBannerInfo((prev) => ({
			...prev,
			eventInfo: event.title,
			eventNo: event.no,
		}));
		setIsModalOpen(false);
	};

	const formatDate = (dateTimeString) => dateTimeString?.split("T")[0] || "";

	const handleBannerInputChange = (e) => {
		const { name, value } = e.target;
		setBannerInfo((prev) => ({ ...prev, [name]: value }));
	};

	const handleColorChange = (color) => {
		setBannerInfo((prev) => ({ ...prev, bannerColor: color }));
	};

	const toggleColorPicker = () => setShowColorPicker(!showColorPicker);

	const getContrastColor = (bgColor) => {
		if (!bgColor) return "black";
		const r = parseInt(bgColor.slice(1, 3), 16);
		const g = parseInt(bgColor.slice(3, 5), 16);
		const b = parseInt(bgColor.slice(5, 7), 16);
		const brightness = (r * 299 + g * 587 + b * 114) / 1000;
		return brightness > 128 ? "black" : "white";
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleSearchClickModal();
		}
	};

	return (
		<div>
			<h3 className="mb-4 d-none d-md-block">배너 생성</h3>
			<div className="admin-container">

				<div style={{ display: "flex" }}>
					<div className="admin-content">
						<form onSubmit={handleSubmit} className="admin-form">
							<ul>
								<li>
									<label>행사 정보</label>
									<input
										type="text"
										name="eventInfo"
										value={bannerInfo.eventInfo}
										readOnly
									/>
									<button
										type="button"
										className="admin-button"
										onClick={handleOpenModal}
									>
										검색
									</button>
								</li>
								<li>
									<label>배너 대표색</label>
									<div className="admin-color-picker-container">
										<input
											className="admin-form-input"
											type="text"
											name="bannerColor"
											value={bannerInfo.bannerColor}
											onChange={handleBannerInputChange}
										/>
										<div style={{ position: "relative" }}>
											<button
												type="button"
												className="admin-button"
												style={{
													backgroundColor: bannerInfo.bannerColor,
													color: getContrastColor(bannerInfo.bannerColor),
												}}
												onClick={toggleColorPicker}
											>
												색상 선택
											</button>
											{showColorPicker && (
												<div className="admin-color-picker-popup" style={{ left: "0", top: "50px" }}>
													<HexColorPicker
														color={bannerInfo.bannerColor}
														onChange={handleColorChange}
													/>
													<button
														onClick={toggleColorPicker}
														className="admin-button"
														style={{ width: "90%", marginTop: "5px" }}
													>
														닫기
													</button>
												</div>
											)}
										</div>
									</div>
								</li>
								<li>
									<label>시작일</label>
									<input
										className="admin-form-input"
										type="date"
										name="startDate"
										value={bannerInfo.startDate}
										onChange={handleBannerInputChange}
									/>
								</li>
								<li>
									<label>종료일</label>
									<input
										className="admin-form-input"
										type="date"
										name="endDate"
										value={bannerInfo.endDate}
										onChange={handleBannerInputChange}
									/>
								</li>
								<li>
									<label>이미지</label>
									<input
										type="file"
										ref={fileInputRef}
										accept="image/*"
										onChange={handleImageChange}
									/>
									{selectedImage && (
										<div className="admin-image-preview">
											<img src={selectedImage} alt="Preview" />
										</div>
									)}
								</li>
							</ul>
							<div style={{ display: "flex", justifyContent: "center" }}>
								<button type="submit" className="admin-button">
									등록
								</button>
								<button
									type="reset"
									className="admin-button"
									onClick={() => {
										setBannerInfo({
											eventInfo: "",
											startDate: "",
											endDate: "",
											bannerColor: "#ffffff",
											file: null,
											eventNo: null,
										});
										setSelectedImage(null);
										if (fileInputRef.current) {
											fileInputRef.current.value = "";
										}
									}}
									style={{ backgroundColor: "#f1c40f", marginLeft: "10px" }}
								>
									초기화
								</button>
								<button
									type="button"
									className="admin-button"
									onClick={() => navigate("/admin/bannerList")}
									style={{ backgroundColor: "#7f8c8d", marginLeft: "10px" }}
								>
									취소
								</button>
							</div>
						</form>
					</div>

					{isModalOpen && (
						<div className="admin-modal-overlay" onClick={handleCloseModal}>
							<div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
								<div className="admin-modal-header">
									<h4>행사 검색</h4>
									<button
										type="button"
										className="admin-button"
										onClick={handleCloseModal}
										style={{ backgroundColor: "#e74c3c", padding: "5px 10px" }}
									>
										닫기
									</button>
								</div>
								<div className="admin-modal-body">
									<form className="admin-form">
										<section>
											<div className="left">
												<ul>
													<li>이벤트이름</li>
													<li>시작 날짜</li>
													<li>주소</li>
												</ul>
											</div>
											<div className="right">
												<ul>
													<li>
														<input
															className="admin-form-input"
															type="text"
															name="title"
															value={searchParams.title}
															onChange={handleSearchInputChange}
															onKeyDown={handleKeyDown}
															placeholder="감악산 해맞이 행사"
														/>
													</li>
													<li>
														<input
															className="admin-form-input"
															type="date"
															name="startDate"
															value={searchParams.startDate}
															onChange={handleSearchInputChange}
															onKeyDown={handleKeyDown}
														/>
													</li>
													<li>
														<input
															className="admin-form-input"
															type="text"
															name="addr"
															value={searchParams.addr}
															onChange={handleSearchInputChange}
															onKeyDown={handleKeyDown}
															placeholder="경상남도 거창군 ~~"
														/>
													</li>
												</ul>
											</div>
										</section>
										<div
											style={{
												display: "flex",
												justifyContent: "center",
												marginTop: "10px",
											}}
										>
											<button
												type="button"
												className="admin-button"
												onClick={handleSearchClickModal}
												disabled={isLoading}
											>
												{isLoading ? "검색 중..." : "검색"}
											</button>
											<button
												type="button"
												className="admin-button"
												onClick={handleReset}
												style={{ backgroundColor: "#f1c40f", marginLeft: "10px" }}
											>
												초기화
											</button>
										</div>
									</form>

									{searchResults.length > 0 ? (
										<ul className="admin-search-results" style={{ maxHeight: "300px", overflowY: "auto", paddingRight: "10px" }}>
											{searchResults.map((event) => (
												<li key={event.no} onClick={() => handleSelectEvent(event)}>
													{event.no} - {event.title} - {formatDate(event.startDate)} - {event.addr}
												</li>
											))}
										</ul>
									) : (
										<p style={{ marginTop: "20px" }}>
											{isLoading ? "로딩 중..." : "검색 결과가 없습니다."}
										</p>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default CreateBanner;