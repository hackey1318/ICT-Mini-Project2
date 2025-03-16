package com.ict.eventHomePage.users.controller;

import com.ict.eventHomePage.common.exception.custom.UserAuthenticationException;
import com.ict.eventHomePage.common.response.SuccessOfFailResponse;
import com.ict.eventHomePage.users.controller.request.AuthRequest;
import com.ict.eventHomePage.users.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public SuccessOfFailResponse login(@RequestBody AuthRequest request, HttpServletResponse response) {

        String accessToken = authService.login(request);
        if (accessToken == null || accessToken.trim().isEmpty()) {
            throw new UserAuthenticationException("로그인에 실패하였습니다.");
        }
        response.setHeader("accessToken", accessToken);
        return SuccessOfFailResponse.builder()
                .result(true).build();
    }
}
