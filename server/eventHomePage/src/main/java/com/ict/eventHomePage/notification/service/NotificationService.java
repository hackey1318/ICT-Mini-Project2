package com.ict.eventHomePage.notification.service;

import com.ict.eventHomePage.notification.controller.request.NotificationRequest;
import com.ict.eventHomePage.notification.domain.Notification;

import java.util.List;

public interface NotificationService {

    int getNotificationCount(int userNo);

    List<Notification> getNotificationList(int userNo);

    int readNotification(int userNo, List<Integer> notificationNoList);

    List<Notification> generateNotification(NotificationRequest request);
}
