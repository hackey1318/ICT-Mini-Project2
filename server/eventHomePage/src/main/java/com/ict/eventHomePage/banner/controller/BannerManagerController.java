package com.ict.eventHomePage.banner.controller;

import com.ict.eventHomePage.banner.service.BannerService;
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

    @GetMapping("/")
    public String test() {
        return "hi";
    }

    @PostMapping("/searchEvents")
    public ResponseEntity<Map<String, List<Events>>> searchEventsFromDb(@RequestBody Map<String, String> searchParams) {
        System.out.println("!");
        String title = searchParams.get("title");
        String startDateStr = searchParams.get("startDate");
        String addr = searchParams.get("addr");
        String areaCodeStr = searchParams.get("areaCode");

        LocalDateTime startDate = null;
        if (startDateStr != null && !startDateStr.isEmpty()) {
            try {
                startDate = LocalDateTime.parse(startDateStr + "T00:00:00"); // 🔹 'yyyy-MM-dd' 포맷을 지원하도록 수정
            } catch (Exception e) {
                System.err.println("날짜 변환 오류: " + e.getMessage());
            }
        }

        int areaCode = 0;
        if (areaCodeStr != null && !areaCodeStr.isEmpty()) {
            try {
                areaCode = Integer.parseInt(areaCodeStr);
            } catch (NumberFormatException e) {
                System.err.println("지역 코드 파싱 오류: " + areaCodeStr);
            }
        }

        List<Events> events = bannerService.searchEvents(title, startDate, addr, areaCode);

        Map<String, List<Events>> response = new HashMap<>();
        response.put("list", events);

        return ResponseEntity.ok(response);
    }
}