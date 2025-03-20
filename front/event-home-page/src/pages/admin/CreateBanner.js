import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "./../../css/adminStyle.css";
import styled from "styled-components";
import { HexColorPicker } from "react-colorful";
import axios from "axios";

const StyledLink = styled(Link)`
  text-decoration: none;
  &:link,
  &:visited,
  &:active {
    color: black;
  }
  &:hover {
    color: blue;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 70%;
  max-width: 800px;
`;

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
    console.log("검색어=>", searchParams);
    try {
      const response = await axios.post(
        "http://localhost:9988/banner/searchEvents",
        searchParams
      );
      console.log("응답 데이터=>", response.data);
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
      const fileUpload = await axios.post(
        "http://localhost:9988/file-system/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const response = await axios.post(
        "http://localhost:9988/banner/create",
        {
          eventNo: bannerInfo.eventNo,
          title: searchParams.title,
          startDate: bannerInfo.startDate + "T00:00:00",
          endDate: bannerInfo.endDate + "T23:59:59",
          color: bannerInfo.bannerColor,
          fileId: fileUpload.data[0].imageId,
          status: bannerInfo.status,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 폼 기본 제출 방지
      handleSearchClickModal(); // 검색 함수 실행
    }
  };

  const inputStyle = { margin: "10px", width: "350px", height: "35px" };
  const buttonStyle = { margin: "10px", height: "35px" };

  return (
    <div className="container">
      <h1>관리자 페이지</h1>
      <div style={{ display: "flex" }}>
        <div
          className="left"
          style={{
            backgroundColor: "#E7F0FF",
            width: "250px",
            height: "200px",
          }}
        >
          <ul>
            <li style={{ margin: "20px", fontSize: "20px" }}>
              <StyledLink to="/admin/memberList">회원 정보 조회</StyledLink>
            </li>
            <li style={{ margin: "20px", fontSize: "20px" }}>
              <StyledLink to="/admin/withdrawalList">회원 탈퇴 명단</StyledLink>
            </li>
            <li style={{ margin: "20px", fontSize: "20px" }}>
              <StyledLink to="/admin/bannerList">배너관리</StyledLink>
            </li>
          </ul>
        </div>
        <div className="right" style={{ flex: 1, padding: "30px" }}>
          <form onSubmit={handleSubmit} className="BannerForm">
            <ul>
              <li style={{ margin: "10px" }}>
                행사 정보
                <span style={{ marginLeft: "50px", marginRight: "50px" }}>
                  {" "}
                  |{" "}
                </span>
                <input
                  type="text"
                  name="eventInfo"
                  style={inputStyle}
                  readOnly
                  value={bannerInfo.eventInfo}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  style={buttonStyle}
                  onClick={handleOpenModal}
                >
                  검색
                </button>
              </li>
              <li style={{ margin: "10px" }}>
                배너 대표색
                <span style={{ marginLeft: "34px", marginRight: "50px" }}>
                  {" "}
                  |{" "}
                </span>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <input
                    type="text"
                    name="bannerColor"
                    style={inputStyle}
                    value={bannerInfo.bannerColor}
                    onChange={handleBannerInputChange}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      ...buttonStyle,
                      backgroundColor: bannerInfo.bannerColor,
                    }}
                    onClick={toggleColorPicker}
                  >
                    색상
                  </button>
                  {showColorPicker && (
                    <div
                      style={{
                        position: "absolute",
                        zIndex: 1000,
                        marginTop: "5px",
                        left: "380px",
                      }}
                    >
                      <HexColorPicker
                        color={bannerInfo.bannerColor}
                        onChange={handleColorChange}
                      />
                      <button
                        onClick={toggleColorPicker}
                        style={{ marginTop: "10px", width: "100%" }}
                      >
                        닫기
                      </button>
                    </div>
                  )}
                </div>
              </li>
              <li style={{ margin: "10px" }}>
                시작일
                <span style={{ marginLeft: "72px", marginRight: "50px" }}>
                  {" "}
                  |{" "}
                </span>
                <input
                  type="date"
                  name="startDate"
                  style={inputStyle}
                  value={bannerInfo.startDate}
                  onChange={handleBannerInputChange}
                />
              </li>
              <li style={{ margin: "10px" }}>
                종료일
                <span style={{ marginLeft: "72px", marginRight: "50px" }}>
                  {" "}
                  |{" "}
                </span>
                <input
                  type="date"
                  name="endDate"
                  style={inputStyle}
                  value={bannerInfo.endDate}
                  onChange={handleBannerInputChange}
                />
              </li>
              <li style={{ margin: "10px" }}>
                이미지
                <span style={{ marginLeft: "72px", marginRight: "50px" }}>
                  {" "}
                  |{" "}
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {selectedImage && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      src={selectedImage}
                      alt="Preview"
                      style={{ maxWidth: "200px", maxHeight: "200px" }}
                    />
                  </div>
                )}
              </li>
            </ul>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {/* 등록 버튼 */}
              <button
                type="submit"
                className="btn btn-primary"
                style={buttonStyle}
              >
                등록
              </button>

              {/* 초기화 버튼 (이전 취소 버튼 기능 유지) */}
              <button
                type="reset"
                className="btn btn-warning"
                style={buttonStyle}
                onClick={() =>
                  setBannerInfo({
                    eventInfo: "",
                    startDate: "",
                    endDate: "",
                    bannerColor: "#ffffff",
                    file: null,
                    eventNo: null,
                  })
                }
              >
                초기화
              </button>

              {/* 취소 버튼 (배너 리스트 페이지로 이동) */}
              <button
                type="button"
                className="btn btn-secondary"
                style={buttonStyle}
                onClick={() => navigate("/admin/bannerList")}
              >
                취소
              </button>
            </div>
          </form>
        </div>

        <ModalOverlay isOpen={isModalOpen} onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>행사 검색</h4>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <section style={{ display: "flex" }}>
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
                          type="text"
                          name="title"
                          value={searchParams.title}
                          onChange={handleSearchInputChange}
                          onKeyDown={handleKeyDown} // ✅ Enter 감지 추가
                          placeholder="잠실 벚꽃 축제"
                        />
                      </li>
                      <li>
                        <input
                          type="date"
                          name="startDate"
                          value={searchParams.startDate}
                          onChange={handleSearchInputChange}
                          onKeyDown={handleKeyDown} // ✅ Enter 감지 추가
                        />
                      </li>
                      <li>
                        <input
                          type="text"
                          name="addr"
                          value={searchParams.addr}
                          onChange={handleSearchInputChange}
                          onKeyDown={handleKeyDown} // ✅ Enter 감지 추가
                          placeholder="서울시"
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
                    className="btn btn-primary"
                    onClick={handleSearchClickModal}
                    disabled={isLoading}
                  >
                    {isLoading ? "검색 중..." : "검색"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={handleReset}
                    style={{ marginLeft: "10px" }}
                  >
                    초기화
                  </button>
                </div>
              </form>

              {searchResults.length > 0 ? (
                <ul
                  style={{
                    marginTop: "20px",
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  {searchResults.map((event) => (
                    <li
                      key={event.no}
                      onClick={() => handleSelectEvent(event)}
                      style={{
                        cursor: "pointer",
                        padding: "5px",
                        borderBottom: "1px solid #ccc",
                      }}
                    >
                      {event.no} - {event.title} - {formatDate(event.startDate)}{" "}
                      - {event.addr}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ marginTop: "20px" }}>
                  {isLoading ? "로딩 중..." : "검색 결과가 없습니다."}
                </p>
              )}
            </div>
          </ModalContent>
        </ModalOverlay>
      </div>
    </div>
  );
}

export default CreateBanner;
