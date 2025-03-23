package com.ict.eventHomePage.list.controller;

import com.ict.eventHomePage.domain.WithdrawReasons;
import com.ict.eventHomePage.list.service.UserDelListService;
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
public class UserDelListController {
    @Autowired
    private UserDelListService userDelListService;

    @GetMapping("/memberDelList")
    public Map<String, Object> getWithdrawReasons(
            @RequestParam(name = "nowPage", defaultValue = "1") int nowPage) {
        int onePageCount = 10;
        Pageable pageable = PageRequest.of(nowPage - 1, onePageCount);
        Page<WithdrawReasons> withdrawReasonsPage = userDelListService.getWithdrawReasonsList(null, pageable); // searchWord를 null로 전달

        Map<String, Object> response = new HashMap<>();
        response.put("list", withdrawReasonsPage.getContent());
        response.put("pVO", new PaginationVO(
                withdrawReasonsPage.getNumber() + 1,
                withdrawReasonsPage.getTotalPages(),
                onePageCount,
                (nowPage - 1) / onePageCount * onePageCount + 1
        ));
        return response;
    }

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

        public int getNowPage() { return nowPage; }
        public int getTotalPage() { return totalPage; }
        public int getOnePageCount() { return onePageCount; }
        public int getStartPageNum() { return startPageNum; }
    }
}