package com.ict.eventHomePage.reply.controller;

import com.ict.eventHomePage.common.config.AuthCheck;
import com.ict.eventHomePage.common.response.SuccessOfFailResponse;
import com.ict.eventHomePage.domain.Events;
import com.ict.eventHomePage.domain.Replies;
//import com.ict.eventHomePage.reply.controller.request.UserRequest;
import com.ict.eventHomePage.reply.controller.request.ReplyRequest;
import com.ict.eventHomePage.reply.service.impl.ReplyServiceImpl;
import com.ict.eventHomePage.users.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import static com.ict.eventHomePage.domain.constant.UserRole.ADMIN;
import static com.ict.eventHomePage.domain.constant.UserRole.USER;

@RestController
@RequestMapping("/reply")
@RequiredArgsConstructor
public class ReplyController {

    private final ReplyServiceImpl replyService;
    private final AuthService authService;

    @PostMapping("/addReply")
    public SuccessOfFailResponse addReply(@RequestBody ReplyRequest request) {

        int userNo =  authService.getUser(AuthCheck.getUserId(USER, ADMIN)).getNo();
        request.setUserNo(userNo);

        return SuccessOfFailResponse.builder().result(replyService.addReply(request)).build();
    }

    @GetMapping("/getReplies")
    public List<Replies> getReplies(String userId, String content) {
        List<Replies> replies = replyService.getReplies(userId, content);
        return replies;
    }
}



