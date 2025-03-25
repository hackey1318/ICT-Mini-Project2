"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import moment from "moment"
import "../eventCss/EventView.css"
import axios from "axios"
import "../css/replyList.css"
import addFile from "../img/plus.jpg"
import "../css/replyModal.css"

import edit from "../img/edit.jpg"
import del from "../img/del.jpg"

import apiClient from "../js/axiosConfig"
import apiNoAccessClient from "./../js/axiosConfigNoAccess"
import apiFileClient from './../js/axiosFileConfig';
import ErrorModal from "../pages/common/ErrorModal"

function EventView() {
	const [eventData, setEventData] = useState({})
	const { no } = useParams()
	const mapRef = useRef(null)
	const navigate = useNavigate()
	const [title, setTitle] = useState("")
	const [content, setContent] = useState("")
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [replies, setReplies] = useState([])
	const [userInfo, setUserInfo] = useState({})
	const [imageIdList, setImageIdList] = useState([])
	const runfile = useRef([]) //type==file실행 준비 및 사진 갯수제한용
	const [isOverviewExpanded, setIsOverviewExpanded] = useState(false)
	const [selectedImageIndex, setSelectedImageIndex] = useState(null)
	const [uniqueImages, setUniqueImages] = useState([])
	const accessToken = sessionStorage.getItem("accessToken")
	const userNo = sessionStorage.getItem("userNo")
	const [favorites, setFavorites] = useState(0)
	const [showError, setShowError] = useState(false)
	const [showErrorModal, setShowErrorModal] = useState(false)

	const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
	const [selectedReviewImages, setSelectedReviewImages] = useState([])
	const [currentReviewImageIndex, setCurrentReviewImageIndex] = useState(0)
	const [activeReply, setActiveReply] = useState(null)

	// Add state for edit mode
	const [isEditMode, setIsEditMode] = useState(false)
	const [replyToEdit, setReplyToEdit] = useState(null)

	useEffect(() => {
		window.scrollTo(0, 0); // 페이지 로드 시 최상단으로 이동
	}, []);

	useEffect(() => {
		const fetchEvent = async () => {
			try {
				const response = await apiNoAccessClient.get(`/api/events/${no}`)
				setEventData(response.data)
			} catch (error) {
				console.error("Error fetching event:", error)
			}
			const handleEscClose = (event) => {
				if (event.keyCode === 27) {
					if (selectedImageIndex !== null) {
						closeEventModal()
					}
					if (isReviewModalOpen) {
						closeReviewModal()
					}
					if (isEditMode) {
						setIsEditMode(false)
					}
				}
			}

			const uniqueImageUrls = new Set()
			const newUniqueImages = []
			if (eventData?.img_list) {
				eventData?.img_list.forEach((item) => {
					if (!uniqueImageUrls.has(item.originImgurl)) {
						newUniqueImages.push(item)
						uniqueImageUrls.add(item.originImgurl)
					}
				})
				setUniqueImages(newUniqueImages)
			}
			window.addEventListener("keydown", handleEscClose)
			return () => {
				window.removeEventListener("keydown", handleEscClose)
			}
		}

		fetchEvent()
	}, [no, selectedImageIndex])

	//후기리스트
	useEffect(() => {
		const callList = async () => {
			try {
				const listData = await apiNoAccessClient.get("/reply/getReplies", {
					params: { eventNo: no },
				})
				setReplies(listData.data)

				const userData = await apiClient.get("/auth/user")

				setUserInfo(userData.data)

				const likeData = await apiClient.get(`/like/${no}`)

				if (likeData.data["result"] === true) {
					setFavorites(no)
				}
			} catch (error) {
				console.error("Error fetching replies : ", error)
			}
		}
		callList()
	}, [])

	useEffect(() => {
		if (eventData && eventData.img_list) {
			const uniqueImageUrls = new Set()
			const newUniqueImages = []
			// uniqueImages에 이미지를 넣는 코드
			eventData.img_list.forEach((item) => {
				if (!uniqueImageUrls.has(item.originImgurl)) {
					newUniqueImages.push(item)
					uniqueImageUrls.add(item.originImgurl)
				}
			})
			setUniqueImages(newUniqueImages)
		}
	}, [eventData])

	useEffect(() => {
		if (eventData && mapRef.current && isOverviewExpanded) {
			const script = document.createElement("script")
			script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=524cacda57ca0207d9837c45039f39bb&libraries=services,clusterer,drawing&autoload=false`
			script.async = true
			document.head.appendChild(script)

			script.onload = () => {
				window.kakao.maps.load(() => {
					const container = mapRef.current
					const options = {
						center: new window.kakao.maps.LatLng(eventData.lat, eventData.lng),
						level: 3,
						draggable: true, // 드래그로 지도 이동 막기
						disableDoubleClickZoom: true, // 더블클릭 확대/축소 막기
						scrollwheel: true, // 스크롤 휠 확대/축소 막기
						disableDoubleClick: true, // 더블 클릭 이벤트 막기
					}
					const map = new window.kakao.maps.Map(container, options)

					const markerPosition = new window.kakao.maps.LatLng(eventData.lat, eventData.lng)
					const marker = new window.kakao.maps.Marker({
						position: markerPosition,
					})
					marker.setMap(map)
				})
			}
		}
	}, [eventData, isOverviewExpanded])

	const toggleOverview = () => {
		setIsOverviewExpanded(!isOverviewExpanded)
	}

	//홈페이지 태그제거
	const removeTags = (str) => {
		if (str === null || str === "") return false
		else str = str.toString()

		return str.replace(/(<([^>]+)>)/gi, "")
	}
	//overview 부분 br태그제거
	const removeBrTags = (text) => {
		return text.replace(/<br\s*\/?>/gi, "")
	}

	// 홈페이지 URL
	const extractUrl = (str) => {
		const cleanedString = removeTags(str)
		try {
			//url생성
			new URL(cleanedString)
			return cleanedString
		} catch (e) {
			return null
		}
	}

	const openEventModal = (index) => {
		setSelectedImageIndex(index)
	}

	const openReviewModal = (reply, index) => {
		if (reply && reply.imageIdList && reply.imageIdList.length > 0) {
			setActiveReply(reply)
			setSelectedReviewImages(reply.imageIdList)
			setCurrentReviewImageIndex(index || 0)
			setIsReviewModalOpen(true)
		}
	}

	const closeEventModal = () => {
		setSelectedImageIndex(null)
	}

	const closeReviewModal = () => {
		setIsReviewModalOpen(false)
		setSelectedReviewImages([])
		setCurrentReviewImageIndex(0)
		setActiveReply(null)
	}

	const previousEventImage = () => {
		setSelectedImageIndex((prevIndex) => {
			if (prevIndex > 0) {
				return prevIndex - 1
			} else {
				return uniqueImages.length - 1
			}
		})
	}

	const nextEventImage = () => {
		setSelectedImageIndex((prevIndex) => {
			if (prevIndex < uniqueImages.length - 1) {
				return prevIndex + 1
			} else {
				return 0
			}
		})
	}

	const previousReviewImage = () => {
		setCurrentReviewImageIndex((prevIndex) => {
			if (prevIndex > 0) {
				return prevIndex - 1
			} else {
				return selectedReviewImages.length - 1
			}
		})
	}

	const nextReviewImage = () => {
		setCurrentReviewImageIndex((prevIndex) => {
			if (prevIndex < selectedReviewImages.length - 1) {
				return prevIndex + 1
			} else {
				return 0
			}
		})
	}

	function handleEditClick(reply) {
		setReplyToEdit(reply)
		setIsEditMode(true)
		setTitle(reply.title)
		setContent(reply.content)
		setIsModalOpen(true)

		// Clear any existing images in the modal
		const imgList = document.querySelector(".imgList")
		if (imgList) {
			while (imgList.firstChild) {
				imgList.removeChild(imgList.firstChild)
			}
		}

		// Add existing images to the modal
		if (reply.imageIdList && reply.imageIdList.length > 0) {
			setTimeout(() => {
				const imgList = document.querySelector(".imgList")
				reply.imageIdList.forEach((imageId) => {
					const div = document.createElement("div")
					div.style.backgroundImage = `url(http://192.168.1.252:9988/file-system/download/${imageId})`
					div.style.cursor = "pointer"
					div.addEventListener("click", delImg)
					div.dataset.imageId = imageId
					imgList.appendChild(div)
				})
			}, 0)
		}
	}

	const handleEditComplete = () => {
		setIsEditMode(false)
		setReplyToEdit(null)

		// Refresh the replies list
		const callList = async () => {
			try {
				const listData = await apiNoAccessClient.get("/reply/getReplies", {
					params: { eventNo: no },
				})
				setReplies(listData.data)
			} catch (error) {
				console.error("Error fetching replies : ", error)
			}
		}
		callList()
	}

	const BackButton = () => {
		navigate("/")
	}
	//모달창 함수
	//후기 제목 함수
	function setTitleValue(event) {
		setTitle(event.target.value)
	}

	//후기 내용 함수
	function setContentValue(event) {
		setContent(event.target.value)
	}

	async function addReply(event, replyNo) {
		event.preventDefault()

		const replyData = {
			eventNo: no,
			title: title,
			content: content,
			imageIdList: [],
		}

		const formData = new FormData()
		const isFile = runfile.current.files.length > 0

		// Get existing image IDs from the modal
		const imgList = document.querySelector(".imgList")
		const existingImageIds = []
		if (imgList) {
			imgList.querySelectorAll("div").forEach((div) => {
				if (div.dataset.imageId) {
					existingImageIds.push(div.dataset.imageId)
				}
			})
		}

		if (isFile) {
			for (let i = 0; i < runfile.current.files.length; i++) {
				formData.append("files", runfile.current.files[i])
			}
			const fileUpload = await apiFileClient.post("/file-system/upload", formData, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "multipart/form-data",
				},
			})
			replyData.imageIdList = [...existingImageIds, ...fileUpload.data.map((item) => item.imageId)]
		} else {
			replyData.imageIdList = existingImageIds
		}

		const endpoint = isEditMode ? `/reply/editReply/${replyNo}` : "/reply/addReply"

		apiClient
			.post(endpoint, replyData)
			.then((response) => {
				if (response.data["result"] === false) {
					alert("등록에 실패하였습니다.")
					return false
				}

				setIsModalOpen(false)
				setTitle("")
				setContent("")
				setIsEditMode(false)
				setReplyToEdit(null)

				// Update the replies state correctly
				const callList = async () => {
					try {
						const listData = await apiNoAccessClient.get("/reply/getReplies", {
							params: { eventNo: no },
						})
						setReplies(listData.data)
					} catch (error) {
						console.error("Error fetching replies : ", error)
					}
				}
				callList()
			})
			.catch((error) => {
				console.log(error)
				if (error.status === 403) {
					setShowErrorModal(true)
				}

			})
	}

	function runInputFile() {
		//type=file 실행
		if (runfile.current) {
			runfile.current.click() //file 선택창 열기
		}

		if (!runfile.current.hasChangeListener) {
			runfile.current.addEventListener("change", (event) => {
				const files = event.target.files
				const imgList = document.querySelector(".imgList")
				const maxImage = 3

				const existingImages = imgList.querySelectorAll("div").length
				for (let i = 0; i < files.length; i++) {
					if (existingImages + i >= maxImage) {
						alert("이미지는 3개까지 첨부해주세요.")
						event.target.value = ""
						break
					}
					const reader = new FileReader()
					reader.onload = (e) => {
						//div에 이미지 추가
						const div = document.createElement("div")
						div.style.backgroundImage = `url(${e.target.result})`
						div.style.cursor = "pointer"
						div.addEventListener("click", delImg)

						imgList.appendChild(div)
					}
					reader.readAsDataURL(files[i])
				}
			})
			runfile.current.hasChangeListener = true
		}
	}

	function opacityController() {
		const div = document.getElementById("plus-container")
		div.style.opacity = 1
		div.style.transition = "all, 500ms"
	}

	function opacityController2() {
		const div = document.getElementById("plus-container")
		div.style.opacity = 0.3
		div.style.transition = "all, 500ms"
	}

	function delImg(event) {
		//올리는 이미지 클릭시 제거
		const imgDiv = event.target
		const imgList = document.querySelector(".imgList")

		if (imgList.contains(imgDiv)) {
			imgList.removeChild(imgDiv)
		}
	}

	function ReviewDelete(no) {
		if (window.confirm("글을 삭제하시겠습니까?")) {
			apiClient
				.get(`/reply/replyDel/${no}`)
				.then((response) => {
					if (response.data == "deleted") {
						setReplies((prev) => prev.filter((reply) => reply.no !== no))
						alert("삭제가 완료되었습니다.")
					} else {
						alert("삭제를 실패했습니다.")
					}
				})
				.catch((error) => {
					console.log(error)
					if (error.status === 403) {
						setShowErrorModal(true)
					}
				})
		}
	}

	const toggleFavorite = async (itemNo) => {
		try {
			const response = await apiClient.patch(`/like/${itemNo}`,{})

			if (!response.data) {
				throw new Error("찜 업데이트에 실패했습니다.")
			}

			if (favorites === itemNo) {
				setFavorites(0)
			} else {
				setFavorites(itemNo)
			}
		} catch (err) {
			if (err.response.status === 403) {
				setShowError(true)
			}
		}
	}

	// Function to handle review image click
	const handleReviewImageClick = (reply, index) => {
		openReviewModal(reply, index)
	}

	return (
		<div className="event-view-container">
			<ErrorModal show={showErrorModal} onClose={() => setShowErrorModal(false)} />
			<div className="content-wrapper">
				<button className="back-button" onClick={BackButton}>
					<span>🠔</span>
				</button>
				<div className="event-title">
					{eventData.title}
					<button className="btn" onClick={() => toggleFavorite(no)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="25"
							height="25"
							viewBox="0 0 25 25"
							fill={favorites === no ? "red" : "none"}
							stroke="red"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
						</svg>
					</button>
				</div>
				<div className="event-image" onClick={() => openEventModal(0)}>
					{eventData.img_list && eventData.img_list[0] && eventData.img_list[0].originImgurl ? (
						<img src={eventData.img_list[0].originImgurl || "/placeholder.svg"} alt={eventData.title} />
					) : (
						<div>No Image</div>
					)}
				</div>
				<div className="small-images">
					{eventData.img_list &&
						uniqueImages.map((item, idx) => {
							return (
								idx !== 0 && (
									<img
										key={item.no}
										src={item.originImgurl || "/placeholder.svg"}
										alt={`small_${idx}`}
										onClick={() => openEventModal(idx)}
									/>
								)
							)
						})}
				</div>
				<hr />
				<div className="event-info">
					<p>
						<strong>
							{moment(eventData.startDate).format("YYYY.MM.DD")} ~ {moment(eventData.endDate).format("YYYY.MM.DD")}
						</strong>
					</p>
					<p>
						<strong>{eventData.addr}</strong>
					</p>
					<div className={`overview-container ${isOverviewExpanded ? "expanded" : ""}`}>
						<p className="overview-text">{removeBrTags(eventData?.overView || "")}</p>
						{!isOverviewExpanded ? (
							<button className="overview-toggle-button" onClick={toggleOverview}>
								▼
							</button>
						) : (
							<div className="event-info2">
								<>
									<p>주최 : {eventData.telName}</p>
									<p>전화번호 : {eventData.tel}</p>
									{eventData.homePage && (
										<p>
											홈페이지 : {(() => {
												const url = extractUrl(eventData.homePage)
												return url ? (
													<a href={url} target="_blank" rel="noopener noreferrer">
														{url}
													</a>
												) : (
													"홈페이지가 없습니다."
												)
											})()}
										</p>
									)}
									{isOverviewExpanded && <div id="kakao-map" ref={mapRef}></div>}
									<div className="centered-button">
										<button className="overview-toggle-button" onClick={toggleOverview}>
											▲
										</button>
									</div>
								</>
							</div>
						)}
					</div>
				</div>
			</div>

			{selectedImageIndex !== null && (
				<div className="modal-overlay" onClick={closeEventModal}>
					\
					<button className="modal-close-button" onClick={closeEventModal}>
						<p className="modal-close-x">X</p>
					</button>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						<img
							src={uniqueImages[selectedImageIndex]?.originImgurl || "/placeholder.svg"}
							alt={eventData.title}
							className="modal-image"
						/>
						<div className="modal-button">
							<button className="modal-nav-button prev" onClick={previousEventImage}>
								<img src={require("../img/backbutton.png") || "/placeholder.svg"} alt="Previous" />
							</button>
							<button className="modal-nav-button next" onClick={nextEventImage}>
								<img src={require("../img/nextbutton.png") || "/placeholder.svg"} alt="Next" />
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Review Image Modal - Completely separate modal */}
			{isReviewModalOpen && (
				<div className="modal-overlay" style={{ zIndex: 1000 }} onClick={closeReviewModal}>
					<button className="modal-close-button" onClick={closeReviewModal}>
						<p className="modal-close-x">X</p>
					</button>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						<img
							src={`http://192.168.1.252:9988/file-system/download/${selectedReviewImages[currentReviewImageIndex]}`}
							alt={`Review image ${currentReviewImageIndex + 1}`}
							className="modal-image"
						/>
						{selectedReviewImages.length > 1 && (
							<div className="modal-button">
								<button className="modal-nav-button prev" onClick={previousReviewImage}>
									<img src={require("../img/backbutton.png") || "/placeholder.svg"} alt="Previous" />
								</button>
								<button className="modal-nav-button next" onClick={nextReviewImage}>
									<img src={require("../img/nextbutton.png") || "/placeholder.svg"} alt="Next" />
								</button>
							</div>
						)}
					</div>
				</div>
			)}

			<hr style={{ maxWidth: "850px", margin: "20px auto" }} />

			<div className="replies">
				<p style={{ fontSize: "2em" }}>Review</p>
				{accessToken && (
					<input type="button" id="openWriteForm" value="후기쓰기" onClick={() => setIsModalOpen(true)} />
				)}

				<div className="list-container">
					{Array.isArray(replies) && replies.length > 0 ? (
						replies
							.filter((reply) => reply.status !== "DELETE")
							.map((reply) => (
								<div className="replyList" key={reply.no}>
									<ul>
										<li id="username">작성자 : {reply.name}</li>
										{reply.userNo === userInfo.no && (
											<>
												<li>
													<img
														src={edit || "/placeholder.svg"}
														className="editor1"
														title="수정"
														onClick={() => handleEditClick(reply)}
													/>
												</li>
												<li>
													<img
														src={del || "/placeholder.svg"}
														className="editor2"
														title="삭제"
														onClick={() => ReviewDelete(reply.no)}
													/>
												</li>
											</>
										)}
									</ul>
									<div id="title-container">
										<ul>
											<li id="date">작성일 : {moment(reply.createdAt).format("YYYY.MM.DD")}</li>
											<li>
												<div id="img-container">
													{reply.imageIdList &&
														reply.imageIdList.length > 0 &&
														reply.imageIdList.map((imageId, index) => {
															const imageUrl = `http://192.168.1.252:9988/file-system/download/${imageId}`
															return (
																<img
																	key={imageId}
																	src={imageUrl || "/placeholder.svg"}
																	onClick={() => handleReviewImageClick(reply, index)}
																/>
															)
														})}
												</div>
											</li>
											<li id="title">제목 : {reply.title}</li>
											<li id="content">{reply.content}</li>
										</ul>
									</div>
								</div>
							))
					) : (
						<div>댓글이 없습니다.</div>
					)}
				</div>

				{isModalOpen && (
					<div
						className="modalContainer"
						style={{ width: "100%", height: "100%", margin: "10% 10% 0", backgroundColor: "#gray", opacity: "1" }}
					>
						<div className="writeForm">
							<form onSubmit={(event) => addReply(event, replyToEdit?.no)}>
								<input
									type="text"
									className="write-space"
									placeholder="제목을 입력해주세요."
									name="title"
									value={title}
									onChange={setTitleValue}
									autoFocus
								/>
								<br />
								<textarea
									type="text"
									className="festival-modal-textarea"
									placeholder="후기내용을 입력하세요"
									value={content}
									onChange={setContentValue}
								/>

								<label style={{ fontSize: "0.7em", position: "relative", left: "20px", top: "15px" }}>
									사진첨부(최대 3장)
								</label>
								<br />
								<input
									type="file"
									multiple
									ref={runfile}
									style={{ position: "relative", left: "10px", top: "-5px", opacity: "0", width: "65%" }}
								/>

								<div
									id="plus-container"
									onMouseOver={opacityController}
									onMouseOut={opacityController2}
									onClick={runInputFile}
								></div>
								<img
									src={addFile || "/placeholder.svg"}
									id="addFile"
									style={{ cursor: "pointer" }}
									onMouseOver={opacityController}
									onMouseOut={opacityController2}
									onClick={runInputFile}
								/>

								<div className="imgList"></div>

								<input type="submit" value={isEditMode ? "수 정" : "등 록"} />
								<input
									type="button"
									value="취 소"
									onClick={() => {
										setIsModalOpen(false)
										setTitle("")
										setContent("")
										setIsEditMode(false)
										setReplyToEdit(null)
									}}
								/>
							</form>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default EventView

