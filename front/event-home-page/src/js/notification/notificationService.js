import axios from "axios";
import apiClient from './../axiosConfig';

export async function fetchNotificationCount() {
    try {
        const accessToken = sessionStorage.getItem("accessToken"); // 토큰 가져오기
        const response = await apiClient.get("/noti/count", {
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
        const status = "READABLE"
        const accessToken = sessionStorage.getItem("accessToken"); // 토큰 가져오기
        const response = await apiClient.get(`/noti/${status}`, {
            headers: {
                Authorization: `Bearer ${accessToken}` // 헤더에 토큰 추가
            }
        })
        return await response.data
    } catch (error) {
        console.error("Failed to fetch notifications:", error)
        return []
    }
}

export async function markNotificationAsRead(notificationId) {
    try {
        const accessToken = sessionStorage.getItem("accessToken"); // 토큰 가져오기
        const requestData = Array.isArray(notificationId) ? notificationId : [notificationId];

        const response = await apiClient.patch("/noti",
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