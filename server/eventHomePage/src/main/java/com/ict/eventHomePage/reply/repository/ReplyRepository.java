package com.ict.eventHomePage.reply.repository;

import com.ict.eventHomePage.domain.Replies;
import com.ict.eventHomePage.domain.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.converter.json.GsonBuilderUtils;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReplyRepository extends JpaRepository<Replies, Integer> {

    List<Replies> findRepliesByUserNo(int userNo);

    //@Query("SELECT COUNT(n.id) FROM Replies AS n WHERE n.userNo = :userNo AND n.status = READABLE")
    //Optional<Replies> findByUserId(int userNo);

}


