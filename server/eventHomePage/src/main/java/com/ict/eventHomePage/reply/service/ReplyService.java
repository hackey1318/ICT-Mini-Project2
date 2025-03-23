package com.ict.eventHomePage.reply.service;

import com.ict.eventHomePage.domain.Replies;
import com.ict.eventHomePage.reply.controller.request.ReplyRequest;

import java.util.List;

public interface ReplyService {

    boolean addReply(ReplyRequest request);

    Replies dataInsert(Replies replies);

    List<Replies> getReplyList();

    List<Replies> getReplies(int eventNo);

    public void replyDel(int no);
}

