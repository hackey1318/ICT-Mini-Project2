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

    //아이디 중복확인
    @Override
    public boolean checkId(Users users) {
        Optional<Users> userInfo = usersRepository.findByUserId(users.getUserId());

        System.out.println("userInfo=>"+userInfo);

        if(userInfo.isEmpty()){
            System.out.println("아이디가 중복되지 않음");
            return false; // 아이디가 없으면 false 반환 (중복되지 않음)
        }else{
            System.out.println("중복아이디 => " + userInfo.get().getUserId()); // 존재하는 아이디 출력
            return true; // 아이디가 존재하면 true 반환 (중복됨)
        }
    }

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

    //회원정보 수정
    @Override
    public int joinUpdate(Users users) {
        return usersRepository.joinUpdate(users.getNo(), users.getEmail(), users.getTel(), users.getPostalCode(), users.getAddr());
    }
}
