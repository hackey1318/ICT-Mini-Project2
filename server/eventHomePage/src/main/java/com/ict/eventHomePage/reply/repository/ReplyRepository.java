package com.ict.eventHomePage.reply.repository;

import com.ict.eventHomePage.domain.Replies;
import com.ict.eventHomePage.domain.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.converter.json.GsonBuilderUtils;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReplyRepository extends JpaRepository<Replies, Integer> {

    @Query("SELECT r FROM Replies r WHERE r.eventNo = :eventNo ORDER BY r.createdAt DESC")
    List<Replies> findByEventNoOrderByEventNoDesc(@Param("eventNo") int eventNo);


    //List<Replies> findRepliesByUserNo(int userNo);

    //@Query("SELECT COUNT(n.id) FROM Replies AS n WHERE n.userNo = :userNo AND n.status = READABLE")
    //Optional<Replies> findByUserId(int userNo);

    /*@Query(value = "SELECT r.no, r.user_no AS userNo, e.title AS joinedTitle, r.content, r.created_at, r.event_no AS eventNo " +
            "FROM replies r JOIN events e ON r.event_no = e.no " +
            "WHERE r.user_no = :currentUserNo AND r.status = 'active'", nativeQuery = true)
    List<Map<String, Object>> getReplyListByUserNo(int currentUserNo);

    @Modifying
    @Transactional
    @Query("UPDATE Replies r SET r.status = :status WHERE r.no = :replyNo")
    void updateStatusByReplyNo(@Param("replyNo") int replyNo, @Param("status") StatusInfo status);*/


}


