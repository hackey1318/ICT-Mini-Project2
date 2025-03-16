package com.ict.eventHomePage.fileService.service;

import com.ict.eventHomePage.fileService.controller.response.FileUploadResponse;
import com.ict.eventHomePage.fileService.domain.Images;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FileSystemService {

    List<FileUploadResponse> uploadFile(List<MultipartFile> files, String userId) throws IOException;

    List<Images> getImageInfo(List<String> imageIdList);
}
