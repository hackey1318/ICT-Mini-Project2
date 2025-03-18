package com.ict.eventHomePage.notification.controller;

import com.ict.eventHomePage.common.config.AuthCheck;
import com.ict.eventHomePage.common.config.AuthRequired;
import com.ict.eventHomePage.notification.controller.request.NotificationRequest;
import com.ict.eventHomePage.notification.controller.response.NotificationResponse;
import com.ict.eventHomePage.notification.domain.Notification;
import com.ict.eventHomePage.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.ict.eventHomePage.domain.constant.UserRole.ADMIN;
import static com.ict.eventHomePage.domain.constant.UserRole.USER;

@RestController
@RequiredArgsConstructor
@RequestMapping("/noti")
public class NotificationController {

    private final ModelMapper modelMapper;
    private final NotificationService notificationService;

    @GetMapping("/count")
    @AuthRequired({USER, ADMIN})
    public int countNotification() {
        String userId = AuthCheck.getUserId(USER, ADMIN);
        return notificationService.getNotificationCount(userId);
    }

    @GetMapping
    @AuthRequired({USER, ADMIN})
    public List<NotificationResponse> getNotification() {
        String userId = AuthCheck.getUserId(USER, ADMIN);
        return modelMapper.map(notificationService.getNotificationList(userId), new TypeToken<List<NotificationResponse>>(){}.getType());
    }


    @PatchMapping
    @AuthRequired({USER, ADMIN})
    public int readNotification(@RequestBody List<Integer> notificationList) {
        String userId = AuthCheck.getUserId(USER, ADMIN);
        return notificationService.readNotification(userId, notificationList);
    }

    @PostMapping
    @AuthRequired(ADMIN)
    public List<NotificationResponse> postNotification(@RequestBody NotificationRequest request) {

        return modelMapper.map(notificationService.generateNotification(request), new TypeToken<List<NotificationResponse>>(){}.getType());
    }
}

