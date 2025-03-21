package com.ict.eventHomePage.notification.service;

import com.ict.eventHomePage.common.response.SuccessOfFailResponse;
import com.ict.eventHomePage.notification.controller.request.NotificationRequest;
import com.ict.eventHomePage.notification.controller.response.AnnounceResponse;
import com.ict.eventHomePage.notification.domain.Announcement;
import com.ict.eventHomePage.notification.domain.Notification;

import java.util.List;

public interface NotificationService {

    int getNotificationCount(String userId);

    List<Notification> getNotificationList(String userId);

    int readNotification(String userId, List<Integer> notificationNoList);

    SuccessOfFailResponse generateAnnounce(String userId, NotificationRequest request);

    List<Announcement> getAnnounce(String userId);

    AnnounceResponse getAnnounceDetail(String userId, int announceId);
}
