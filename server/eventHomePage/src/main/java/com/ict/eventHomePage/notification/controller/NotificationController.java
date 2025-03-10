package com.ict.eventHomePage.notification.controller;

import com.ict.eventHomePage.notification.domain.Notification;
import com.ict.eventHomePage.notification.service.NotificationService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/noti")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/count")
    public int countNotification(HttpSession session) {
        int userNo = (int) session.getAttribute("userNo");
        return notificationService.getNotificationCount(userNo);
    }

    @GetMapping
    public List<Notification> getNotification(HttpSession session) {
        int userNo = (int) session.getAttribute("userNo");
        return notificationService.getNotificationList(userNo);
    }

    @PatchMapping
    public int readNotification(@RequestBody List<Integer> notificationList, HttpSession session) {
        int userNo = (int) session.getAttribute("userNo");
        return notificationService.readNotification(userNo, notificationList);
    }

    @PostMapping
    public List<Notification> postNotification(@RequestBody NotificationRequest request) {

        return notificationService.generateNotification(request);
    }
}
