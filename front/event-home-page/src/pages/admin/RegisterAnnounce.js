import axios from "axios"
import { useState } from "react"

const accessToken = sessionStorage.getItem("accessToken");

export default function RegisterAnnounce({ show, onClose, onSave }) {

    const [subject, setSubject] = useState("")
    const [content, setContent] = useState("")
    const [selectedCities, setSelectedCities] = useState([])
    const [targetUsers, setTargetUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [showAllRegions, setShowAllRegions] = useState(false)

    // List of major Korean cities - first row (always visible)
    const mainCities = ["서울", "부산", "인천", "대구", "광주", "대전", "울산", "세종"]

    // Additional cities (shown when expanded)
    const additionalCities = ["경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"]

    // All cities combined
    const allCities = [...mainCities, ...additionalCities]


    const toggleCitySelection = (city) => {
        if (selectedCities.includes(city)) {
            setSelectedCities(selectedCities.filter((c) => c !== city))
        } else {
            setSelectedCities([...selectedCities, city])
        }
    }

    const toggleAllCities = () => {
        setShowAllRegions(!showAllRegions)
        if (selectedCities.length === allCities.length) {
            setSelectedCities([])
        } else {
            setSelectedCities([...allCities])
        }
    }

    async function saveAnnouncement(announcement) {
        // Simulate server delay
        const { subject, content, userIdList, selectedCities } = announcement;

        const announceRegister = await axios.post("http://localhost:9988/announce", {
            userIdList: userIdList,
            titie: subject,
            message: content,
            regionList: selectedCities,
            type: "ALERT"
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        console.log(announceRegister);

    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!subject || !content) {
            alert("제목과 내용을 입력해주세요.")
            return
        }

        setIsSaving(true)
        try {

            const userList = await axios.post("http://localhost:9988/auth/region", selectedCities, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const userIdList = userList.data.map(item => item.no);

            // Save announcement to server
            const announcement = {
                subject,
                content,
                userIdList,
                selectedCities
            }

            const savedAnnouncement = await saveAnnouncement(announcement)

            // Reset form
            setSubject("")
            setContent("")
            setSelectedCities([])
            onClose()
        } catch (error) {
            console.error("Error saving announcement:", error)
            alert("공지사항 저장에 실패했습니다.")
        } finally {
            setIsSaving(false)
        }
    }


    // Display a subset of cities for compact view
    const displayedCities = showAllRegions ? allCities : mainCities.slice(0, 8)


    if (!show) return null

    return (
        <div className="modal-wrapper">
            <div className="modal show d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">공지 등록</h5>
                            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span>공지 대상 선택 (선택사항)</span>
                                        <div>
                                            <button type="button" className="btn btn-sm btn-outline-secondary me-1" onClick={toggleAllCities}>
                                                전체 선택
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => setShowAllRegions(!showAllRegions)}
                                            >
                                                {showAllRegions ? "접기" : "더 보기"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Region selection - horizontal layout */}
                                    <div className="region-selection border rounded p-3 mb-2">
                                        <div className="d-flex flex-wrap gap-3">
                                            {displayedCities.map((city) => (
                                                <div key={city} className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`city-${city}`}
                                                        checked={selectedCities.includes(city)}
                                                        onChange={() => toggleCitySelection(city)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`city-${city}`}>
                                                        {city}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedCities.length > 0 && (
                                        <div className="mb-2">
                                            <small className="text-muted selected-cities">선택된 지역: {selectedCities.join(", ")}</small>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="subject" className="form-label">
                                        제목 <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="subject"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="content" className="form-label">
                                        내용 <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="content"
                                        rows="4"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                취소
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={!subject || !content || isSaving}
                            >
                                {isSaving ? "저장 중..." : "등록"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop show"></div>

            <style jsx>{`
        .modal-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1050;
        }
        .modal {
            z-index: 1055;
        }
        .modal-backdrop {
            z-index: 1050;
        }
        .form-check {
            margin-right: 10px;
        }
        .selected-cities {
            display: inline-block;
            max-width: 300px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            vertical-align: middle;
        }
        .form-check-input:checked {
            background-color: #0d6efd;
            border-color: #0d6efd;
        }
        `}</style>
        </div>
    )
}