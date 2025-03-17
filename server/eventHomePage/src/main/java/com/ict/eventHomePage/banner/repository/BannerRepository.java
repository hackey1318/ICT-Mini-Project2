package com.ict.eventHomePage.banner.repository;

import com.ict.eventHomePage.domain.Banners;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banners, Long> {
    List<Banners> findByTitleContainingAndStartDateAndCityAndGu(String title, String startDate, String city, String gu);

    // 필요한 추가적인 쿼리 메서드 정의 가능
}
