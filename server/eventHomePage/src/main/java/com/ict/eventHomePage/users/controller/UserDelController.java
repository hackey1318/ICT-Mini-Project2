package com.ict.eventHomePage.users.controller;

import com.ict.eventHomePage.common.config.AuthCheck;
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

    //회원탈퇴 페이지 접속
    /*
    @PostMapping("/userDel")
    public Optional<Users> joinEdit(@RequestBody Users users){
        Users user = authService.getUser(AuthCheck.getUserId(USER, ADMIN));

        System.out.println("!!!"+users.toString());

        return service.joinSelect(users);
    }
    */


    //회원탈퇴(DB)
    @PostMapping("/userDelOk")
    public String userDel(@RequestBody WithdrawReasons reasons){
        System.out.println(reasons.toString());

        String userId = AuthCheck.getUserId(USER, ADMIN);



        return service.userDel();
    }
}
