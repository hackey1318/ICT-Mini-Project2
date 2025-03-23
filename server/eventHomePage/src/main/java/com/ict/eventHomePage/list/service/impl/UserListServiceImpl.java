package com.ict.eventHomePage.list.service.impl;

import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.domain.constant.StatusInfo;
import com.ict.eventHomePage.list.repository.UserListRepository;
import com.ict.eventHomePage.list.service.UserListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class UserListServiceImpl implements UserListService {
    @Autowired
    private UserListRepository userListRepository;

    @Override
    public Page<Users> getUserList(String searchWord, Pageable pageable) {
        if (searchWord != null && !searchWord.isEmpty()) {
            return userListRepository.findByNameContainingAndStatus(searchWord, StatusInfo.ACTIVE, pageable);
        }
        return userListRepository.findByStatus(StatusInfo.ACTIVE, pageable);
    }
}
