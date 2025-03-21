package com.ict.eventHomePage.reply.repository;

import com.ict.eventHomePage.domain.Replies;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReplyRepository extends JpaRepository<Replies, Integer> {

    @Query("SELECT r FROM Replies r WHERE r.eventNo = :eventNo ORDER BY r.createdAt DESC")
    List<Replies> findByEventNoOrderByEventNoDesc(@Param("eventNo") int eventNo);
}


