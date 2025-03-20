package com.ict.eventHomePage.banner.service.impl;

import com.ict.eventHomePage.banner.controller.request.BannerRequest;
import com.ict.eventHomePage.banner.controller.response.BannerResponse;
import com.ict.eventHomePage.banner.repository.BannerRepository;
import com.ict.eventHomePage.banner.service.BannerService;
import com.ict.eventHomePage.domain.Banners;
import com.ict.eventHomePage.domain.Events;
import com.ict.eventHomePage.domain.constant.StatusInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class BannerServiceImpl implements BannerService {

    private final ModelMapper modelMapper;

    private final BannerRepository bannerRepository;

    @Override
    public List<Events> searchEvents(String title, LocalDateTime startDate, String addr) {
        title = (title == null || title.isEmpty()) ? null : "%" + title + "%";
        addr = (addr == null || addr.isEmpty()) ? null : "%" + addr + "%";
        return bannerRepository.findByTitleContainingAndStartDateAndAddr(title, startDate, addr);
    }

    @Override
    public boolean createBanner(BannerRequest request) {
        try {
            bannerRepository.save(Banners.builder()
                    .eventNo(request.getEventNo())
                    .fileId(request.getFileId())
                    .color(request.getColor())
                    .startDate(request.getStartDate())
                    .endDate(request.getEndDate())
                    .status(StatusInfo.ACTIVE)
                    .build());
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    @Override
    public List<Map<String, Object>> getAllBanners() {
        List<Object[]> results = bannerRepository.findAllBannersWithEventTitle();
        List<Map<String, Object>> banners = new ArrayList<>();

        for (Object[] result : results) {
            Banners banner = (Banners) result[0];
            String title = (String) result[1];

            Map<String, Object> bannerMap = new HashMap<>();
            bannerMap.put("no", banner.getNo());
            bannerMap.put("fileId", banner.getFileId());
            bannerMap.put("eventNo", banner.getEventNo());
            bannerMap.put("color", banner.getColor());
            bannerMap.put("status", banner.getStatus());
            bannerMap.put("startDate", banner.getStartDate());
            bannerMap.put("endDate", banner.getEndDate());
            bannerMap.put("createdAt", banner.getCreatedAt());
            bannerMap.put("updatedAt", banner.getUpdatedAt());
            bannerMap.put("title", title != null ? title : banner.getEventNo());

            banners.add(bannerMap);
        }

        return banners;
    }

    @Override
    public void updateBanner(Integer no, Integer eventNo, String fileId, String color, LocalDateTime startDate, LocalDateTime endDate) {
        Banners banner = bannerRepository.findById(no)
                .orElseThrow(() -> new IllegalArgumentException("배너를 찾을 수 없습니다: " + no));

        if (fileId != null && fileId.length() > 16) { // 최대 16자 제한
            log.warn("fileId is too long: {} characters! Trimming...", fileId.length());
            fileId = fileId.substring(0, 16);
        }

        banner.setEventNo(eventNo);
        banner.setFileId(fileId);
        banner.setColor(color);
        banner.setStartDate(startDate);
        banner.setEndDate(endDate);
        bannerRepository.save(banner);
    }

    @Override
    public List<BannerResponse> getHomeBannerList() {

        return modelMapper.map(bannerRepository.findByStatus(StatusInfo.ACTIVE), new TypeToken<List<BannerResponse>>() {
        }.getType());
    }

    @Override
    public void deleteBanner(Integer no) {
        bannerRepository.deleteById(no);
    }
}