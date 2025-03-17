package com.ict.eventHomePage.reply.controller;

import com.ict.eventHomePage.domain.Replies;
import com.ict.eventHomePage.reply.controller.request.ReplyRequest;
import com.ict.eventHomePage.reply.service.ReplyService;
import com.ict.eventHomePage.reply.service.impl.ReplyServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/reply")
@RequiredArgsConstructor
public class ReplyController {

    private final ReplyServiceImpl replyService;

    @PostMapping("/addReply")
    public List<Replies> addReply(@RequestBody ReplyRequest request) {

        return replyService.addReply(request.getUserNo());
    }
}



