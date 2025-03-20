package com.ict.eventHomePage.reply.service;

import com.ict.eventHomePage.domain.Replies;
import com.ict.eventHomePage.reply.controller.request.ReplyRequest;

import java.util.List;

public interface ReplyService {

    boolean addReply(ReplyRequest request);

    List<Replies> getReplies(String userId, String content);

    Replies dataInsert(Replies replies);
}

