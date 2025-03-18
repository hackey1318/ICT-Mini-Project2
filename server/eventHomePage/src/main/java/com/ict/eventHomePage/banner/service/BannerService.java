package com.ict.eventHomePage.banner.service;

import com.ict.eventHomePage.domain.Events;
import java.time.LocalDateTime;
import java.util.List;

public interface BannerService {
    List<Events> searchEvents(String title, LocalDateTime startDate, String addr);
    void createBanner(Integer eventNo, String fileId, String color, LocalDateTime startDate, LocalDateTime endDate);
}