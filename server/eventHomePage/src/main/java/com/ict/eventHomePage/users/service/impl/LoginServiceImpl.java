package com.ict.eventHomePage.users.service.impl;

import com.ict.eventHomePage.common.config.JwtTokenProvider;
import com.ict.eventHomePage.common.exception.custom.UserAuthenticationException;
import com.ict.eventHomePage.common.exception.custom.UserStatusException;
import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.domain.constant.StatusInfo;
import com.ict.eventHomePage.users.controller.request.LoginRequest;
import com.ict.eventHomePage.users.repository.UsersRepository;
import com.ict.eventHomePage.users.service.LoginService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {

    private final UsersRepository usersRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public String loginSelect(LoginRequest request) {
        Users userInfo = usersRepository.findByUserId(request.getUserId()).orElseThrow(() -> new IllegalArgumentException("없는 사용자입니다."));

        if (!StatusInfo.ACTIVE.equals(userInfo.getStatus())) {
            throw new UserStatusException("활성화 되지 않은 사용자입니다. 관리자에게 문의 바랍니다.");
        }

        if (!bCryptPasswordEncoder.matches(request.getPw(), userInfo.getPw())) {
            throw new UserAuthenticationException("패스워드가 올바르지 않습니다. 다시 확인 바랍니다.");
        }

        return jwtTokenProvider.generateAccessToken(request.getUserId(), userInfo.getRole().name());
    }

    @Override
    public Users idFind(Users usersVO) {
        return usersRepository.findByNameAndEmail(usersVO.getName(), usersVO.getEmail());
    }

    @Override
    public Users pwFind(Users usersVO) {
        return usersRepository.findByUserIdAndEmail(usersVO.getUserId(), usersVO.getEmail());
    }

    @Override
    public Users usersUpdate(Users usersVO) {
        usersVO.setPw(bCryptPasswordEncoder.encode(usersVO.getPw()));
        System.out.println("데이터넣기전 최종 데이터 확인 ====> "+usersVO);

        return usersRepository.save(usersVO);
    }

}
