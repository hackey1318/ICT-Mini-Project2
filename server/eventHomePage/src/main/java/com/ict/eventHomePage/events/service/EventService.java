package com.ict.eventHomePage.events.service;

import com.ict.eventHomePage.domain.EventImages;
import com.ict.eventHomePage.domain.Events;
import com.ict.eventHomePage.domain.PagingVO;
import com.ict.eventHomePage.events.repository.EventImagesRepository;
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
    private final EventImagesRepository e_repo;

    public List<Events> getAllEvents() {
        return eventsRepository.findAll();
    }

    public Events getEventByNo(int no) {
        return eventsRepository.findById(no).orElse(null);
    }

    public List<Events> searchEventsWithPaging(PagingVO pagingVO, String searchTerm, LocalDateTime selectedDate) {
        List<Events> filteredEvents = searchEvents(searchTerm, selectedDate);

        int startIndex = pagingVO.getOffset();
        int endIndex = Math.min(startIndex + pagingVO.getOnePageRecord(), filteredEvents.size());

        return filteredEvents.subList(startIndex, endIndex);
    }

    public int getTotalEventsCount(String searchTerm, LocalDateTime selectedDate) {
        return searchEvents(searchTerm, selectedDate).size();
    }

    // 기존 검색 로직은 유지합니다.
    public List<Events> searchEvents(String searchTerm, LocalDateTime selectedDate) {
        List<Events> allEvents = eventsRepository.findAll();

        return allEvents.stream()
                .filter(event -> {
                    boolean isTitleMatch = (searchTerm == null || searchTerm.isEmpty()) ||
                            event.getTitle().toLowerCase().contains(searchTerm.toLowerCase());
                    boolean isAddrMatch = (searchTerm == null || searchTerm.isEmpty()) ||
                            event.getAddr().toLowerCase().contains(searchTerm.toLowerCase());
                    boolean isDateMatch = (selectedDate == null) ||
                            (selectedDate.isAfter(event.getStartDate().minusDays(1)) && selectedDate.isBefore(event.getEndDate().plusDays(1)));
                    return (isTitleMatch || isAddrMatch) && isDateMatch;
                })
                .collect(Collectors.toList());
    }
    public List<Events> getOngoingEvents() {
        LocalDateTime now = LocalDateTime.now();
        return eventsRepository.findAll().stream()
                .filter(event -> event.getStartDate().isBefore(now) && event.getEndDate().isAfter(now))
                .collect(Collectors.toList());
    }
    public List<EventImages> selectImages(int id){
        return e_repo.findAllByEventNo(id);
    }
}
