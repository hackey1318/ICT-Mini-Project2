import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { HexColorPicker } from "react-colorful";

const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  @media (max-width: 768px) {
    max-width: 100%;
    padding: 10px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

const Sidebar = styled.div`
  background-color: #e7f0ff;
  width: 250px;
  height: 200px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const NavItem = styled.li`
  margin: 15px 0;
  font-size: 18px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #333;
  &:hover {
    color: #007bff;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 2fr 2fr 2fr 2fr 2fr;
  background-color: #f5f5f5;
  padding: 10px;
  border-bottom: 2px solid #ddd;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  & > div {
    border-right: 1px solid #ddd;
    padding: 10px;
  }
  & > div:last-child {
    border-right: none;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 2fr 2fr 2fr 2fr 2fr;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  align-items: center;
  &:nth-child(odd) {
    background-color: #ffffff;
  }
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
  &:hover {
    background-color: #f0f0f0;
  }
  & > div {
    border-right: 1px solid #ddd;
    padding: 10px;
    text-align: center;
  }
  & > div:last-child {
    border-right: none;
  }
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  border-radius: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #0056b3;
  }
`;

const ActionButton = styled.button`
  padding: 5px 10px;
  margin-right: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
`;

const EditButton = styled(ActionButton)`
  background-color: #28a745;
  color: white;
  &:hover {
    background-color: #218838;
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: #dc3545;
  color: white;
  &:hover {
    background-color: #c82333;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  grid-column: span 2;
`;

const ModalFormGroup = styled.div`
  display: flex;
  flex-direction: column; /* 수직 정렬 */
  gap: 5px;
  width: 100%;
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column; /* 세로 정렬 */
  gap: 15px;
`;

const FormLabel = styled.label`
  font-size: 14px;
  color: #333;
  text-align: left; /* 왼쪽 정렬 */
`;

const FormInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
  height: 40px;
  box-sizing: border-box;
`;

const ColorPickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative; /* 위치 조정 */
`;

const ColorPickerPopup = styled.div`
  position: absolute;
  top: 45px;
  left: 0;
  z-index: 1000;
  background: #fff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;

const ColorPreview = styled.button`
  width: 35px;
  height: 35px;
  border: 1px solid #ccc;
  cursor: pointer;
  border-radius: 4px;
  background-color: ${(props) => props.color || "#fff"};
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  grid-column: span 2;
`;

const SaveButton = styled.button`
  padding: 10px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #218838;
  }
`;

const CancelButton = styled.button`
  padding: 10px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #5a6268;
  }
`;

function BannerList() {
  const [bannerData, setBannerData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({
    eventNo: "",
    fileId: "",
    color: "",
    startDate: "",
    endDate: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorChange = (color) => {
    setFormData((prevFormData) => ({ ...prevFormData, color }));
  };

  useEffect(() => {
    getBannerList();
  }, [location.state?.refresh]);

  function getBannerList() {
    axios
      .get("http://localhost:9988/banner/bannerList")
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

  const handleColorPickerToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowColorPicker((prev) => !prev);
  };

  const handleDeleteBanner = (no) => {
    if (window.confirm("정말로 이 배너를 삭제하시겠습니까?")) {
      axios
        .delete(`http://localhost:9988/banner/delete/${no}`)
        .then(() => {
          alert("배너가 삭제되었습니다.");
          getBannerList();
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
    setFormData({
      eventNo: "",
      fileId: "",
      color: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      .put(
        `http://localhost:9988/banner/update/${selectedBanner.no}`,
        updatedBanner
      )
      .then(() => {
        alert("배너가 수정되었습니다.");
        handleModalClose();
        getBannerList();
      })
      .catch((error) => {
        console.error("배너 수정 오류:", error);
        alert("배너 수정에 실패했습니다.");
      });
  };

  return (
    <Container>
      <Title>배너 목록</Title>
      <div style={{ display: "flex" }}>
        <Sidebar>
          <ul>
            <NavItem>
              <StyledLink to="/admin/memberList">회원 정보 조회</StyledLink>
            </NavItem>
            <NavItem>
              <StyledLink to="/admin/withdrawalList">회원 탈퇴 명단</StyledLink>
            </NavItem>
            <NavItem>
              <StyledLink to="/admin/bannerList">배너관리</StyledLink>
            </NavItem>
          </ul>
        </Sidebar>

        <Content>
          <TableHeader>
            <div>번호</div>
            <div>이름</div>
            <div>시작일</div>
            <div>종료일</div>
            <div>이미지</div>
            <div>색상</div>
            <div>작업</div>
          </TableHeader>
          {bannerData.map((record) => (
            <TableRow key={record.no}>
              <div>{record.no}</div>
              <div>{record.title}</div>
              <div>{record.startDate}</div>
              <div>{record.endDate}</div>
              <div>
                <Image
                  src={`http://localhost:9988/file-system/download/${record.imageUrl}`}
                  alt="배너 이미지"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: record.color,
                  color: "#fff",
                  padding: "10px",
                  textAlign: "center",
                  borderRadius: "5px",
                  width: "80%",
                  margin: "auto",
                }}
              >
                {record.color}
              </div>
              <div>
                <EditButton onClick={() => handleEditBanner(record)}>
                  수정
                </EditButton>
                <DeleteButton onClick={() => handleDeleteBanner(record.no)}>
                  삭제
                </DeleteButton>
              </div>
            </TableRow>
          ))}
        </Content>
      </div>
      <ButtonContainer>
        <Button onClick={handleCreateBanner}>배너 생성</Button>
      </ButtonContainer>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>배너 수정</ModalHeader>
            <ModalForm onSubmit={handleSave}>
              <ModalFormGroup>
                <FormLabel>번호</FormLabel>
                <FormInput
                  type="text"
                  name="eventNo"
                  value={formData.eventNo}
                  readOnly
                />
              </ModalFormGroup>

              <ModalFormGroup>
                <FormLabel>시작일</FormLabel>
                <FormInput
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </ModalFormGroup>

              <ModalFormGroup>
                <FormLabel>종료일</FormLabel>
                <FormInput
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </ModalFormGroup>

              <ModalFormGroup>
                <FormLabel>파일 ID</FormLabel>
                <FormInput
                  type="text"
                  name="fileId"
                  value={formData.fileId}
                  onChange={handleInputChange}
                  required
                />
              </ModalFormGroup>

              <ModalFormGroup>
                <FormLabel>배경색</FormLabel>
                <ColorPickerContainer
                  style={{ position: "relative", width: "100%" }}
                >
                  <FormInput
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        color: e.target.value,
                      }))
                    }
                    required
                    style={{ paddingRight: "40px" }}
                  />

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowColorPicker(!showColorPicker);
                    }}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      backgroundColor: formData.color || "#fff",
                      width: "100px",
                      height: "30px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      cursor: "pointer",
                    }}
                  />
                  {showColorPicker && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "0",
                        zIndex: 1000,
                        background: "#fff",
                        padding: "10px",
                        borderRadius: "8px",
                        boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
                        width: "100%",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <HexColorPicker
                        color={formData.color}
                        onChange={(color) =>
                          setFormData((prev) => ({ ...prev, color }))
                        }
                      />
                    </div>
                  )}
                </ColorPickerContainer>
              </ModalFormGroup>

              <ModalButtons>
                <SaveButton type="submit">저장</SaveButton>
                <CancelButton type="button" onClick={handleModalClose}>
                  취소
                </CancelButton>
              </ModalButtons>
            </ModalForm>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}

export default BannerList;
