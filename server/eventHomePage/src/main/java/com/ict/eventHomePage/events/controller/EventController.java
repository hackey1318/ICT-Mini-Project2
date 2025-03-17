package com.ict.eventHomePage.events.controller;

import com.ict.eventHomePage.domain.Events;
import com.ict.eventHomePage.events.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<Events>> getAllEvents() {
        List<Events> events = eventService.getAllEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
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

    @GetMapping("/search")
    public ResponseEntity<List<Events>> searchEvents(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime selectedDate) {
        List<Events> events = eventService.searchEvents(searchTerm, selectedDate);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }
}