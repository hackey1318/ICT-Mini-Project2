package com.ict.eventHomePage.users.service;

import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.users.controller.request.LoginRequest;

public interface LoginService {

    // 로그인정보조회
    String loginSelect(LoginRequest request);

    Users idFind(Users usersVO);

    Users pwFind(Users usersVO);

    Users usersUpdate(Users usersVO);
}
