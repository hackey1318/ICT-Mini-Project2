package com.ict.eventHomePage.users.service.impl;

import com.ict.eventHomePage.common.config.JwtTokenProvider;
import com.ict.eventHomePage.common.exception.custom.UserAuthenticationException;
import com.ict.eventHomePage.common.exception.custom.UserStatusException;
import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.domain.constant.StatusInfo;
import com.ict.eventHomePage.users.controller.request.AuthRequest;
import com.ict.eventHomePage.users.controller.response.UserResponse;
import com.ict.eventHomePage.users.repository.UsersRepository;
import com.ict.eventHomePage.users.repository.impl.UsersRepositoryImpl;
import com.ict.eventHomePage.users.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UsersRepository usersRepository;
    private final UsersRepositoryImpl usersRepositoryImpl;

    private final JwtTokenProvider jwtTokenProvider;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public String login(AuthRequest request) {

        Users userInfo = usersRepository.findByUserId(request.getUserId()).orElseThrow(() -> new IllegalArgumentException("없는 사용자입니다."));

        if (!StatusInfo.ACTIVE.equals(userInfo.getStatus())) {
            throw new UserStatusException("활성화 되지 않은 사용자입니다. 관리자에게 문의 바랍니다.");
        }

        if (!bCryptPasswordEncoder.matches(request.getPassword(), userInfo.getPw())) {
            throw new UserAuthenticationException("패스워드가 올바르지 않습니다. 다시 확인 바랍니다.");
        }

        return jwtTokenProvider.generateAccessToken(request.getUserId(), userInfo.getRole().name());
    }

    @Override
    public Users getUser(String userId) {
        return usersRepository.findByUserId(userId).orElseThrow(() -> new IllegalArgumentException("없는 사용자입니다."));
    }

    @Override
    public List<UserResponse> getUserInRegion(List<String> regionList) {
        return usersRepositoryImpl.getUserInRegion(regionList);
    }
}
