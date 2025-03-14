package com.ict.eventHomePage.notification.service.impl;

import com.ict.eventHomePage.notification.controller.NotificationRequest;
import com.ict.eventHomePage.notification.domain.Notification;
import com.ict.eventHomePage.notification.domain.constant.NotificationStatus;
import com.ict.eventHomePage.notification.repository.NotificationRepository;

import com.ict.eventHomePage.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

//    private final MemberService memberService;
    private final NotificationRepository notificationRepository;

    @Override
    public int getNotificationCount(int userNo) {

//        MemberVO user = this.getMember(userNo);
        return notificationRepository.getReadableNotificationCountForUser(userNo);
    }

    @Override
    public List<Notification> getNotificationList(int userNo) {

//        MemberVO user = this.getMember(userNo);
        return notificationRepository.getReadableNotificationListForUser(userNo);
    }

    @Override
    public int readNotification(int userNo, List<Integer> notificationNoList) {
//        MemberVO user = this.getMember(userNo);
        return notificationRepository.readNotification(userNo, notificationNoList);
    }

    @Override
    public List<Notification> generateNotification(NotificationRequest request) {

        List<Notification> notifications = new ArrayList<>();
        for (Integer userId : request.getUserIdList()) {
            notifications.add(Notification.builder()
                    .userId(userId)
                    .content(request.getMessage())
                    .status(NotificationStatus.READABLE).build());
        }

        return notificationRepository.saveAll(notifications);
    }

    private String getMember(int userNo) {

        String user = "test1";
//        MemberVO user = memberService.getUser(userNo);
        if (user == null) {
            throw new RuntimeException("사용자가 없습니다.");
        }
        return user;
    }
}
