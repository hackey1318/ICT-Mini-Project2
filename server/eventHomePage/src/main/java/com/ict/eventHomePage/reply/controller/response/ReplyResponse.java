package com.ict.eventHomePage.reply.controller.response;

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
public class ReplyResponse {

    private int no;

    private int userNo;

    private String name;

    private String title;

    private String content;

    private StatusInfo status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
