package com.ict.eventHomePage.users.service;

import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.users.controller.response.LikesResponse;

import java.util.List;

public interface LikesService {

    boolean likeEvent(Users users, int eventId);

    List<LikesResponse> getLikeEvent(Users users);

    boolean changeLikeEvent(Users users, int eventId);
}
