package com.ict.eventHomePage.notification.repository;

import com.ict.eventHomePage.notification.domain.AnnouncementRecipient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRecipientRepository extends JpaRepository<AnnouncementRecipient, Integer> {

    @Query("SELECT u.email FROM AnnouncementRecipient AS ap LEFT JOIN Users AS u ON u.no = ap.userNo WHERE announcementId = :announcementId")
    List<String> getAnnouncementRecipient(@Param("announceId") int announceId);
}
