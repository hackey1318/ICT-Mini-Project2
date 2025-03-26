package com.ict.eventHomePage.banner.controller.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BannerResponse {

    private int no;

    private int eventNo;

    private String title;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private String color;

    private String fileId;
}
