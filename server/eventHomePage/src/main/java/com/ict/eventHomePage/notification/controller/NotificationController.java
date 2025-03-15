package com.ict.eventHomePage.notification.controller;

import com.ict.eventHomePage.common.config.AuthCheck;
import com.ict.eventHomePage.common.config.AuthRequired;
import com.ict.eventHomePage.notification.controller.request.NotificationRequest;
import com.ict.eventHomePage.notification.domain.Notification;
import com.ict.eventHomePage.notification.service.NotificationService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.ict.eventHomePage.domain.constant.UserRole.ADMIN;
import static com.ict.eventHomePage.domain.constant.UserRole.USER;

@RestController
@RequiredArgsConstructor
@RequestMapping("/noti")
public class NotificationController {

    private final NotificationService notificationService;

    @AuthRequired({USER, ADMIN})
    @GetMapping("/count")
    public int countNotification(HttpSession session) {
        int userNo = (int) session.getAttribute("userNo");
        String userId = AuthCheck.getUserId(USER, ADMIN);
        return notificationService.getNotificationCount(userNo);
    }

    @AuthRequired(USER)
    @GetMapping
    public List<Notification> getNotification(HttpSession session) {
        int userNo = (int) session.getAttribute("userNo");
        return notificationService.getNotificationList(userNo);
    }

    @AuthRequired(USER)
    @PatchMapping
    public int readNotification(@RequestBody List<Integer> notificationList, HttpSession session) {
        int userNo = (int) session.getAttribute("userNo");
        return notificationService.readNotification(userNo, notificationList);
    }

    @AuthRequired(ADMIN)
    @PostMapping
    public List<Notification> postNotification(@RequestBody NotificationRequest request) {

        return notificationService.generateNotification(request);
    }
}
