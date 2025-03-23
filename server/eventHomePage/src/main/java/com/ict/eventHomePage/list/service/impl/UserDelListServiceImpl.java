package com.ict.eventHomePage.list.service.impl;

import com.ict.eventHomePage.domain.WithdrawReasons;
import com.ict.eventHomePage.list.repository.UserDelListRepository;
import com.ict.eventHomePage.list.service.UserDelListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class UserDelListServiceImpl implements UserDelListService {
    @Autowired
    private UserDelListRepository userDelListRepository;

    @Override
    public Page<WithdrawReasons> getWithdrawReasonsList(String searchWord, Pageable pageable) {
        return userDelListRepository.findAll(pageable);
    }
}