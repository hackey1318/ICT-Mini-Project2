package com.ict.eventHomePage.notification.controller.response;

import com.ict.eventHomePage.notification.domain.constant.NotificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnounceResponse {

    private int id;
    private String title;
    private String content;
    private List<String> userEmailList;
    private NotificationStatus status;
    private LocalDateTime createdAt;
}
