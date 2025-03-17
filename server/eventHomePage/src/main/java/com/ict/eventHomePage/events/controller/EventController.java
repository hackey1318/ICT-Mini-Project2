package com.ict.eventHomePage.events.controller;

import com.ict.eventHomePage.domain.EventImages;
import com.ict.eventHomePage.domain.Events;
import com.ict.eventHomePage.domain.EventsVO;
import com.ict.eventHomePage.events.service.EventService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;

    private final ModelMapper modelMapper;

    @GetMapping("/events")
    public ResponseEntity<List<Events>> getAllEvents() {
        List<Events> events = eventService.getAllEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @GetMapping("/events/ongoing") // 현재날 기준 상단 배너 노출
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
    public ResponseEntity<Events> getEventByNo(@PathVariable int no) {
        Events event = eventService.getEventByNo(no);
        if (event != null) {
            return new ResponseEntity<>(event, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/events/search")
    public ResponseEntity<List<EventsVO>> searchEvents(
            @RequestParam(required = false, value = "searchTerm") String searchTerm,
            @RequestParam(required = false, value = "selectedDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime selectedDate) {
        try {
            List<Events> events = eventService.searchEvents(searchTerm, selectedDate);
            List<EventsVO> result = new ArrayList<>();
            for (Events event : events) {
                EventsVO evo = modelMapper.map(event, EventsVO.class);
                evo.setImg_list(eventService.selectImages(event.getNo()));
                result.add(evo);
            }
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error in searchEvents: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error 반환
        }
    }
}