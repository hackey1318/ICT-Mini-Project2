package com.ict.eventHomePage.events.repository;

import com.ict.eventHomePage.domain.EventImages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventImagesRepository extends JpaRepository<EventImages, Integer> {

    List<EventImages> findAllByEventNo(int id);
}
