package com.ict.eventHomePage.users.repository;

import com.ict.eventHomePage.domain.WithdrawReasons;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReasonRepository extends JpaRepository<WithdrawReasons, Integer> {

}
