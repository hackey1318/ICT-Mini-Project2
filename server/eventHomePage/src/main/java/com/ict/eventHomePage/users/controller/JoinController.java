package com.ict.eventHomePage.users.controller;

import com.ict.eventHomePage.common.config.AuthCheck;
import com.ict.eventHomePage.common.config.AuthRequired;
import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.users.service.AuthService;
import com.ict.eventHomePage.users.service.JoinService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

import static com.ict.eventHomePage.domain.constant.UserRole.ADMIN;
import static com.ict.eventHomePage.domain.constant.UserRole.USER;

@Slf4j
@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
public class JoinController {
    private final JoinService service;
    private final BCryptPasswordEncoder bCryptPasswordEncoder; //비밀번호 암호화를 위한 객체 생성
    private final AuthService authService;

    //아이디 중복확인
    @PostMapping("/checkId")
    public boolean checkId(@RequestBody Users users){
        return service.checkId(users);
    }

    //회원가입 페이지
    @PostMapping("/joinFormOk")
    public String joinFormOk(@RequestBody Users users){
        //비밀번호 암호화
        String encodedPassword = bCryptPasswordEncoder.encode(users.getPw());
        users.setPw(encodedPassword);  //암호화된 비밀번호를 설정

        //회원가입 처리
        Users result = service.createJoin(users);

        if(result!=null && result.getNo()>0){ //회원등록
            return "ok";
        }else{ //회원등록 실패
            return "fail";
        }
    }

    //회원정보수정 페이지
    @PostMapping("/joinEdit")
    @AuthRequired({USER, ADMIN})
    public Optional<Users> joinEdit(@RequestBody Users users){
        Users user = authService.getUser(AuthCheck.getUserId(USER, ADMIN));

        return service.joinSelect(user);
    }

    //회원정보수정(DB)
    @PostMapping("/joinEditOk")
    @AuthRequired({USER, ADMIN})
    public String joinEditOk(@RequestBody Users users){
        Users user = authService.getUser(AuthCheck.getUserId(USER, ADMIN));
        users.setNo(user.getNo());
        int result = service.joinUpdate(users);

        return "ok";
    }

    @PostMapping("/pwdCheck")
    @AuthRequired({USER, ADMIN})
    public String pwdCheck(@RequestBody Users users){
        System.out.println("받은 사용자 비밀번호 (body): " + users.getPw());

        // 입력받은 비밀번호를 암호화한 값
        String pwdChk = users.getPw();  // 암호화된 값으로 비교할 필요 없음

        Users user = authService.getUser(AuthCheck.getUserId(USER, ADMIN));

        // 암호화된 비밀번호와 비교
        if (bCryptPasswordEncoder.matches(pwdChk, user.getPw())) {
            return "pwdOk";
        } else {
            return "pwdFail";
        }
    }
}
