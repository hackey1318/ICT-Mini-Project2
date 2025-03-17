package com.ict.eventHomePage.banner.repository;

import com.ict.eventHomePage.domain.Events;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Events, Long> {
    List<Events> findByTitleContainingAndStartDateAndAddrAndAreaCode(String title, LocalDateTime startDate, String addr, int areaCode); // 메서드 이름 변경
}