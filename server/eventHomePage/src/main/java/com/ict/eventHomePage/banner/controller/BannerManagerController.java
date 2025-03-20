package com.ict.eventHomePage.banner.controller;

import com.ict.eventHomePage.banner.controller.response.BannerResponse;
import com.ict.eventHomePage.banner.service.BannerService;
import com.ict.eventHomePage.domain.Events;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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
    public ResponseEntity<String> createBanner(
            @RequestParam("eventNo") Integer eventNo,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam("color") String color,
            @RequestParam("file") MultipartFile file) {
        try {
            String fileId = file.getOriginalFilename();
            String uploadDir = "C:/uploads/";
            File uploadDirFile = new File(uploadDir);
            if (!uploadDirFile.exists()) {
                uploadDirFile.mkdirs();
            }
            File dest = new File(uploadDir + fileId);
            file.transferTo(dest);

            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            LocalDateTime start = LocalDateTime.parse(startDate, formatter);
            LocalDateTime end = LocalDateTime.parse(endDate, formatter);

            bannerService.createBanner(eventNo, fileId, color, start, end);

            return ResponseEntity.ok("Banner created successfully");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating banner: " + e.getMessage());
        }
    }

    @GetMapping
    public List<BannerResponse> homeBannerList() {

        return bannerService.getHomeBannerList();
    }
}