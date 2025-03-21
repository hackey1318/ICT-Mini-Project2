package com.ict.eventHomePage.reply.service;

import com.ict.eventHomePage.domain.Replies;
import com.ict.eventHomePage.reply.controller.request.ReplyRequest;
import com.ict.eventHomePage.reply.controller.response.ReplyResponse;

import java.util.List;

public interface ReplyService {

    boolean addReply(ReplyRequest request);

    List<ReplyResponse> getReplies(int eventNo);

    void replyDel(int no);
}

