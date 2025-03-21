package com.ict.eventHomePage.notification.domain;

import com.ict.eventHomePage.notification.domain.constant.NotificationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@Table
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class AnnouncementRecipient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int announcementId;

    private int userNo;

    @Enumerated(value = EnumType.STRING)
    private NotificationStatus status;
}
