package com.ict.eventHomePage.events.repository;

import com.ict.eventHomePage.domain.Events;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventsRepository extends JpaRepository<Events, Integer> {

    @Query("SELECT e FROM Events e " +
            "WHERE (:searchTerm IS NULL OR :searchTerm = '' OR LOWER(e.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(e.addr) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
            "AND (:selectedDate IS NULL OR (:selectedDate > e.startDate AND :selectedDate < e.endDate))")
    Page<Events> searchEvents(@Param("searchTerm") String searchTerm, @Param("selectedDate") LocalDateTime selectedDate, Pageable pageable);

    @Query("SELECT e FROM Events e WHERE e.endDate >= CURRENT_DATE ORDER BY e.startDate ASC")
    List<Events> findOngoingEvents();
}
