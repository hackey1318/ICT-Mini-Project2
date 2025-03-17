package com.ict.eventHomePage.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventsVO {
    private int no;

    private String contentId;

    private String title;

    private String addr;

    private int areaCode;

    private int sigunguCode;

    private String tel;

    private String telName;

    private String homePage;

    private String overView;

    private String lat;

    private String lng;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private List<EventImages> img_list;
}
