package com.ict.eventHomePage.notification.service;

import com.ict.eventHomePage.notification.controller.request.NotificationRequest;
import com.ict.eventHomePage.notification.domain.Notification;

import java.util.List;

public interface NotificationService {

    int getNotificationCount(String userId);

    List<Notification> getNotificationList(String userId);

    int readNotification(String userId, List<Integer> notificationNoList);

    List<Notification> generateNotification(NotificationRequest request);
}
