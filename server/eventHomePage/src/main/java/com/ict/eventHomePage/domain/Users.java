package com.ict.eventHomePage.domain;

import com.ict.eventHomePage.domain.constant.StatusInfo;
import com.ict.eventHomePage.domain.constant.UserRole;
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
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int no;

    @Column(nullable = false, length = 50)
    private String userId;

    @Column(nullable = false, length = 60)
    private String pw;

    @Enumerated(value = EnumType.STRING)
    private UserRole role;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 20)
    private String tel;

    @Column(nullable = false, length = 200)
    private String addr;

    @Column(nullable = false, length = 10)
    private String birth;

    @Enumerated(value = EnumType.STRING)
    private StatusInfo status;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
