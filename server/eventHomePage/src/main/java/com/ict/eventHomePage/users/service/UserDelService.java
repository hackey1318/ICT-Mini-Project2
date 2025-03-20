package com.ict.eventHomePage.users.service;

import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.domain.WithdrawReasons;

import java.util.Optional;

public interface UserDelService {
    //탈퇴사유 저장
    void delReason(WithdrawReasons reasons);

    //users테이블에 상태를 DELETE로 변경
    int userDel(int userNo);
}
