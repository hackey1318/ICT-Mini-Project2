package com.ict.eventHomePage.banner.controller;

import com.ict.eventHomePage.banner.controller.request.BannerRequest;
import com.ict.eventHomePage.banner.controller.response.BannerResponse;
import com.ict.eventHomePage.banner.service.BannerService;
import com.ict.eventHomePage.common.response.SuccessOfFailResponse;
import com.ict.eventHomePage.domain.Events;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/banner")
@RequiredArgsConstructor
public class BannerManagerController {

    private final BannerService bannerService;

    @PostMapping("/searchEvents")
    public ResponseEntity<Map<String, List<Events>>> searchEventsFromDb(@RequestBody Map<String, String> searchParams) {
        String title = searchParams.get("title");
        String startDateStr = searchParams.get("startDate");
        String addr = searchParams.get("addr");

        LocalDateTime startDate = null;
        if (startDateStr != null && !startDateStr.isEmpty()) {
            try {
                startDate = LocalDateTime.parse(startDateStr + "T00:00:00");
            } catch (Exception e) {
                System.err.println("날짜 변환 오류: " + e.getMessage());
            }
        }

        List<Events> events = bannerService.searchEvents(title, startDate, addr);
        Map<String, List<Events>> response = new HashMap<>();
        response.put("list", events);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create")
    public SuccessOfFailResponse createBanner(@RequestBody BannerRequest request) {
        return SuccessOfFailResponse.builder().result(bannerService.createBanner(request)).build();
    }

    @GetMapping("/bannerList")
    public ResponseEntity<Map<String, Object>> getBannerList(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "5") int size) {
        Map<String, Object> response = bannerService.getAllBanners(page, size);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{no}")
    public ResponseEntity<String> updateBanner(@PathVariable("no") Integer no, @RequestBody Map<String, Object> bannerData) {
        try {
            Integer eventNo = Integer.parseInt(bannerData.get("eventNo").toString());
            String fileId = bannerData.get("fileId").toString();
            String color = bannerData.get("color").toString();
            LocalDateTime startDate = LocalDateTime.parse(bannerData.get("startDate").toString() + "T00:00:00");
            LocalDateTime endDate = LocalDateTime.parse(bannerData.get("endDate").toString() + "T00:00:00");

            bannerService.updateBanner(no, eventNo, fileId, color, startDate, endDate);
            return ResponseEntity.ok("Banner updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating banner: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{no}")
    public ResponseEntity<String> deleteBanner(@PathVariable("no") Integer no) {
        try {
            bannerService.deleteBanner(no);
            return ResponseEntity.ok("Banner deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting banner: " + e.getMessage());
        }
    }

    @GetMapping
    public List<BannerResponse> homeBannerList() {
        return bannerService.getHomeBannerList();
    }
}