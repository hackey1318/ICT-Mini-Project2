package com.ict.eventHomePage.banner.service.impl;

import com.ict.eventHomePage.banner.controller.response.BannerResponse;
import com.ict.eventHomePage.banner.repository.BannerRepository;
import com.ict.eventHomePage.banner.service.BannerService;
import com.ict.eventHomePage.banner.service.dto.HomeBannerDto;
import com.ict.eventHomePage.domain.Banners;
import com.ict.eventHomePage.domain.Events;
import com.ict.eventHomePage.domain.constant.StatusInfo;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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
    public void createBanner(Integer eventNo, String fileId, String color, LocalDateTime startDate, LocalDateTime endDate) {
        Banners banner = new Banners();
        banner.setEventNo(eventNo);
        banner.setFileId(fileId);
        banner.setColor(color);
        banner.setStatus(StatusInfo.ACTIVE); // enum 값 사용 (StatusInfo.ACTIVE)
        banner.setStartDate(startDate);
        banner.setEndDate(endDate);
        banner.setCreatedAt(LocalDateTime.now());
        banner.setUpdatedAt(LocalDateTime.now());

        bannerRepository.save(banner);
    }

    @Override
    public List<BannerResponse> getHomeBannerList() {

        List<HomeBannerDto> banners = bannerRepository.findByStatus(StatusInfo.ACTIVE);

        return modelMapper.map(banners, new TypeToken<List<BannerResponse>>(){}.getType());
    }
}