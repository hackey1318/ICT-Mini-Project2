package com.ict.eventHomePage.fileService.controller.response;

import com.ict.eventHomePage.domain.constant.StatusInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FileUploadResponse {

    private int no;

    private String imageId;

    private String originName;

    private String filePath;

    private StatusInfo status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}