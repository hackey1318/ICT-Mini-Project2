package com.ict.eventHomePage.banner.service;

import com.ict.eventHomePage.banner.controller.request.BannerRequest;
import com.ict.eventHomePage.banner.controller.response.BannerResponse;
import com.ict.eventHomePage.domain.Events;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface BannerService {
    List<Events> searchEvents(String title, LocalDateTime startDate, String addr);

    List<BannerResponse> getHomeBannerList();

    boolean createBanner(BannerRequest request);

    // 페이지네이션 지원 메서드만 유지
    Map<String, Object> getAllBanners(int page, int size, String searchWord);

    void updateBanner(Integer no, Integer eventNo, String fileId, String color, LocalDateTime startDate, LocalDateTime endDate);

    void deleteBanner(Integer no);
}