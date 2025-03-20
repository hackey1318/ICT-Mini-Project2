package com.ict.eventHomePage.notification.service.impl;

import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.notification.controller.request.NotificationRequest;
import com.ict.eventHomePage.notification.domain.Notification;
import com.ict.eventHomePage.notification.domain.constant.NotificationStatus;
import com.ict.eventHomePage.notification.repository.NotificationRepository;

import com.ict.eventHomePage.notification.service.NotificationService;
import com.ict.eventHomePage.users.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final AuthService authService;
    private final NotificationRepository notificationRepository;

    @Override
    public int getNotificationCount(String userId) {

        Users user = this.getMember(userId);
        return notificationRepository.getReadableNotificationCountForUser(user.getNo(), NotificationStatus.READABLE);
    }

    @Override
    public List<Notification> getNotificationList(String userId) {

        Users user = this.getMember(userId);
        return notificationRepository.getReadableNotificationListForUser(user.getNo(), NotificationStatus.READABLE);
    }

    @Override
    public int readNotification(String userId, List<Integer> notificationNoList) {
        Users user = this.getMember(userId);
        return notificationRepository.readNotification(NotificationStatus.READ, user.getNo(), notificationNoList);
    }

    @Override
    public List<Notification> generateNotification(NotificationRequest request) {

        List<Notification> notifications = new ArrayList<>();
        for (Integer userId : request.getUserIdList()) {
            notifications.add(Notification.builder()
                    .userNo(userId)
                    .content(request.getMessage())
                    .status(NotificationStatus.READABLE).build());
        }

        return notificationRepository.saveAll(notifications);
    }

    private Users getMember(String userId) {

        Users user = authService.getUser(userId);
        if (user == null) {
            throw new RuntimeException("사용자가 없습니다.");
        }
        return user;
    }
}
