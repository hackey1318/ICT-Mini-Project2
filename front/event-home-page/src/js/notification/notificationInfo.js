import { useState, useEffect } from "react"
import { X } from "lucide-react";
import {
    fetchNotificationCount,
    fetchNotifications,
    markNotificationAsRead,
} from "./notificationService"

import notificationIcon from '../../img/notification.png';
import "../../css/notification/notification-styles.css"
import moment from "moment";

export default function NotificationSystem() {
    const [notificationCount, setNotificationCount] = useState(0)
    const [showNotifications, setShowNotifications] = useState(false)
    const [allNotifications, setAllNotifications] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [size, setSize] = useState(3); // 페이지 당 항목 수

    useEffect(() => {
        // const accessToken = sessionStorage.getItem("accessToken"); // 토큰 가져오기
        if (!!sessionStorage.getItem('accessToken')) {
            loadNotificationCount()
            loadNotifications(page, size)
        }
    }, [page, size])

    const loadNotificationCount = async () => {
        const count = await fetchNotificationCount()
        setNotificationCount(count)
    }

    const loadNotifications = async (pageNumber, pageSize) => {
        setLoading(true)
        try {
            const data = await fetchNotifications(pageNumber, pageSize)
            setAllNotifications(data.content)  // 현재 페이지의 알림 목록
            setTotalPages(data.totalPages)  // 전체 페이지 수
        } catch (error) {
            console.error("Failed to load notifications", error)
        } finally {
            setLoading(false)
        }
    }

    const handleBellClick = async () => {
        setShowNotifications(!showNotifications)
        if (!showNotifications) {
            loadNotifications(page, size)  // 알림 목록을 새로 로드
        }
    }

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markNotificationAsRead(notificationId)

            // Remove the notification from the list
            const updatedNotifications = allNotifications.filter((notification) => notification.id !== notificationId)
            setAllNotifications(updatedNotifications)
            // Update the notification count
            setNotificationCount((prev) => Math.max(0, prev - 1))
            
            // Update total pages
            const newTotalPages = Math.ceil(updatedNotifications.length / size) || 1
            setTotalPages(newTotalPages)

            // Adjust current page if needed
            if (page > newTotalPages) {
                setPage(newTotalPages)
            }
        } catch (error) {
            console.error("Failed to mark notification as read:", error)
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            const notificationIds = allNotifications.map((notification) => notification.id)

            await markNotificationAsRead(notificationIds)

            // Clear all notifications
            setAllNotifications([])

            // Reset notification count
            setNotificationCount(0)

            // Reset pagination
            setPage(0)
            setTotalPages(0)
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error)
        }
    }

    // 페이지네이션 처리 함수
    const prevPage = () => {
        if (page > 0) setPage(page - 1);
    };
    
    const nextPage = () => {
        if (page < totalPages - 1) setPage(page + 1);
    };

    return (
        <div className="notification-container">

            <button className="icon-button" onClick={handleBellClick}>
                <img src={notificationIcon} alt="notification" style={{margin: '5px', width:'40px', height:'40px'}}/>
                {notificationCount > 0 && (
                    <span className="notification-badge">{notificationCount > 99 ? "99+" : notificationCount}</span>
                )}
            </button>

            {showNotifications && (
                <div className="notification-modal">
                    <div className="notification-header">
                        <h3 className="notification-title">알림</h3>
                        {allNotifications.length > 0 && (
                            <button className="read-all-button" onClick={handleMarkAllAsRead}>
                                전체 읽음
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="notification-loading">로딩 중...</div>
                        ) : allNotifications.length > 0 ? (
                            <>
                                <ul className="notification-list">
                                    {allNotifications.map(function (notification) {
                                        return (
                                        <li key={notification.id} className="notification-item">
                                            <div className="notification-content">
                                                <div className="notification-message-container">
                                                    <p className="notification-message">{notification.content}</p>
                                                </div>
                                                <div className="notification-time-and-delete">
                                                    <span className="notification-time">{moment(notification.createdAt).fromNow()}
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        aria-label="읽음 표시"
                                                    >
                                                        <X className="w-1 h-1" />
                                                    </button>
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                        )})
                                    }
                                </ul>
                                {totalPages > 1 && (
                                    <div className="noti-pagination">
                                        <button className="noti-pagination-button" onClick={prevPage} disabled={page === 0}>
                                            ←
                                        </button>
                                        <span className="noti-pagination-info">
                                            {page + 1} / {totalPages}
                                        </span>
                                        <button className="noti-pagination-button" onClick={nextPage} disabled={page === totalPages - 1}>
                                            →
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                        <div className="notification-empty">알림이 없습니다</div>
                    )}

                    <div className="notification-footer">
                        <button className="close-button" onClick={() => setShowNotifications(false)}>
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

