package com.ict.eventHomePage.events.service;

import com.ict.eventHomePage.domain.Events;
import com.ict.eventHomePage.events.repository.EventsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventsRepository eventsRepository;

    public List<Events> getAllEvents() {
        return eventsRepository.findAll();
    }

    public Events getEventByNo(int no) {
        return eventsRepository.findById(no).orElse(null);
    }

    public List<Events> searchEvents(String searchTerm, LocalDateTime selectedDate) {
        List<Events> allEvents = eventsRepository.findAll();

        return allEvents.stream()
                .filter(event -> {
                    boolean isTitleMatch = (searchTerm == null || searchTerm.isEmpty()) ||
                            event.getTitle().toLowerCase().contains(searchTerm.toLowerCase());
                    boolean isDateMatch = (selectedDate == null) ||
                            (selectedDate.isAfter(event.getStartDate().minusDays(1)) && selectedDate.isBefore(event.getEndDate().plusDays(1)));
                    return isTitleMatch && isDateMatch;
                })
                .collect(Collectors.toList());
    }
}