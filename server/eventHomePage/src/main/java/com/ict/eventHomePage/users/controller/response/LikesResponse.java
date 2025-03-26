package com.ict.eventHomePage.users.controller.response;

import com.ict.eventHomePage.domain.constant.StatusInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LikesResponse {

    private int no;

    private int eventNo;

    private String title;

    private String imageInfo;

    private StatusInfo status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
