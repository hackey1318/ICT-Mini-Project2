import { useState, useEffect } from "react"
import "../../css/my/likesGrid.css"
import axios from "axios"
import ErrorModal from "../common/ErrorModal"

function LikePage() {
    const [showError, setShowError] = useState(false);
    const [wishlistItems, setWishlistItems] = useState([])
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // GET /like 엔드포인트에서 데이터 가져오기
        const fetchWishlist = async () => {
            try {
                setLoading(true)
                const accessToken = sessionStorage.getItem("accessToken"); // 토큰 가져오기
                const response = await axios.get("http://localhost:9988/like", {
                    headers: {
                        Authorization: `Bearer ${accessToken}` // 헤더에 토큰 추가
                    }
                }
                )

                if (!response.data) {
                    throw new Error("찜 목록을 불러오는데 실패했습니다.")
                }

                const data = await response.data
                setWishlistItems(data)

                // 초기 찜 상태 설정 (모든 항목이 이미 찜 목록에 있으므로 모든 no를 favorites에 추가)
                setFavorites(data.filter((item) => item.status === "ACTIVE").map((item) => item.no));
            } catch (err) {
                if (err.response.status === 403) {
                    sessionStorage.removeItem("accessToken");
                    setShowError(true);
                }

                setError(err.message);
            } finally {
                setLoading(false)
            }
        }

        fetchWishlist()
    }, [])

    const toggleFavorite = async (itemNo) => {
        const accessToken = sessionStorage.getItem("accessToken"); // 토큰 가져오기
        try {
            const response = await axios.patch(`http://localhost:9988/like/${itemNo}`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}` // 헤더에 토큰 추가
                }
            })

            if (!response.data) {
                throw new Error("찜 업데이트에 실패했습니다.")
            }

            if (favorites.includes(itemNo)) {
                setFavorites(favorites.filter((id) => id !== itemNo))
            } else {
                setFavorites([...favorites, itemNo])
            }
        } catch (err) {
            if (err.response.status === 403) {
                sessionStorage.removeItem("accessToken");
                setShowError(true);
            }

            setError(err.message);
        }

    }

    if (loading) {
        return <div className="text-center py-5">로딩 중...</div>
    }

    return (
        <div>
            <h2 className="h4 mb-4 d-none d-md-block">찜 목록</h2>
            <ErrorModal show={showError} onClose={() => setShowError(false)} />

            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
                {wishlistItems.map((item) => (
                    <div key={item.no} className="col">
                        <div className="wishlist-item">
                            <div className="fw-medium mb-2">{item.title}</div>
                            <div className="position-relative rounded overflow-hidden">
                                <img
                                    src={item.imageInfo || "/placeholder.svg"}
                                    alt={item.title}
                                    className="w-100 item-image"
                                />
                                <button
                                    className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle p-1"
                                    onClick={() => toggleFavorite(item.no)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill={favorites.includes(item.no) ? "red" : "none"}
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
                                <button className="btn btn-outline-primary btn-sm rounded-pill px-3">자세히 보기</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LikePage;