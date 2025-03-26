package com.ict.eventHomePage.list.controller;

import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.list.service.UserListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/member")
public class UserListController {
    @Autowired
    private UserListService userListService;

    @GetMapping("/memberList")
    public Map<String, Object> getMemberList(
            @RequestParam(name = "nowPage", defaultValue = "1") int nowPage,
            @RequestParam(name = "searchWord", defaultValue = "") String searchWord) {
        int onePageCount = 10;
        Pageable pageable = PageRequest.of(nowPage - 1, onePageCount);
        Page<Users> userPage = userListService.getUserList(searchWord, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("list", userPage.getContent());
        response.put("pVO", new PaginationVO(
                userPage.getNumber() + 1,
                userPage.getTotalPages(),
                onePageCount,
                (nowPage - 1) / onePageCount * onePageCount + 1
        ));
        return response;
    }



    // PaginationVO 클래스 (페이지네이션 정보를 담음)
    public static class PaginationVO {
        private int nowPage;
        private int totalPage;
        private int onePageCount;
        private int startPageNum;

        public PaginationVO(int nowPage, int totalPage, int onePageCount, int startPageNum) {
            this.nowPage = nowPage;
            this.totalPage = totalPage;
            this.onePageCount = onePageCount;
            this.startPageNum = startPageNum;
        }

        // Getter 메서드 추가 (프론트엔드에서 사용)
        public int getNowPage() { return nowPage; }
        public int getTotalPage() { return totalPage; }
        public int getOnePageCount() { return onePageCount; }
        public int getStartPageNum() { return startPageNum; }
    }
}