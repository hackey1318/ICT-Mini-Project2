package com.ict.eventHomePage.banner.controller.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BannerRequest {
    int eventNo;
    String title;
    LocalDateTime startDate;
    LocalDateTime endDate;
    String addr;
    String color;
    String fileId;
}