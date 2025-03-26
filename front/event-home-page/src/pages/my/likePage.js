import { useState, useEffect } from "react"
import "../../css/my/likesGrid.css"
import axios from "axios"
import ErrorModal from "../common/ErrorModal"
import { useNavigate } from "react-router-dom";
import apiClient from "../../js/axiosConfig";

function LikePage() {
    const navigate = useNavigate();

    const [showError, setShowError] = useState(false);
    const [wishlistItems, setWishlistItems] = useState([])
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // 페이지네이션 상태
    const [page, setPage] = useState(0); // 현재 페이지
    const [size, setSize] = useState(6); // 페이지 당 항목 수
    const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수

    // 컴포넌트 렌더링 시 초기 데이터 로딩
    useEffect(() => {
        fetchWishlist();  // 초기 찜 목록 불러오기
    }, [page, size]);  // 페이지 번호 또는 페이지 크기가 변경되면 다시 호출

    // 찜 목록을 불러오는 함수
    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get("/like", {
                params: {
                    page: page,  // 페이지 번호
                    size: size   // 페이지 크기
                }
            });

            if (!response.data) {
                throw new Error("찜 목록을 불러오는데 실패했습니다.");
            }

            const data = response.data.content;  // 페이지네이션을 고려하여 content에서 데이터 추출
            const totalPages = response.data.totalPages;  // 전체 페이지 수

            setWishlistItems(data);  // 받아온 찜 목록을 상태에 설정
            setTotalPages(totalPages); // 전체 페이지 수 상태에 설정

            // ACTIVE 상태인 항목만 favorites에 추가
            setFavorites(data.filter((item) => item.status === "ACTIVE").map((item) => item.eventNo));

            // 만약 현재 페이지가 마지막 페이지인데, 항목이 없다면 1페이지로 돌아가기
            if (data.length === 0 && page !== 0) {
                setPage(0); // 페이지 번호를 0 (첫 번째 페이지)로 리셋
            }

        } catch (err) {
            if (err.response && err.response.status === 403) {
                sessionStorage.removeItem("accessToken");  // 액세스 토큰 제거
                setShowError(true);  // 에러 메시지 표시
            }

            setError(err.message);  // 오류 메시지 설정
        } finally {
            setLoading(false);  // 로딩 상태 종료
        }
    };

    // 페이지 변경 처리
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    // 페이지 크기 변경 처리
    const handleSizeChange = (newSize) => {
        setSize(newSize);
        setPage(0); // 페이지 크기 변경 시 첫 번째 페이지로 이동
    };

    // 찜 상태를 토글하는 함수
    const toggleFavorite = async (itemNo) => {
        const accessToken = sessionStorage.getItem("accessToken");  // 토큰 가져오기
        try {
            const response = await apiClient.patch(`/like/${itemNo}`, {});  // 찜 상태 업데이트

            if (!response.data) {
                throw new Error("찜 업데이트에 실패했습니다.");
            }

            // 찜 목록을 다시 불러옵니다.
            await fetchWishlist();

        } catch (err) {
            if (err.response && err.response.status === 403) {
                sessionStorage.removeItem("accessToken");
                setShowError(true);
            }

            setError(err.message);  // 오류 메시지 설정
        }
    };

    const handleEdit = (eventNo) => {
        navigate(`/eventview/${eventNo}`);
    };

    return (
        <div>
            {loading && <div className="text-center py-5">로딩 중...</div>}
            <h3 className="mb-4 d-none d-md-block">찜 목록</h3>
            <ErrorModal show={showError} onClose={() => setShowError(false)} />

            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
                {wishlistItems && wishlistItems.length > 0 ? (wishlistItems.map((item) => (
                    <div key={item.no} className="col">
                        <div className="wishlist-item">
                            <div className="fw-medium mb-2 item-title">{item.title}</div>
                            <div className="position-relative rounded overflow-hidden">
                                <img
                                    src={item.imageInfo || "/placeholder.svg"}
                                    alt={`${item.title}-${item.eventNo}`}
                                    className="w-100 item-image"
                                />
                                <button
                                    className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle p-1"
                                    onClick={() => toggleFavorite(item.eventNo)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill={favorites.includes(item.eventNo) ? "red" : "none"}
                                        stroke="red"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="text-center mt-2">
                                <button onClick={() => handleEdit(item.eventNo)} className="btn btn-outline-primary btn-sm rounded-pill px-3">자세히 보기</button>
                            </div>
                        </div>
                    </div>
                ))) : (
                    <div>찜한 내역이 없습니다.</div>
                )
                }
            </div>

            {/* 페이지네이션 버튼 */}
            {totalPages > 0 && (
                <>
                    <div className="d-flex justify-content-center align-items-center mt-4">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 0}
                            className="btn btn-dark me-2"
                        >
                            이전
                        </button>
                        <span>{totalPages > 0 ? `${page + 1} / ${totalPages}` : '0 / 0'}</span>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages - 1}
                            className="btn btn-dark ms-2"
                        >
                            다음
                        </button>
                    </div>
                    <div className="d-flex justify-content-center mt-3">
                        <select onChange={(e) => handleSizeChange(e.target.value)} value={size} className="form-select w-auto">
                            <option value={6}>6개씩</option>
                            <option value={12}>12개씩</option>
                            <option value={18}>18개씩</option>
                        </select>
                    </div>
                </>
            )}

            
        </div>
    )
}

export default LikePage;