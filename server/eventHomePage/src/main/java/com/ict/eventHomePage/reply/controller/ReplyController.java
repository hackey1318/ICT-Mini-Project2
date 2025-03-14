package com.ict.eventHomePage.reply.controller;

import com.ict.eventHomePage.domain.Replies;
import com.ict.eventHomePage.reply.service.ReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/reply")
@RequiredArgsConstructor
public class ReplyController {

    private final ReplyService service;

    @PostMapping("/addReply")
    public List<Replies> addReply(@RequestBody Replies repl) {

        //List<Replies> rep = new ArrayList(repl);
        return null;
    }
}



