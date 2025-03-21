package com.ict.eventHomePage.reply.service.impl;

import com.ict.eventHomePage.domain.Replies;
import com.ict.eventHomePage.domain.ReplyImages;
import com.ict.eventHomePage.domain.constant.StatusInfo;
import com.ict.eventHomePage.reply.controller.request.ReplyRequest;
import com.ict.eventHomePage.reply.repository.ReplyImagesRepository;
import com.ict.eventHomePage.reply.repository.ReplyRepository;
import com.ict.eventHomePage.reply.service.ReplyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReplyServiceImpl implements ReplyService {

    private final ReplyRepository replyRepository;
    private final ReplyImagesRepository replyImagesRepository;

    @Override
    @Transactional
    public boolean addReply(ReplyRequest request) {

        try{

            Replies saveEntity = replyRepository.save(Replies.builder()
                    .userNo(request.getUserNo())
                    .eventNo(request.getEventNo())
                    .title(request.getTitle())
                    .content(request.getContent())
                    .status(StatusInfo.ACTIVE).build());

            List<ReplyImages> replyImagesList = new ArrayList<>();
            for (String imageId : request.getImageIdList()) {
                replyImagesList.add(ReplyImages.builder()
                        .replyNo(saveEntity.getNo())
                        .fileId(imageId)
                        .status(StatusInfo.ACTIVE).build());
            }
            replyImagesRepository.saveAll(replyImagesList);
        } catch (Exception e) {
            log.error("리뷰 작성 실패{} : {}", request.getTitle(), e.getMessage());
            return false;
        }

        return true;
    }

    @Override
    public List<Replies> getReplies(int eventNo) {

        return replyRepository.findByEventNoOrderByEventNoDesc(eventNo);
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
}