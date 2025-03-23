package com.ict.eventHomePage.users.service.impl;

import com.ict.eventHomePage.common.exception.custom.NotFoundException;
import com.ict.eventHomePage.domain.EventImages;
import com.ict.eventHomePage.domain.Events;
import com.ict.eventHomePage.domain.Likes;
import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.domain.constant.StatusInfo;
import com.ict.eventHomePage.events.repository.EventImagesRepository;
import com.ict.eventHomePage.events.repository.EventsRepository;
import com.ict.eventHomePage.users.controller.response.LikesResponse;
import com.ict.eventHomePage.users.repository.LikesRepository;
import com.ict.eventHomePage.users.service.LikesService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LikesServiceImpl implements LikesService {

    private final ModelMapper modelMapper;

    private final LikesRepository likesRepository;
    private final EventsRepository eventsRepository;
    private final EventImagesRepository eventImagesRepository;

    @Override
    public boolean getLikeEvent(Users users, int eventId) {

        Likes likes = likesRepository.findByUserNoAndEventNo(users.getNo(), eventId).orElse(null);
        return likes != null;
    }

    @Override
    public boolean likeEvent(Users users, int eventId) {

        if (!eventsRepository.existsById(eventId)) {
            throw new NotFoundException("행사를 찾을 수 없습니다.");
        }
        try {

            likesRepository.save(Likes.builder()
                    .eventNo(eventId)
                    .userNo(users.getNo())
                    .status(StatusInfo.ACTIVE).build());
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    @Override
    public List<LikesResponse> getLikeEvent(Users users) {

        // 결과 정보를 위한 객체 생성
        List<Likes> likeList = likesRepository.findByUserNo(users.getNo());
        Map<Integer, LikesResponse> likesMap = likeList.stream()
                .collect(Collectors.toMap(Likes::getEventNo, like -> {
                    LikesResponse response = modelMapper.map(like, LikesResponse.class);
                    return response;
                }));

        List<Integer> eventNoList = likeList.stream().map(Likes::getEventNo).toList();
        // 행사 및 이미지 정보 조회
        Map<Integer, String> eventTitleMap = eventsRepository.findAllById(eventNoList)
                .stream().collect(Collectors.toMap(Events::getNo, Events::getTitle));

        Map<Integer, String> eventImageMap = eventImagesRepository.findFirstImagesByEventNoList(eventNoList)
                .stream().collect(Collectors.toMap(EventImages::getEventNo, EventImages::getOriginImgurl));

        likesMap.forEach((eventNo, response) -> {
            response.setTitle(eventTitleMap.get(eventNo));
            response.setImageInfo(eventImageMap.get(eventNo));
        });

        return likesMap.values().stream()
                .sorted(Comparator.comparing(LikesResponse::getCreatedAt)) // created 기준 오름차순 정렬
                .toList();
    }

    @Override
    @Transactional
    public boolean changeLikeEvent(Users users, int eventId) {

        if (!eventsRepository.existsById(eventId)) {
            throw new NotFoundException("행사를 찾을 수 없습니다.");
        }
        try {
            Likes likes = likesRepository.findByUserNoAndEventNo(users.getNo(), eventId).orElseThrow(() -> new NotFoundException("찜 정보가 없습니다."));
            likesRepository.updateLike(likes.getNo(), (StatusInfo.ACTIVE.equals(likes.getStatus()) ? StatusInfo.DELETE : StatusInfo.ACTIVE));
        } catch (Exception e) {
            return this.likeEvent(users, eventId);
        }
        return true;
    }
}
