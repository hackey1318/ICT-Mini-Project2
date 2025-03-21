package com.ict.eventHomePage.reply.repository;

import com.ict.eventHomePage.domain.ReplyImages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReplyImagesRepository extends JpaRepository<ReplyImages, Integer> {

}