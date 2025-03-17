package com.ict.eventHomePage.banner.service.impl;

import com.ict.eventHomePage.banner.repository.BannerRepository;
import com.ict.eventHomePage.banner.service.BannerService;
import com.ict.eventHomePage.domain.Events;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerServiceImpl implements BannerService {

    private final BannerRepository bannerRepository;

    public List<Events> searchEvents(String title, LocalDateTime startDate, String addr, int areaCode) {
        title = (title != null) ? title : "";
        addr = (addr != null) ? addr : "";

        return bannerRepository.findByTitleContainingAndStartDateAndAddrAndAreaCode(title, startDate, addr, areaCode); // 메서드 이름 변경
    }
}
