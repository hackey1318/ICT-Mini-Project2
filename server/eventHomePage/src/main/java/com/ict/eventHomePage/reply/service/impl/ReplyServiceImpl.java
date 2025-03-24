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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    public Page<ReplyResponse> getReplyList(Pageable pageable, int id) {
        return replyRepository.findAllByUserNo(pageable, id);
    }

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
    public List<Replies> getReplyList() {
        return null;
    }

    @Override
    public List<ReplyResponse> getReplies(int eventNo) {

        List<ReplyResponse> replyList = replyRepository.findByEventNoOrderByEventNoDesc(eventNo);
        for(ReplyResponse response : replyList) {
            response.setImageIdList(replyImagesRepository.getImageIdList(response.getNo(), StatusInfo.ACTIVE));
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
    public boolean editReply(int no, ReplyRequest request) {

        try {

            Replies replies = replyRepository.findById(no)
                    .orElseThrow(() -> new RuntimeException("Replies not found"));
            replies.setTitle(request.getTitle());
            replies.setContent(request.getContent());

            List<ReplyImages> replyImages = replyImagesRepository.getReplyImages(replies.getNo(), StatusInfo.ACTIVE);
            for (ReplyImages replyImage : replyImages) {
                replyImage.setStatus(StatusInfo.DELETE);
            }
            for (String imageId : request.getImageIdList()) {
                replyImages.add(ReplyImages.builder()
                        .replyNo(replies.getNo())
                        .fileId(imageId)
                        .status(StatusInfo.ACTIVE).build());
            }

            replyImagesRepository.saveAll(replyImages);
        } catch (Exception e) {
            return false;
        }

        return true;
    }
}