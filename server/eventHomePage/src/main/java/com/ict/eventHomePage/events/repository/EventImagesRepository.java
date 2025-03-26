package com.ict.eventHomePage.events.repository;

import com.ict.eventHomePage.domain.EventImages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventImagesRepository extends JpaRepository<EventImages, Integer> {

    List<EventImages> findAllByEventNo(int id);

    @Query("SELECT ei FROM EventImages AS ei INNER JOIN (SELECT ei2.eventNo AS eventNo, MIN(ei2.no) AS min_no FROM EventImages AS ei2 WHERE ei2.eventNo IN :eventNoList GROUP BY ei2.eventNo) AS sub ON ei.eventNo = sub.eventNo AND ei.no = sub.min_no")
    List<EventImages> findFirstImagesByEventNoList(@Param("eventNoList") List<Integer> eventNoList);
}
