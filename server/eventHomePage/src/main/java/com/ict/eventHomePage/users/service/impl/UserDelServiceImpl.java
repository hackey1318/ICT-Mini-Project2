package com.ict.eventHomePage.users.service.impl;

import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.domain.WithdrawReasons;
import com.ict.eventHomePage.users.repository.ReasonRepository;
import com.ict.eventHomePage.users.repository.UsersRepository;
import com.ict.eventHomePage.users.service.UserDelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserDelServiceImpl implements UserDelService {
    private final UsersRepository usersRepository;
    private final ReasonRepository reasonRepository;

    @Override
    public void delReason(WithdrawReasons reasons) {
        reasonRepository.save(reasons);
    }

    @Override
    public int userDel(int userNo) {
        return usersRepository.updateStatusToDelete(userNo);
    }
}
