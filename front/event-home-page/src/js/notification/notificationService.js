import axios from "axios";

export async function fetchNotificationCount() {
    try {
        const accessToken = sessionStorage.getItem("accessToken"); // 토큰 가져오기
        const response = await axios.get("http://localhost:9988/noti/count", {
            headers: {
                Authorization: `Bearer ${accessToken}` // 헤더에 토큰 추가
            }
        });
        return await response.data
    } catch (error) {
        console.error("Failed to fetch notification count:", error)
        return 0
    }
}

export async function fetchNotifications() {
    try {
        const accessToken = sessionStorage.getItem("accessToken"); // 토큰 가져오기
        const response = await axios.get("http://localhost:9988/noti", {
            headers: {
                Authorization: `Bearer ${accessToken}` // 헤더에 토큰 추가
            }
        })
        return await response.data
    } catch (error) {
        console.error("Failed to fetch notifications:", error)
        // Fallback sample data
        return [
            // { id: "1", message: "1새로운 팔로워가 있습니다", time: "5분 전" },
            // { id: "2", message: "2댓글이 달렸습니다", time: "1시간 전" },
            // { id: "3", message: "3메시지가 도착했습니다", time: "어제" },
            // { id: "1", message: "4새로운 팔로워가 있습니다", time: "5분 전" },
            // { id: "2", message: "5댓글이 달렸습니다", time: "1시간 전" },
            // { id: "3", message: "6메시지가 도착했습니다", time: "어제" },
            // { id: "1", message: "7새로운 팔로워가 있습니다", time: "5분 전" },
            // { id: "2", message: "8댓글이 달렸습니다", time: "1시간 전" },
            // { id: "3", message: "9메시지가 도착했습니다", time: "어제" },
            // { id: "1", message: "10새로운 팔로워가 있습니다", time: "5분 전" },
            // { id: "2", message: "11댓글이 달렸습니다", time: "1시간 전" },
            // { id: "3", message: "12메시지가 도착했습니다", time: "어제" },
        ]
    }
}

export async function markNotificationAsRead(notificationId) {
    try {
        const accessToken = sessionStorage.getItem("accessToken"); // 토큰 가져오기
        const requestData = Array.isArray(notificationId) ? notificationId : [notificationId];

        const response = await axios.patch("http://localhost:9988/noti",
            requestData, 
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
            })
        return await response.data
    } catch (error) {
        console.error("Failed to mark notification as read:", error)
    }
}