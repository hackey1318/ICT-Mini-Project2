package com.ict.eventHomePage.list.repository;

import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.domain.constant.StatusInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserListRepository extends JpaRepository<Users, Integer> {
    Page<Users> findByNameContainingAndStatus(String searchWord, StatusInfo status, Pageable pageable);
    Page<Users> findByStatus(StatusInfo status, Pageable pageable);
}
