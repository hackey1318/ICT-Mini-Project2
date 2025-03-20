package com.ict.eventHomePage.users.service.impl;

import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.users.service.UserDelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserDelServiceImpl implements UserDelService {

    //회원탈퇴페이지 접속
    @Override
    public Optional<Users> joinSelect(Users users) {
        return Optional.empty();
    }

    //회원탈퇴(DB)
    @Override
    public String userDel() {
        return "";
    }


}
