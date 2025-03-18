package com.ict.eventHomePage.reply.service;

import com.ict.eventHomePage.domain.Replies;

import java.util.List;

public interface ReplyService {

    List<Replies> addReply(int userNo);

    List<Replies> getReplies(String userId, String content);

    Replies dataInsert(Replies replies);
}

