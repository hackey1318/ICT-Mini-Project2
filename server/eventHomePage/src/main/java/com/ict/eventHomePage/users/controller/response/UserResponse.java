package com.ict.eventHomePage.users.controller.response;

import com.ict.eventHomePage.domain.constant.StatusInfo;
import com.ict.eventHomePage.domain.constant.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private int no;

    private String userId;

    private String name;

    private String email;

    private StatusInfo status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
