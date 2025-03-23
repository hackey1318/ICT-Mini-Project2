package com.ict.eventHomePage.reply.controller;

import com.ict.eventHomePage.common.config.AuthCheck;
import com.ict.eventHomePage.common.config.AuthRequired;
import com.ict.eventHomePage.common.response.SuccessOfFailResponse;
import com.ict.eventHomePage.domain.Replies;
import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.reply.controller.request.ReplyRequest;
import com.ict.eventHomePage.reply.controller.response.ReplyResponse;
import com.ict.eventHomePage.reply.service.ReplyService;
import com.ict.eventHomePage.users.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.ict.eventHomePage.domain.constant.UserRole.ADMIN;
import static com.ict.eventHomePage.domain.constant.UserRole.USER;

@RestController
@RequestMapping("/reply")
@RequiredArgsConstructor
public class ReplyController {

    private final ReplyService replyService;
    private final AuthService authService;

    @AuthRequired({USER, ADMIN})
    @PostMapping("/addReply")
    public SuccessOfFailResponse addReply(@RequestBody ReplyResponse response) {

        int userNo = authService.getUser(AuthCheck.getUserId(USER, ADMIN)).getNo();
        response.setUserNo(userNo);
        return SuccessOfFailResponse.builder().result(replyService.addReply(response)).build();
    }

    @GetMapping("/getReplies")
    public List<ReplyResponse> getReplies(@RequestParam int eventNo) {

        List<ReplyResponse> replies = replyService.getReplies(eventNo);
        return replies;
    }

    @AuthRequired({USER, ADMIN})
    @GetMapping("/replyList")
    public ResponseEntity<Map<String, Object>> getReplyList() {
        Users user = authService.getUser(AuthCheck.getUserId(USER, ADMIN));
        List<Replies> replyList = replyService.getReplyList();
        Map<String, Object> response = new HashMap<>();
        response.put("list", replyList);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/replyDel/{no}")
    public String replyDel(@PathVariable("no") int no) {

        replyService.replyDel(no);
        return "deleted";
    }

    @PostMapping("/editReply/{no}")
    public SuccessOfFailResponse editReply(@PathVariable("no") int no) {

        /*int userNo = replyService.editReply(no);
        return SuccessOfFailResponse.builder().result(replyService.editReply(userNo)).build();*/
        return null;
    }
}



