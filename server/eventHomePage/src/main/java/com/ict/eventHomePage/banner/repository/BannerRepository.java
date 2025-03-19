package com.ict.eventHomePage.banner.repository;

import com.ict.eventHomePage.domain.Banners;
import com.ict.eventHomePage.domain.Events;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banners, Integer> {
    @Query("SELECT e FROM Events e WHERE " +
            "(:title IS NULL OR e.title LIKE :title) AND " +
            "(:startDate IS NULL OR e.startDate >= :startDate) AND " +
            "(:addr IS NULL OR e.addr LIKE :addr)")
    List<Events> findByTitleContainingAndStartDateAndAddr(
            @Param("title") String title,
            @Param("startDate") LocalDateTime startDate,
            @Param("addr") String addr);
}