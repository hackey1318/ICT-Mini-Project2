package com.ict.eventHomePage.notification.controller;

import com.ict.eventHomePage.common.config.AuthCheck;
import com.ict.eventHomePage.common.config.AuthRequired;
import com.ict.eventHomePage.notification.controller.response.NotificationResponse;
import com.ict.eventHomePage.notification.domain.Notification;
import com.ict.eventHomePage.notification.domain.constant.NotificationStatus;
import com.ict.eventHomePage.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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

    @GetMapping("/{status}")
    @AuthRequired({USER, ADMIN})
    public Page<NotificationResponse> getNotification(@PathVariable String status,
                                                      @PageableDefault(page = 0, size = 10, sort = {"createdAt"}) Pageable pageable) {
        String userId = AuthCheck.getUserId(USER, ADMIN);
        List<NotificationStatus> statuses = (NotificationStatus.valueOf(status) == NotificationStatus.ALL)
                ? List.of(NotificationStatus.READ, NotificationStatus.READABLE)
                : List.of(NotificationStatus.valueOf(status));
        Page<Notification> notificationPage = notificationService.getNotificationList(userId, statuses, pageable);

        return notificationPage.map(notification -> modelMapper.map(notification, NotificationResponse.class));
    }

    @PatchMapping
    @AuthRequired({USER, ADMIN})
    public int readNotification(@RequestBody List<Integer> notificationList) {
        String userId = AuthCheck.getUserId(USER, ADMIN);
        return notificationService.readNotification(userId, notificationList);
    }
}

