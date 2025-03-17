package com.ict.eventHomePage.fileService.controller;

import com.ict.eventHomePage.common.config.AuthCheck;
import com.ict.eventHomePage.common.config.AuthRequired;
import com.ict.eventHomePage.fileService.controller.request.ImageRequest;
import com.ict.eventHomePage.fileService.controller.response.FileUploadResponse;
import com.ict.eventHomePage.fileService.domain.Images;
import com.ict.eventHomePage.fileService.service.FileSystemService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static com.ict.eventHomePage.domain.constant.UserRole.ADMIN;
import static com.ict.eventHomePage.domain.constant.UserRole.USER;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/file-system")
public class FileSystemController {

    private final FileSystemService fileSystemService;

    @AuthRequired({USER, ADMIN})
    @PostMapping("/upload")
    public List<FileUploadResponse> uploadFile(@RequestParam("files") List<MultipartFile> files) throws IOException {

        String userId = AuthCheck.getUserId(USER, ADMIN);
        return fileSystemService.uploadFile(files, userId);
    }

    @AuthRequired({USER, ADMIN})
    @GetMapping("/download/{imageId}")
    public void download(@PathVariable("imageId") String imageId, HttpServletResponse response) {

        Images image = fileSystemService.getImageInfo(List.of(imageId)).get(0);

        Path filePath = Paths.get(image.getPath());
        if (!Files.exists(filePath)) {
            throw new RuntimeException("파일이 존재하지 않습니다.");
        }

        response.setContentType(getContentType(filePath));
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + URLEncoder.encode(image.getOriginName(), StandardCharsets.UTF_8) + "\"");

        try (InputStream inputStream = Files.newInputStream(filePath);
             OutputStream outputStream = response.getOutputStream()) {

            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
            outputStream.flush();

        } catch (IOException e) {
            throw new RuntimeException("파일 다운로드 중 오류 발생: " + image.getOriginName(), e);
        }
    }


    @AuthRequired({USER, ADMIN})
    @GetMapping("/download")
    public void download(@RequestBody ImageRequest request, HttpServletResponse response) {

        response.setContentType("application/zip");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"images.zip\"");

        try (ZipOutputStream zipOut = new ZipOutputStream(response.getOutputStream(), StandardCharsets.UTF_8)) {

            List<Images> imageList = fileSystemService.getImageInfo(request.getImageIdList());
            for (Images image : imageList) {
                Path filePath = Paths.get(image.getPath());
                if (!Files.exists(filePath)) {
                    throw new RuntimeException("파일이 존재하지 않습니다.");
                }
                try (InputStream inputStream = Files.newInputStream(filePath)) {
                    ZipEntry zipEntry = new ZipEntry(image.getOriginName());
                    zipOut.putNextEntry(zipEntry);

                    byte[] buffer = new byte[4096];
                    int bytesRead;
                    while ((bytesRead = inputStream.read(buffer)) != -1) {
                        zipOut.write(buffer, 0, bytesRead);
                    }
                    zipOut.closeEntry();
                }
            }
            zipOut.finish();
        } catch (IOException e) {
            throw new RuntimeException("파일 다운로드 중 오류 발생", e);
        }
    }

    private String getContentType(Path path) {
        try {
            return Files.probeContentType(path);
        } catch (IOException e) {
            return "application/octet-stream";
        }
    }
}
