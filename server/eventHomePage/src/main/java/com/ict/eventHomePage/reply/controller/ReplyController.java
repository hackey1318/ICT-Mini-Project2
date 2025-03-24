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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    @AuthRequired({USER, ADMIN})
    @GetMapping("/replyList")
    public ResponseEntity<Map<String, Object>> getReplyList(
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Users user = authService.getUser(AuthCheck.getUserId(USER, ADMIN));
       Page<Replies> replyPage = replyService.getReplyList(pageable, user.getNo());

        Map<String, Object> response = new HashMap<>();
        List<ReplyResponse> replyResponses = replyPage.getContent().stream()
                .map(reply -> {
                    ReplyResponse replyResponse = new ReplyResponse();
                    replyResponse.setNo(reply.getNo());
                    replyResponse.setContent(reply.getContent());
                    replyResponse.setCreatedAt(reply.getCreatedAt());
                    replyResponse.setEventNo(reply.getEventNo());
                    // Assuming you have a method or relation to get the event title
                    // Replace with actual logic
                    replyResponse.setTitle("Sample Event Title"); // Or fetch title from event
                    return replyResponse;
                })
                .collect(Collectors.toList());
        response.put("list", replyResponses);
        response.put("totalPages", replyPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/replyDel/{no}")
    public String replyDel(@PathVariable("no") int no) {

        replyService.replyDel(no);
        return "deleted";
    }

    @PostMapping("/editReply/{no}")
    public SuccessOfFailResponse editReply(@PathVariable("no") int no, @RequestBody ReplyRequest request) {

        return SuccessOfFailResponse.builder().result(replyService.editReply(no, request)).build();
    }
}