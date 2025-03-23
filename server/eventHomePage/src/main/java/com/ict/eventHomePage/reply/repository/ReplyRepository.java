package com.ict.eventHomePage.reply.repository;

import com.ict.eventHomePage.domain.Replies;
import com.ict.eventHomePage.domain.constant.StatusInfo;
import com.ict.eventHomePage.reply.controller.response.ReplyResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Repository
public interface ReplyRepository extends JpaRepository<Replies, Integer> {

    @Query("SELECT new com.ict.eventHomePage.reply.controller.response.ReplyResponse(r.no as no, r.userNo as userNo, u.name as name, r.title as title, r.content as content, r.status as status, r.createdAt as createdAt, r.updatedAt as updatedAt) FROM Replies r left join Users u on r.userNo = u.no WHERE r.eventNo = :eventNo ORDER BY r.createdAt DESC")
    List<ReplyResponse> findByEventNoOrderByEventNoDesc(@Param("eventNo") int eventNo);

    @Query(value = "SELECT r.no, r.user_no AS userNo, e.title AS joinedTitle, r.content, r.created_at AS createdAt, " +
            "r.event_no AS eventNo, r.status " +
            "FROM replies r JOIN events e ON r.event_no = e.no " +
            "WHERE r.user_no = :currentUserNo AND r.status = :status", nativeQuery = true)
    List<Map<String, Object>> getReplyListByUserNo(@Param("currentUserNo") int currentUserNo, @Param("status") String status);

    @Query(value = "SELECT r.no, r.user_no AS userNo, e.title AS joinedTitle, r.content, r.created_at, r.event_no AS eventNo " +
            "FROM replies r JOIN events e ON r.event_no = e.no " +
            "WHERE r.user_no = :currentUserNo AND r.status = 'active'", nativeQuery = true)
    List<Map<String, Object>> getReplyListByUserNo(int currentUserNo);


    @Modifying
    @Transactional
    @Query("UPDATE Replies r SET r.status = :status WHERE r.no = :replyNo")
    void updateStatusByReplyNo(@Param("replyNo") int replyNo, @Param("status") StatusInfo status);
}