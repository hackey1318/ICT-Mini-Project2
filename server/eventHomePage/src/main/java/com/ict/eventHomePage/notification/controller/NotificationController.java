package com.ict.eventHomePage.notification.controller;

import com.ict.eventHomePage.common.config.AuthCheck;
import com.ict.eventHomePage.common.config.AuthRequired;
import com.ict.eventHomePage.notification.controller.response.NotificationResponse;
import com.ict.eventHomePage.notification.domain.constant.NotificationStatus;
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

    @GetMapping("/{status}")
    @AuthRequired({USER, ADMIN})
    public List<NotificationResponse> getNotification(@PathVariable String status) {
        String userId = AuthCheck.getUserId(USER, ADMIN);
        List<NotificationStatus> statuses = (NotificationStatus.valueOf(status) == NotificationStatus.ALL)
                ? List.of(NotificationStatus.READ, NotificationStatus.READABLE)
                : List.of(NotificationStatus.valueOf(status));
        return modelMapper.map(notificationService.getNotificationList(userId, statuses), new TypeToken<List<NotificationResponse>>() {
        }.getType());
    }

    @PatchMapping
    @AuthRequired({USER, ADMIN})
    public int readNotification(@RequestBody List<Integer> notificationList) {
        String userId = AuthCheck.getUserId(USER, ADMIN);
        return notificationService.readNotification(userId, notificationList);
    }
}

