package com.ict.eventHomePage.reply.controller;

import com.ict.eventHomePage.domain.Replies;
import com.ict.eventHomePage.domain.ReplyImages;
import com.ict.eventHomePage.fileService.controller.request.ImageRequest;
import com.ict.eventHomePage.reply.controller.request.UserRequest;
import com.ict.eventHomePage.reply.service.impl.ReplyServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/reply")
@RequiredArgsConstructor
public class ReplyController {

    private final ReplyServiceImpl replyService;
    private static String FILE_PATH = null;

    @PostMapping("/addReply")
    public List<Replies> addReply(@RequestBody Replies replies, UserRequest userRequest, MultipartFile[] files, HttpServletRequest request) {

        FILE_PATH = request.getServletContext().getRealPath("/uploads");
        List<File> fileList = new ArrayList<File>();

        try {
            Replies resultReplies = replyService.dataInsert(replies);

            for(MultipartFile mf : files) {
                String orgFileName = mf.getOriginalFilename();
                File f = new File(FILE_PATH, orgFileName);
                int point = orgFileName.lastIndexOf(".");
                String fName = orgFileName.substring(0, point);
                String eName = orgFileName.substring(point+1);

                if(f.exists()) {
                    for(int i=1; ; i++) {
                        String newFileName = fName + "(" + i + ")." + eName;

                        File newFile = new File(FILE_PATH, newFileName);
                        if(!newFile.exists()) {
                            fName = fName + "(" + i + ").";
                            break;
                        }
                    }
                }

                //ReplyImages replyImages = new ReplyImages(0, 0, );
            }
        } catch(Exception e) {

        }


        return replyService.addReply(userRequest.getUserNo());
    }

    @GetMapping("/getReplies")
    public List<Replies> getReplies(String userId, String content) {
        List<Replies> replies = replyService.getReplies(userId, content);
        return replies;
    }
}



