package com.ict.eventHomePage.notification.service.dto;

import com.ict.eventHomePage.notification.domain.constant.NotificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnounceRecipientInfo {

    private String email;

    private NotificationStatus status;
}
