package com.ict.eventHomePage.events.controller;

import com.ict.eventHomePage.domain.Events;
import com.ict.eventHomePage.domain.EventsVO;
import com.ict.eventHomePage.domain.PagingVO;
import com.ict.eventHomePage.events.service.EventService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;
    private final ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<List<Events>> getAllEvents() {
        List<Events> events = eventService.getAllEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @GetMapping("/ongoing") // 현재날 기준 상단 배너 노출
    public ResponseEntity<List<EventsVO>> getOngoingEvents() {
        List<Events> events = eventService.getOngoingEvents();
        List<EventsVO> result = new ArrayList<>();
        for (Events event : events) {
            EventsVO evo = modelMapper.map(event, EventsVO.class);
            evo.setImg_list(eventService.selectImages(event.getNo()));
            result.add(evo);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/{no}")
    public ResponseEntity<EventsVO> getEventByNo(@PathVariable("no") Integer no) {
        Events event = eventService.getEventByNo(no);
        if (event != null) {
            EventsVO evo = modelMapper.map(event, EventsVO.class);
            evo.setImg_list(eventService.selectImages(event.getNo()));
            return new ResponseEntity<>(evo, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchEvents(
            PagingVO pagingVO,
            @RequestParam(required = false, value = "searchTerm") String searchTerm,
            @RequestParam(required = false, value = "selectedDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime selectedDate) {

        try {
            List<Events> events = eventService.searchEventsWithPaging(pagingVO, searchTerm, selectedDate);
            List<EventsVO> result = new ArrayList<>();
            for (Events event : events) {
                EventsVO evo = modelMapper.map(event, EventsVO.class);
                evo.setImg_list(eventService.selectImages(event.getNo()));
                result.add(evo);
            }


            int totalEvents = eventService.getTotalEventsCount(searchTerm, selectedDate);


            pagingVO.setTotalRecord(totalEvents);

            Map<String, Object> response = new HashMap<>();
            response.put("content", result);
            response.put("paging", pagingVO); // PagingVO 객체 자체를 전달

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            System.err.println("Error in searchEvents: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error 반환
        }
    }
}