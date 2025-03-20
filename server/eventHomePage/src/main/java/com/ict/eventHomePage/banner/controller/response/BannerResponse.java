package com.ict.eventHomePage.banner.controller.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BannerResponse {

    private int no;

    private int eventNo;

    private String color;

    private String fileId;
}
