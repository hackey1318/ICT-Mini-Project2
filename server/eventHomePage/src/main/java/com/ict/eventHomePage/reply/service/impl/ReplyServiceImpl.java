package com.ict.eventHomePage.reply.service.impl;

import com.ict.eventHomePage.common.config.AuthCheck;
import com.ict.eventHomePage.domain.Replies;
import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.domain.constant.StatusInfo;
import com.ict.eventHomePage.reply.repository.ReplyRepository;
import com.ict.eventHomePage.reply.service.ReplyService;
import com.ict.eventHomePage.users.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.ict.eventHomePage.domain.constant.UserRole.ADMIN;
import static com.ict.eventHomePage.domain.constant.UserRole.USER;

@Service
@RequiredArgsConstructor
public class ReplyServiceImpl implements ReplyService {

    private final ReplyRepository replyRepository;
    private final AuthService authService;

    @Override
    public List<Replies> addReply(int userNo) {

        List<Replies> result = new ArrayList<>();
        try {
            List<Replies> addingAcc = replyRepository.findRepliesByUserNo(userNo);
            result.addAll(addingAcc);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

//    @Override
//    public List<Replies> getReplies(String userId, String content) {
//        return List.of();
//    }

    @Override
    public List<Replies> getReplyList() {
        Users user = authService.getUser(AuthCheck.getUserId(USER, ADMIN));
        int currentUserNo = user.getNo();
        // List<Map<String, Object>> 데이터 가져오기
        List<Map<String, Object>> replyData = replyRepository.getReplyListByUserNo(currentUserNo);
        List<Replies> replyList = new ArrayList<>();

        // Map 데이터를 Replies 객체로 변환
        for (Map<String, Object> record : replyData) {
            Replies reply = new Replies();
            reply.setNo((int) record.get("no"));
            reply.setUserNo((int) record.get("userNo"));
            reply.setEventNo((int) record.get("eventNo"));
            reply.setTitle((String) record.get("joinedTitle"));
            reply.setContent((String) record.get("content"));

            // createdAt 변환 (Timestamp -> LocalDateTime)
            Object createdAtObj = record.get("createdAt");
            if (createdAtObj instanceof java.sql.Timestamp) {
                reply.setCreatedAt(((java.sql.Timestamp) createdAtObj).toLocalDateTime());
            } else if (createdAtObj instanceof java.time.LocalDateTime) {
                reply.setCreatedAt((LocalDateTime) createdAtObj);
            } else {
                reply.setCreatedAt(null); // 변환 불가능한 경우 null 설정
            }
            replyList.add(reply);
        }
        return replyList;
    }

    @Override
    public Replies dataInsert(Replies replies) {
        return null;
    }

    @Override
    @Transactional
    public void updateReply(int replyNo) {
        replyRepository.updateStatusByReplyNo(replyNo, StatusInfo.DELETE);
    }
}