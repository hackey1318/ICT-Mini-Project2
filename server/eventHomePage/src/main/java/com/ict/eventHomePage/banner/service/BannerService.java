package com.ict.eventHomePage.banner.service;

import com.ict.eventHomePage.domain.Banners;

import java.util.List;

public interface BannerService {

    List<Banners> searchEvents(String name, String eventDate, String eventCity, String eventGu);
}
