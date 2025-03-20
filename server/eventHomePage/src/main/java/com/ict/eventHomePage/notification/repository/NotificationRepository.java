package com.ict.eventHomePage.notification.repository;

import com.ict.eventHomePage.notification.domain.Notification;
import com.ict.eventHomePage.notification.domain.constant.NotificationStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    @Query("SELECT COUNT(n.id) FROM Notification AS n WHERE n.userNo = :userNo AND n.status = :status")
    int getReadableNotificationCountForUser(@Param("userNo") int userNo, @Param("status") NotificationStatus status);

    @Query("SELECT n FROM Notification AS n WHERE n.userNo = :userNo AND n.status = :status")
    List<Notification> getReadableNotificationListForUser(@Param("userNo")int userNo, @Param("status") NotificationStatus status);

    @Modifying
    @Transactional
    @Query("UPDATE Notification AS n SET n.status = :status WHERE n.userNo = :userNo AND n.id in (:notificationNoList)")
    int readNotification(@Param("status") NotificationStatus status, @Param("userNo")int userNo, @Param("notificationNoList") List<Integer> notificationNoList);
}
