package com.ict.eventHomePage.notification.controller;

import com.ict.eventHomePage.common.config.AuthCheck;
import com.ict.eventHomePage.common.config.AuthRequired;
import com.ict.eventHomePage.common.response.SuccessOfFailResponse;
import com.ict.eventHomePage.notification.controller.request.NotificationRequest;
import com.ict.eventHomePage.notification.controller.response.AnnounceResponse;
import com.ict.eventHomePage.notification.controller.response.NotificationResponse;
import com.ict.eventHomePage.notification.domain.Announcement;
import com.ict.eventHomePage.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.ict.eventHomePage.domain.constant.UserRole.ADMIN;

@RestController
@RequiredArgsConstructor
@RequestMapping("/announce")
public class AnnouncementController {

    private final ModelMapper modelMapper;
    private final NotificationService notificationService;

    @PostMapping
    @AuthRequired(ADMIN)
    public SuccessOfFailResponse postAnnounce(@RequestBody NotificationRequest request) {

        String userId = AuthCheck.getUserId(ADMIN);
        return notificationService.generateAnnounce(userId, request);
    }

    @GetMapping
    @AuthRequired(ADMIN)
    public List<NotificationResponse> getAnnounce() {

        String userId = AuthCheck.getUserId(ADMIN);
        return modelMapper.map(notificationService.getAnnounce(userId), new TypeToken<List<NotificationResponse>>() {
        }.getType());
    }

    @AuthRequired(ADMIN)
    @GetMapping("/{announceId}")
    public AnnounceResponse getAnnounceDetail(@PathVariable("announceId") int announceId) {

        String userId = AuthCheck.getUserId(ADMIN);
        return notificationService.getAnnounceDetail(userId, announceId);
    }
}
