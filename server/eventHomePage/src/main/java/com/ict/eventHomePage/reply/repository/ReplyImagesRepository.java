package com.ict.eventHomePage.reply.repository;

import com.ict.eventHomePage.domain.ReplyImages;
import com.ict.eventHomePage.domain.constant.StatusInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReplyImagesRepository extends JpaRepository<ReplyImages, Integer> {

    @Query("SELECT ri.fileId FROM ReplyImages ri WHERE ri.replyNo = :replyNo AND ri.status = :status")
    List<String> getImageIdList(@Param("replyNo") int replyNo, @Param("status")StatusInfo status);

    @Query("SELECT ri FROM ReplyImages ri WHERE ri.replyNo = :replyNo AND ri.status = :status")
    List<ReplyImages> getReplyImages(@Param("replyNo") int replyNo, @Param("status")StatusInfo status);
}