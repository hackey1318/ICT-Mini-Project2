package com.ict.eventHomePage.users.controller;

import com.ict.eventHomePage.common.config.AuthCheck;
import com.ict.eventHomePage.common.config.AuthRequired;
import com.ict.eventHomePage.common.response.SuccessOfFailResponse;
import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.users.controller.response.LikesResponse;
import com.ict.eventHomePage.users.service.AuthService;
import com.ict.eventHomePage.users.service.LikesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.ict.eventHomePage.domain.constant.UserRole.*;

@Slf4j
@RestController
@RequestMapping("/like")
@RequiredArgsConstructor
public class LikeController {

    private final AuthService authService;
    private final LikesService likesService;

    @AuthRequired({USER, ADMIN})
    @GetMapping("/{eventId}")
    public SuccessOfFailResponse getlikeEvent(@PathVariable("eventId") int eventId) {

        Users user = authService.getUser(AuthCheck.getUserId(USER, ADMIN));

        return SuccessOfFailResponse.builder()
                .result(likesService.getLikeEvent(user, eventId)).build();
    }

    @AuthRequired({USER, ADMIN})
    @PostMapping("/{eventId}")
    public SuccessOfFailResponse likeEvent(@PathVariable("eventId") int eventId) {

        Users user = authService.getUser(AuthCheck.getUserId(USER, ADMIN));

        return SuccessOfFailResponse.builder()
                .result(likesService.likeEvent(user, eventId)).build();
    }

    @GetMapping
    @AuthRequired({USER, ADMIN})
    public List<LikesResponse> getLikeEvent() {

        Users user = authService.getUser(AuthCheck.getUserId(USER, ADMIN));

        return likesService.getLikeEvent(user);
    }

    @PatchMapping("/{eventId}")
    @AuthRequired({USER, ADMIN})
    public SuccessOfFailResponse updateLikeEvent(@PathVariable("eventId") int eventId) {

        Users user = authService.getUser(AuthCheck.getUserId(USER, ADMIN));

        return SuccessOfFailResponse.builder()
                .result(likesService.changeLikeEvent(user, eventId)).build();
    }
}
