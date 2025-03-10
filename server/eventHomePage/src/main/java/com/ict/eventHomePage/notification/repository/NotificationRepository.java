package com.ict.eventHomePage.notification.repository;

import com.ict.eventHomePage.notification.domain.Notification;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    @Query("SELECT COUNT(n.id) FROM Notification AS n WHERE n.userId = :userNo AND n.status = READABLE")
    int getReadableNotificationCountForUser(@Param("userNo") int userNo);

    @Query("SELECT n FROM Notification AS n WHERE n.userId = :userNo AND n.status = READABLE")
    List<Notification> getReadableNotificationListForUser(@Param("userNo")int userNo);

    @Transactional
    @Query("UPDATE Notification AS n SET n.status = READ WHERE n.userId = :userNo AND n.id in (:notificationNoList)")
    int readNotification(@Param("userNo")int userNo, @Param("notificationNoList") List<Integer> notificationNoList);
}
