package com.ict.eventHomePage.notification.controller.request;

import com.ict.eventHomePage.notification.domain.constant.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {

    private List<Integer> userIdList;

    private String titie;

    private String message;

    private NotificationType type;
}
