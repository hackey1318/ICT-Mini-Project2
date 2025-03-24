package com.ict.eventHomePage.notification.service.impl;

import com.ict.eventHomePage.common.exception.custom.NotFoundException;
import com.ict.eventHomePage.common.response.SuccessOfFailResponse;
import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.notification.controller.request.NotificationRequest;
import com.ict.eventHomePage.notification.controller.response.AnnounceResponse;
import com.ict.eventHomePage.notification.domain.Announcement;
import com.ict.eventHomePage.notification.domain.AnnouncementRecipient;
import com.ict.eventHomePage.notification.domain.Notification;
import com.ict.eventHomePage.notification.domain.constant.NotificationStatus;
import com.ict.eventHomePage.notification.repository.AnnouncementRecipientRepository;
import com.ict.eventHomePage.notification.repository.AnnouncementRepository;
import com.ict.eventHomePage.notification.repository.NotificationRepository;
import com.ict.eventHomePage.notification.service.NotificationService;
import com.ict.eventHomePage.notification.service.dto.AnnounceRecipientInfo;
import com.ict.eventHomePage.users.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final ModelMapper modelMapper;

    private final AuthService authService;
    private final NotificationRepository notificationRepository;
    private final AnnouncementRepository announcementRepository;
    private final AnnouncementRecipientRepository announcementRecipientRepository;

    @Override
    public int getNotificationCount(String userId) {

        Users user = this.getMember(userId);
        return notificationRepository.getReadableNotificationCountForUser(user.getNo(), NotificationStatus.READABLE);
    }

    @Override
    public Page<Notification> getNotificationList(String userId, List<NotificationStatus> statuses, Pageable pageable) {

        Users user = this.getMember(userId);
        return notificationRepository.getReadableNotificationListForUser(user.getNo(), statuses, pageable);
    }

    @Override
    public int readNotification(String userId, List<Integer> notificationNoList) {
        Users user = this.getMember(userId);
        List<Integer> announceIdList = notificationRepository.getAnnounceId(notificationNoList);

        announcementRecipientRepository.readAnnounce(NotificationStatus.READ, user.getNo(), notificationNoList);
        return notificationRepository.readNotification(NotificationStatus.READ, user.getNo(), notificationNoList);
    }

    @Override
    public SuccessOfFailResponse generateAnnounce(String adminId, NotificationRequest request) {

        boolean res = true;
        // announce 객체 생성
        try {

            Announcement announcement = announcementRepository.save(Announcement.builder()
                    .adminNo(this.getMember(adminId).getNo())
                    .title(request.getTitie())
                    .content(request.getMessage())
                    .type(request.getType())
                    .location(String.join(",", request.getRegionList()))
                    .status(NotificationStatus.READABLE).build());

            List<Notification> notifications = new ArrayList<>();
            List<AnnouncementRecipient> announcementRecipients = new ArrayList<>();
            for (Integer userId : request.getUserIdList()) {
                notifications.add(Notification.builder()
                        .userNo(userId)
                        .content(request.getMessage())
                        .announcementId(announcement.getId())
                        .status(NotificationStatus.READABLE).build());
                announcementRecipients.add(AnnouncementRecipient.builder()
                        .announcementId(announcement.getId())
                        .userNo(userId)
                        .status(NotificationStatus.READABLE).build());
            }
            notificationRepository.saveAll(notifications);
            announcementRecipientRepository.saveAll(announcementRecipients);
        } catch (Exception e) {
            res = false;
            log.error("announce generate error : {}", e.getMessage());
        }

        return SuccessOfFailResponse.builder().result(res).build();
    }

    @Override
    public List<Announcement> getAnnounce(String adminId) {

        return announcementRepository.findByAdminNo(this.getMember(adminId).getNo());
    }

    @Override
    public AnnounceResponse getAnnounceDetail(String userId, int announceId) {

        Announcement announcement = announcementRepository.findById(announceId).orElseThrow(() -> new NotFoundException("알림을 찾지 못하였습니다."));

        List<AnnounceRecipientInfo> recipientList = announcementRecipientRepository.getAnnouncementRecipient(announceId);

        AnnounceResponse res = modelMapper.map(announcement, AnnounceResponse.class);
        res.setRecipientList(recipientList);
        return res;
    }

    private Users getMember(String userId) {

        Users user = authService.getUser(userId);
        if (user == null) {
            throw new RuntimeException("사용자가 없습니다.");
        }
        return user;
    }
}
