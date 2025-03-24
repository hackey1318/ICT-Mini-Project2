package com.ict.eventHomePage.reply.service;

import com.ict.eventHomePage.domain.Replies;
import com.ict.eventHomePage.reply.controller.request.ReplyRequest;
import com.ict.eventHomePage.reply.controller.response.ReplyResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReplyService {

    boolean addReply(ReplyRequest request);

    Replies dataInsert(Replies replies);

    List<Replies> getReplyList();

    List<ReplyResponse> getReplies(int eventNo);

    public void replyDel(int no);

    boolean editReply(int no, ReplyRequest request);

    Page<Replies> getReplyList(Pageable pageable,int id);
}