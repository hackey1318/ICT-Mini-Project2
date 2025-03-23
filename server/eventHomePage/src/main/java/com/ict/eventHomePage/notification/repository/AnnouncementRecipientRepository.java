package com.ict.eventHomePage.notification.repository;

import com.ict.eventHomePage.notification.domain.AnnouncementRecipient;
import com.ict.eventHomePage.notification.domain.constant.NotificationStatus;
import com.ict.eventHomePage.notification.service.dto.AnnounceRecipientInfo;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRecipientRepository extends JpaRepository<AnnouncementRecipient, Integer> {

    @Query("SELECT new com.ict.eventHomePage.notification.service.dto.AnnounceRecipientInfo(u.email AS email, ap.status AS status) FROM AnnouncementRecipient AS ap LEFT JOIN Users AS u ON u.no = ap.userNo WHERE announcementId = :announceId")
    List<AnnounceRecipientInfo> getAnnouncementRecipient(@Param("announceId") int announceId);

    @Modifying
    @Transactional
    @Query("UPDATE AnnouncementRecipient AS n SET n.status = :status WHERE n.userNo = :userNo AND n.id in (:notificationNoList)")
    void readAnnounce(@Param("status") NotificationStatus status, @Param("userNo")int userNo, @Param("notificationNoList") List<Integer> notificationNoList);
}
