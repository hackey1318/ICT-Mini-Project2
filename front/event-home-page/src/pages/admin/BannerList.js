import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { HexColorPicker } from "react-colorful";
import "./../../css/admin.css";

function BannerList() {
  const [bannerData, setBannerData] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [nowPage, setNowPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 5;
  const mounted = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [formData, setFormData] = useState({
    eventNo: "",
    fileId: "",
    color: "",
    startDate: "",
    endDate: "",
  });
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (!mounted.current || location.state?.refresh) {
      mounted.current = true;
      getBannerList(1);
    }
  }, [location.state?.refresh]);

  function getBannerList(page) {
    let url = `http://localhost:9988/banner/bannerList?page=${page}&size=${pageSize}`;
    if (searchWord) {
      url += `&searchWord=${searchWord}`;
    }
    axios
      .get(url)
      .then((response) => {
        const banners = response.data.list || [];
        setBannerData(
          banners.map((record) => ({
            no: record.no,
            title: record.title || record.eventNo,
            color: record.color,
            startDate: record.startDate.split("T")[0],
            endDate: record.endDate.split("T")[0],
            imageUrl: record.fileId,
            eventNo: record.eventNo,
            fileId: record.fileId,
          }))
        );
        const pageInfo = response.data.pageInfo;
        setNowPage(pageInfo.nowPage);
        setTotalPage(pageInfo.totalPage);
        setTotalCount(pageInfo.totalCount);
      })
      .catch((error) => {
        console.error("배너 목록 조회 오류:", error);
      });
  }

  const handleCreateBanner = () => {
    navigate("/admin/createBanner");
  };

  const handleEditBanner = (banner) => {
    setSelectedBanner(banner);
    setFormData({
      eventNo: banner.eventNo,
      fileId: banner.fileId,
      color: banner.color,
      startDate: banner.startDate,
      endDate: banner.endDate,
    });
    setShowColorPicker(false);
    setIsModalOpen(true);
  };

  const handleDeleteBanner = (no) => {
    if (window.confirm("정말로 이 배너를 삭제하시겠습니까?")) {
      axios
        .delete(`http://localhost:9988/banner/delete/${no}`)
        .then(() => {
          alert("배너가 삭제되었습니다.");
          getBannerList(nowPage);
          if (bannerData.length === 1 && nowPage > 1) {
            getBannerList(nowPage - 1);
          }
        })
        .catch((error) => {
          console.error("배너 삭제 오류:", error);
          alert("배너 삭제에 실패했습니다.");
        });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBanner(null);
    setFormData({ eventNo: "", fileId: "", color: "", startDate: "", endDate: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updatedBanner = {
      eventNo: formData.eventNo,
      fileId: formData.fileId,
      color: formData.color,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };
    axios
      .put(`http://localhost:9988/banner/update/${selectedBanner.no}`, updatedBanner)
      .then(() => {
        alert("배너가 수정되었습니다.");
        handleModalClose();
        getBannerList(nowPage);
      })
      .catch((error) => {
        console.error("배너 수정 오류:", error);
        alert("배너 수정에 실패했습니다.");
      });
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxButtons = 5;
    let startPage = Math.max(1, nowPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPage, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div>
      <h3 className="mb-4 d-none d-md-block">배너 목록</h3>
      <div style={{ display: "flex" }}>

        <div className="admin-content">
          <div className="admin-search-container">
            <label className="admin-form-label">제목:</label>
            <input
              className="admin-search-input"
              type="text"
              placeholder="배너 제목 입력"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
            />
            <button className="admin-button" onClick={() => getBannerList(1)}>
              검색
            </button>
          </div>
          <div
            className="admin-table-header"
            style={{ gridTemplateColumns: "repeat(7, 1fr)" }}
          >
            <div>번호</div>
            <div>제목</div>
            <div>시작일</div>
            <div>종료일</div>
            <div>이미지</div>
            <div>대표색</div>
            <div>관리</div>
          </div>
          {bannerData.map((record) => (
            <div
              key={record.no}
              className="admin-table-row"
              style={{ gridTemplateColumns: "repeat(7, 1fr)", height: "80px" }}
            >
              <div>{record.no}</div>
              <div>{record.title}</div>
              <div>{record.startDate}</div>
              <div>{record.endDate}</div>
              <div>
                <img
                  className="admin-table-image"
                  src={`http://localhost:9988/file-system/download/${record.imageUrl}`}
                  alt="배너 이미지"
                />
              </div>
              <div style={{ backgroundColor: record.color, padding: "5px", borderRadius: "5px", height: "30px" }}>{record.color}</div>
              <div>
                <button className="admin-action-button admin-edit-button" onClick={() => handleEditBanner(record)}>수정</button>
                <button className="admin-action-button admin-delete-button" onClick={() => handleDeleteBanner(record.no)}>삭제</button>
              </div>
            </div>
          ))}
          <div className="admin-pagination">
            {nowPage > 1 && (
              <span className="admin-page-item">
                <a className="admin-page-link" onClick={() => getBannerList(nowPage - 1)}>
                  Previous
                </a>
              </span>
            )}
            {getPageNumbers().map((pg) => (
              <span key={pg} className="admin-page-item">
                <a
                  className={`admin-page-link ${nowPage === pg ? "active" : ""}`}
                  onClick={() => getBannerList(pg)}
                >
                  {pg}
                </a>
              </span>
            ))}
            {nowPage < totalPage && (
              <span className="admin-page-item">
                <a className="admin-page-link" onClick={() => getBannerList(nowPage + 1)}>
                  Next
                </a>
              </span>
            )}
          </div>
          <div className="button-container">
            <button className="admin-button" onClick={handleCreateBanner}>배너 생성</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <div className="admin-modal-header">배너 수정</div>
            <form className="admin-modal-form" onSubmit={handleSave}>
              <div className="admin-form-group">
                <label className="admin-form-label">번호</label>
                <input className="admin-form-input" type="text" name="eventNo" value={formData.eventNo} readOnly />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">시작일</label>
                <input className="admin-form-input" type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">종료일</label>
                <input className="admin-form-input" type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">파일 ID</label>
                <input className="admin-form-input" type="text" name="fileId" value={formData.fileId} onChange={handleInputChange} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">배경색</label>
                <div className="admin-color-picker-container">
                  <input className="admin-form-input" type="text" name="color" value={formData.color} onChange={handleInputChange} required />
                  <div style={{ position: "relative" }}>
                    <button className="admin-button" type="button" onClick={() => setShowColorPicker(!showColorPicker)}>색상 선택</button>
                    {showColorPicker && (
                      <div className="admin-color-picker-popup" style={{ top: "70px", left: "0" }}>
                        <HexColorPicker color={formData.color} onChange={(color) => setFormData((prev) => ({ ...prev, color }))} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="admin-modal-buttons">
                <button className="admin-save-button" type="submit">저장</button>
                <button className="admin-cancel-button" type="button" onClick={handleModalClose}>취소</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BannerList;