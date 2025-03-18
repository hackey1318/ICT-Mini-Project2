package com.ict.eventHomePage.reply.service.impl;

import com.ict.eventHomePage.domain.Replies;
import com.ict.eventHomePage.reply.repository.ReplyRepository;
import com.ict.eventHomePage.reply.service.ReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReplyServiceImpl implements ReplyService {

    private final ReplyRepository replyRepository;

    @Override
    public List<Replies> addReply(int userNo) {

        List<Replies> result = new ArrayList<>();
        try {
            List<Replies> addingAcc = replyRepository.findRepliesByUserNo(userNo);
            result.addAll(addingAcc);

        } catch(Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @Override
    public List<Replies> getReplies(String userId, String content) {
        return List.of();
    }

    @Override
    public Replies dataInsert(Replies replies) {
        return null;
    }
}
