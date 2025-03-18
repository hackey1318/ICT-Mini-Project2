package com.ict.eventHomePage.users.controller;

import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.users.service.JoinService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
public class JoinController {
    private final JoinService service;

    //회원가입 페이지
    @PostMapping("/joinFormOk")
    public String joinFormOk(@RequestBody Users users){
        System.out.println(users.toString());

        Users result = service.createJoin(users);

        if(result!=null && result.getNo()>0){ //회원등록
            return "ok";
        }else{
            return "fail";
        }
    }

    //회원정보수정 페이지
    @PostMapping("/joinEdit")
    public Optional<Users> joinEdit(@RequestBody Users users){
        System.out.println(users.toString());

        return service.joinSelect(users);
    }

    //회원정보수정(DB)
    @PostMapping("/joinEditOk")
    public String joinEditOk(@RequestBody Users users){
        System.out.println(users);

        Optional<Users> checkUser = service.joinSelect(users);
        Users result = service.createJoin(users);

        return null;
    }
}
