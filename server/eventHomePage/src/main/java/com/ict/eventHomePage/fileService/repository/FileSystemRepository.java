package com.ict.eventHomePage.fileService.repository;

import com.ict.eventHomePage.fileService.domain.Images;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileSystemRepository extends JpaRepository<Images, Integer> {

    List<Images> findByIdIn(List<String> fileIdList);
}
