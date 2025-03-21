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
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int adminNo;

    private String title; // 공지 제목

    @Column(nullable = false, length = 500)
    private String content; // 공지 내용

    @Enumerated(value = EnumType.STRING)
    private NotificationStatus status;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt; // 생성일시

    @LastModifiedDate
    private LocalDateTime updatedAt; // 수정일시
}
