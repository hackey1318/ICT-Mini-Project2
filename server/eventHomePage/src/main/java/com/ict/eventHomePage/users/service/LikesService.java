package com.ict.eventHomePage.users.service;

import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.users.controller.response.LikesResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface LikesService {

    boolean getLikeEvent(Users users, int eventId);

    boolean likeEvent(Users users, int eventId);

    Page<LikesResponse> getLikeEvent(Users users, Pageable pageable);

    boolean changeLikeEvent(Users users, int eventId);
}
