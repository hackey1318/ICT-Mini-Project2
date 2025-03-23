package com.ict.eventHomePage.list.service;

import com.ict.eventHomePage.domain.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserListService {
    Page<Users> getUserList(String searchWord, Pageable pageable);
}