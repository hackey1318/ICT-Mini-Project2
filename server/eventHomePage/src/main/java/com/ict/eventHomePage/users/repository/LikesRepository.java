package com.ict.eventHomePage.users.repository;

import com.ict.eventHomePage.domain.Likes;
import com.ict.eventHomePage.domain.constant.StatusInfo;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikesRepository extends JpaRepository<Likes, Integer> {

    Optional<Likes> findByUserNoAndEventNo(int userNo, int eventNo);

    Optional<Likes> findByUserNoAndEventNoAndStatus(int userNo, int eventNo, StatusInfo status);

    List<Likes> findByUserNo(int userNo);

    @Modifying
    @Transactional
    @Query("UPDATE Likes SET status = :status WHERE no = :likeNo")
    void updateLike(@Param("likeNo") int likeNo, @Param("status") StatusInfo status);
}
