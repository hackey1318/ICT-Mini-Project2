package com.ict.eventHomePage.users.service;

import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.users.controller.request.AuthRequest;
import com.ict.eventHomePage.users.controller.response.UserResponse;

import java.util.List;

public interface AuthService {

    String login(AuthRequest request);

    Users getUser(String userId);

    List<UserResponse> getUserInRegion(List<String> regionList);
}
