package com.ict.eventHomePage.banner.service;

import com.ict.eventHomePage.domain.Events; // Banners -> Events

import java.time.LocalDateTime;
import java.util.List;

public interface BannerService {

    List<Events> searchEvents(String title, LocalDateTime startDate, String addr, int areaCode);
}
