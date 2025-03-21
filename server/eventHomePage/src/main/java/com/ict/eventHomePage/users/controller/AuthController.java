package com.ict.eventHomePage.users.controller;

import com.ict.eventHomePage.common.config.AuthCheck;
import com.ict.eventHomePage.common.exception.custom.UserAuthenticationException;
import com.ict.eventHomePage.common.response.SuccessOfFailResponse;
import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.domain.constant.UserRole;
import com.ict.eventHomePage.users.controller.request.AuthRequest;
import com.ict.eventHomePage.users.controller.response.UserResponse;
import com.ict.eventHomePage.users.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final ModelMapper modelMapper;

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

    @GetMapping
    public SuccessOfFailResponse getRole() {
        boolean res = true;
        try {
            String userId = AuthCheck.getUserId(UserRole.ADMIN);
        } catch (Exception e) {
            res = false;
        }
        return SuccessOfFailResponse.builder().result(res).build();
    }

    @GetMapping("/user")
    public UserResponse getUserInfo() {

        Users user = authService.getUser(AuthCheck.getUserId(UserRole.ADMIN, UserRole.USER));

        return modelMapper.map(user, UserResponse.class);
    }
}
