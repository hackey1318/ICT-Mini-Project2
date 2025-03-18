package com.ict.eventHomePage.users.service.impl;

import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.domain.constant.StatusInfo;
import com.ict.eventHomePage.domain.constant.UserRole;
import com.ict.eventHomePage.users.repository.UsersRepository;
import com.ict.eventHomePage.users.service.JoinService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JoinServiceImpl implements JoinService {
    private final UsersRepository usersRepository;

    //회원가입
    @Override
    public Users createJoin(Users users) {
        users.setRole(UserRole.USER); //enum 값 사용
        users.setStatus(StatusInfo.ACTIVE); //enum 값 사용

        return usersRepository.save(users);
    }

    //회원선택
    @Override
    public Optional<Users> joinSelect(Users users) {
        return usersRepository.findByUserId(users.getUserId());
    }
}
