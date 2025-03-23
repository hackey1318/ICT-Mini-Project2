package com.ict.eventHomePage.list.repository;

import com.ict.eventHomePage.domain.WithdrawReasons;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDelListRepository extends JpaRepository<WithdrawReasons, Integer> {
}