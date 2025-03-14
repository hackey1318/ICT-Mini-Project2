package com.ict.eventHomePage.events.repository;

import com.ict.eventHomePage.domain.Events;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventsRepository extends JpaRepository<Events, Long> {
}
