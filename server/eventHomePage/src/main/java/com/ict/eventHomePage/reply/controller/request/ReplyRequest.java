package com.ict.eventHomePage.reply.controller.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReplyRequest {

    private int userNo;

    private int eventNo;

    private String title;

    private String content;

    private List<String> imageIdList;
}


