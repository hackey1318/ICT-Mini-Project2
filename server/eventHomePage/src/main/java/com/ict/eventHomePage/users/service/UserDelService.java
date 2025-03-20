package com.ict.eventHomePage.users.service;

import com.ict.eventHomePage.domain.Users;

import java.util.Optional;

public interface UserDelService {

    Optional<Users> joinSelect(Users users);

    String userDel();

}
