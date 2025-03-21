package com.ict.eventHomePage.notification.repository;

import com.ict.eventHomePage.notification.domain.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Integer> {

    List<Announcement> findByAdminNo(int adminNo);
}
