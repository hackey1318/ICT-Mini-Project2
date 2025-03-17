package com.ict.eventHomePage.banner.controller;

import com.ict.eventHomePage.banner.service.BannerService;
import com.ict.eventHomePage.domain.Banners;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/banner")
@RequiredArgsConstructor
public class BanneManagerController {

//    private final BannerService bannerService;
//
//    @PostMapping("/searchEvents")
//    public ResponseEntity<Map<String, List<Banners>>> searchEventsFromDb(@RequestBody Map<String, String> searchParams) {
//        String name = searchParams.get("name");
//        String eventDate = searchParams.get("eventdate");
//        String eventCity = searchParams.get("eventcity");
//        String eventGu = searchParams.get("eventgu");
//
//        List<Banners> events = bannerService.searchEvents(name, eventDate, eventCity, eventGu);
//
//        Map<String, List<Banners>> response = new HashMap<>();
//        response.put("list", events);
//
//        return ResponseEntity.ok(response);
//    }
}
