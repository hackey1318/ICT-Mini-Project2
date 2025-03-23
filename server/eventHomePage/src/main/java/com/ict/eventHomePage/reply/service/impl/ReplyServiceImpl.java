package com.ict.eventHomePage.reply.service.impl;

import com.ict.eventHomePage.common.config.AuthCheck;
import com.ict.eventHomePage.domain.Replies;
import com.ict.eventHomePage.domain.ReplyImages;
import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.domain.constant.StatusInfo;
import com.ict.eventHomePage.reply.controller.request.ReplyRequest;
import com.ict.eventHomePage.reply.controller.response.ReplyResponse;
import com.ict.eventHomePage.reply.repository.ReplyImagesRepository;
import com.ict.eventHomePage.reply.repository.ReplyRepository;
import com.ict.eventHomePage.reply.service.ReplyService;
import com.ict.eventHomePage.users.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.ict.eventHomePage.domain.constant.UserRole.ADMIN;
import static com.ict.eventHomePage.domain.constant.UserRole.USER;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReplyServiceImpl implements ReplyService {

    private final AuthService authService;
    private final ReplyRepository replyRepository;
    private final ReplyImagesRepository replyImagesRepository;

    @Override
    @Transactional
    public boolean addReply(ReplyResponse response) {

        try{
            Replies saveEntity = replyRepository.save(Replies.builder()
                    .userNo(response.getUserNo())
                    .eventNo(response.getEventNo())
                    .title(response.getTitle())
                    .content(response.getContent())
                    .status(StatusInfo.ACTIVE).build());

            List<ReplyImages> replyImagesList = new ArrayList<>();
            for (String imageId : response.getImageIdList()) {
                replyImagesList.add(ReplyImages.builder()
                        .replyNo(saveEntity.getNo())
                        .fileId(imageId)
                        .status(StatusInfo.ACTIVE).build());
            }
            replyImagesRepository.saveAll(replyImagesList);
        } catch (Exception e) {
            log.error("리뷰 작성 실패{} : {}", response.getTitle(), e.getMessage());
            return false;
        }
        return true;
    }

    @Override
    public List<Replies> getReplyList() {
        Users user = authService.getUser(AuthCheck.getUserId(USER, ADMIN));
        int currentUserNo = user.getNo();
        List<Map<String, Object>> replyData = replyRepository.getReplyListByUserNo(currentUserNo, StatusInfo.ACTIVE.name());
        List<Replies> replyList = new ArrayList<>();

        for (Map<String, Object> record : replyData) {
            Replies reply = new Replies();
            reply.setNo(((Number) record.get("no")).intValue());
            reply.setUserNo(((Number) record.get("userNo")).intValue());
            reply.setEventNo(((Number) record.get("eventNo")).intValue());
            reply.setTitle((String) record.get("joinedTitle"));
            reply.setContent((String) record.get("content"));

            // createdAt 변환 (Timestamp -> LocalDateTime)
            Object createdAtObj = record.get("createdAt");
            if (createdAtObj instanceof java.sql.Timestamp) {
                reply.setCreatedAt(((java.sql.Timestamp) createdAtObj).toLocalDateTime());
            } else if (createdAtObj instanceof String) {
                reply.setCreatedAt(LocalDateTime.parse((String) createdAtObj));
            } else {
                reply.setCreatedAt(null);
            }

            replyList.add(reply);
        }
        return replyList;
    }

    @Override
    public List<ReplyResponse> getReplies(int eventNo) {

        List<ReplyResponse> replyList = replyRepository.findByEventNoOrderByEventNoDesc(eventNo);
        for(ReplyResponse response : replyList) {
            response.setImageIdList(replyImagesRepository.getImageIdList(response.getNo()));
        }

        return replyList;
    }

    @Override
    public Replies dataInsert(Replies replies) {
        return null;
    }

    @Override
    public void replyDel(int no) {

        Replies replies = replyRepository.findById(no)
                .orElseThrow(() -> new RuntimeException("Reply not found"));

        replies.setStatus(StatusInfo.DELETE);

        replyRepository.save(replies);
    }

    @Override
    public int editReply(int no) {

        Replies replies = replyRepository.findById(no)
                .orElseThrow(() -> new RuntimeException("Replies not found"));

        //replies.setStatus();
        return 0;
    }
}