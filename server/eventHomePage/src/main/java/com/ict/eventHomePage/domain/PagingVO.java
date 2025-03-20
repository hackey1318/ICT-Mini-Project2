package com.ict.eventHomePage.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PagingVO {
    private int nowPage = 1;
    private int onePageRecord = 9;
    private int totalRecord;
    private int totalPage;
    private int offset;
    private int onePageCount = 9;
    private int startPageNum = 1;

    private String searchKey;
    private String searchWord;

    public void setNowPage(int nowPage) {
        this.nowPage = nowPage;
        this.offset = (nowPage - 1) * onePageRecord;
        this.startPageNum = (nowPage - 1) / onePageCount * onePageCount + 1;
    }

    public void setTotalRecord(int totalRecord) {
        this.totalRecord = totalRecord;
        this.totalPage = (totalRecord % onePageRecord) == 0 ? totalRecord / onePageRecord : totalRecord / onePageRecord + 1;
    }
}