package com.ict.eventHomePage.fileService.service.impl;

import com.ict.eventHomePage.common.exception.custom.NotFoundException;
import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.domain.constant.StatusInfo;
import com.ict.eventHomePage.fileService.controller.response.FileUploadResponse;
import com.ict.eventHomePage.fileService.domain.Images;
import com.ict.eventHomePage.fileService.repository.FileSystemRepository;
import com.ict.eventHomePage.fileService.service.FileSystemService;
import com.ict.eventHomePage.users.repository.UsersRepository;
import jakarta.servlet.ServletContext;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileSystemServiceImpl implements FileSystemService {

    private final UsersRepository usersRepository;
    private final FileSystemRepository fileSystemRepository;

    @Override
    public List<FileUploadResponse> uploadFile(List<MultipartFile> files, String userId) throws IOException {

        Users users = this.getUser(userId);

        Path uploadPath = new ClassPathResource("static/img").getFile().toPath(); // 실제 서버 파일 시스템 경로

        List<String> fileIdList = new ArrayList<>();
        List<Images> imageList = new ArrayList<>();
        for (MultipartFile file : files) {
            String fileId = UUID.randomUUID().toString().replace("-", "").substring(0, 16);
            fileIdList.add(fileId);
            String fileName = file.getOriginalFilename();

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            Images image = Images.builder()
                    .id(fileId)
                    .userNo(users.getNo())
                    .path(filePath.toString())
                    .originName(fileName)
                    .status(StatusInfo.ACTIVE)
                    .build();
            imageList.add(image);
        }
        List<Images> saveEntity = fileSystemRepository.saveAll(imageList);
        return saveEntity.stream().map(img -> FileUploadResponse.builder()
                .no(img.getNo())
                .imageId(img.getId())
                .originName(img.getOriginName())
                .filePath(img.getPath())
                .status(img.getStatus())
                .createdAt(img.getCreatedAt())
                .updatedAt(img.getUpdatedAt()).build()).collect(Collectors.toList());
    }

    @Override
    public List<Images> getImageInfo(List<String> imageIdList) {

        List<Images> imageList = fileSystemRepository.findByIdIn(imageIdList);
        if (imageList.isEmpty()) {
            throw new NotFoundException("파일을 찾을 수 없습니다.");
        }
        return imageList;
    }

    private Users getUser(String userid) {

        return usersRepository.findByUserId(userid).orElseThrow(() -> new IllegalArgumentException("없는 사용자입니다."));
    }
}
