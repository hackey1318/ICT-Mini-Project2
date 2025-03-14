package com.ict.eventHomePage.notification.domain.constant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum NotificationType {

    EVENT("이벤트"),
    ALERT("공지");

    private final String description;
}
