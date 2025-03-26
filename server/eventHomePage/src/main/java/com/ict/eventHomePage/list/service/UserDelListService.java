package com.ict.eventHomePage.list.service;

import com.ict.eventHomePage.domain.WithdrawReasons;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserDelListService {
    Page<WithdrawReasons> getWithdrawReasonsList(String searchWord, Pageable pageable);
}

