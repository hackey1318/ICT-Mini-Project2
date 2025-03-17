package com.ict.eventHomePage.banner.service.impl;

import com.ict.eventHomePage.banner.repository.BannerRepository;
import com.ict.eventHomePage.banner.service.BannerService;
import com.ict.eventHomePage.domain.Banners;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerServiceImpl implements BannerService {

//    private final BannerRepository bannerRepository;
//
//    public List<Banners> searchEvents(String name, String eventDate, String eventCity, String eventGu) {
//        name = (name != null) ? name : "";
//        eventDate = (eventDate != null) ? eventDate : "";
//        eventCity = (eventCity != null) ? eventCity : "";
//        eventGu = (eventGu != null) ? eventGu : "";
//
//        return bannerRepository.findByTitleContainingAndStartDateAndCityAndGu(name, eventDate, eventCity, eventGu);
//    }
}
