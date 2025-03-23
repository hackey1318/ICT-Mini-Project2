package com.ict.eventHomePage.reply.controller.response;

import com.ict.eventHomePage.domain.constant.StatusInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReplyResponse {

    private int no;

    private int userNo;

    private  int eventNo;

    private String name;

    private String title;

    private String content;

    private List<String> imageIdList;

    private StatusInfo status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
