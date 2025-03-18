package com.ict.eventHomePage.users.service;

import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.users.controller.request.AuthRequest;

public interface AuthService {

    String login(AuthRequest request);

    Users getUser(String userId);
}
