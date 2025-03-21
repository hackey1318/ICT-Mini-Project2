package com.ict.eventHomePage.reply.controller;

import com.ict.eventHomePage.common.config.AuthCheck;
import com.ict.eventHomePage.common.config.AuthRequired;
import com.ict.eventHomePage.common.response.SuccessOfFailResponse;
import com.ict.eventHomePage.reply.controller.request.ReplyRequest;
import com.ict.eventHomePage.reply.controller.response.ReplyResponse;
import com.ict.eventHomePage.reply.service.impl.ReplyServiceImpl;
import com.ict.eventHomePage.users.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.ict.eventHomePage.domain.constant.UserRole.ADMIN;
import static com.ict.eventHomePage.domain.constant.UserRole.USER;

@RestController
@RequestMapping("/reply")
@RequiredArgsConstructor
public class ReplyController {

    private final ReplyServiceImpl replyService;
    private final AuthService authService;
    private static String FILE_PATH = null;

    @AuthRequired({USER, ADMIN})
    @PostMapping("/addReply")
    public SuccessOfFailResponse addReply(@RequestBody ReplyRequest request) {

        int userNo = authService.getUser(AuthCheck.getUserId(USER, ADMIN)).getNo();
        request.setUserNo(userNo);

        return SuccessOfFailResponse.builder().result(replyService.addReply(request)).build();
    }

    @GetMapping("/getReplies")
    public List<ReplyResponse> getReplies(@RequestParam int eventNo) {

        List<ReplyResponse> replies = replyService.getReplies(eventNo);

        return replies;
    }

    @GetMapping("/replyDel/{no}")
    public String replyDel(@PathVariable("no") int no) {

        replyService.replyDel(no);
        return "deleted";
    }
}



