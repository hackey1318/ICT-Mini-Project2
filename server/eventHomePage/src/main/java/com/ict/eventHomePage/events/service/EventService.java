package com.ict.eventHomePage.events.service;

import com.ict.eventHomePage.domain.EventImages;
import com.ict.eventHomePage.domain.Events;
import com.ict.eventHomePage.domain.PagingVO;
import com.ict.eventHomePage.events.repository.EventImagesRepository;
import com.ict.eventHomePage.events.repository.EventsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventsRepository eventsRepository;
    private final EventImagesRepository e_repo;

    public List<Events> getAllEvents() {
        return eventsRepository.findAll();
    }

    public Events getEventByNo(int no) {
        return eventsRepository.findById(no).orElse(null);
    }

    public Page<Events> searchEventsWithPaging(Pageable pageable, String searchTerm, LocalDateTime selectedDate) {

        return eventsRepository.searchEvents(searchTerm, selectedDate, pageable);
    }

    // 기존 검색 로직은 유지합니다.
//    public List<Events> searchEvents(String searchTerm, LocalDateTime selectedDate) {
//        List<Events> allEvents = eventsRepository.findAll();
//
//        return allEvents.stream()
//                .filter(event -> {
//                    boolean isTitleMatch = (searchTerm == null || searchTerm.isEmpty()) ||
//                            event.getTitle().toLowerCase().contains(searchTerm.toLowerCase());
//                    boolean isAddrMatch = (searchTerm == null || searchTerm.isEmpty()) ||
//                            event.getAddr().toLowerCase().contains(searchTerm.toLowerCase());
//                    boolean isDateMatch = (selectedDate == null) ||
//                            (selectedDate.isAfter(event.getStartDate().minusDays(1)) && selectedDate.isBefore(event.getEndDate().plusDays(1)));
//                    return (isTitleMatch || isAddrMatch) && isDateMatch;
//                })
//                .collect(Collectors.toList());
//    }
    public List<Events> getOngoingEvents() {
        return eventsRepository.findOngoingEvents();
    }
    public List<EventImages> selectImages(int id){
        return e_repo.findAllByEventNo(id);
    }
}
