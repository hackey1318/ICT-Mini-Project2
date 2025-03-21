package com.ict.eventHomePage.users.controller;

import com.ict.eventHomePage.common.config.AuthCheck;
import com.ict.eventHomePage.common.config.AuthRequired;
import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.domain.WithdrawReasons;
import com.ict.eventHomePage.users.service.AuthService;
import com.ict.eventHomePage.users.service.UserDelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

import static com.ict.eventHomePage.domain.constant.UserRole.ADMIN;
import static com.ict.eventHomePage.domain.constant.UserRole.USER;

@RestController
@Slf4j
@RequestMapping("/member")
@RequiredArgsConstructor
public class UserDelController {
    private final UserDelService service;
    private final AuthService authService;

    //회원탈퇴
    @PostMapping("/userDelOk")
    @AuthRequired({USER, ADMIN})
    public int userDel(@RequestBody WithdrawReasons reasons){
        String userId = AuthCheck.getUserId(USER, ADMIN);
        int userNo = authService.getUser(userId).getNo();
        reasons.setUserNo(userNo);

        //탈퇴사유 저장
        service.delReason(reasons);

        //users테이블에 상태를 DELETE로 변경
        return service.userDel(userNo);
    }
}
