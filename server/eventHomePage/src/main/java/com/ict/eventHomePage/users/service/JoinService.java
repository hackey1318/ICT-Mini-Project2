package com.ict.eventHomePage.users.service;

import com.ict.eventHomePage.domain.Users;

import java.util.Optional;

public interface JoinService {
    Users createJoin(Users users);

    Optional<Users> joinSelect(Users users);

    boolean checkId(Users users);

    int joinUpdate(Users users);
}
