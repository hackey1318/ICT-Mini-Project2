package com.ict.eventHomePage.reply.controller;

import com.ict.eventHomePage.common.config.AuthCheck;
import com.ict.eventHomePage.domain.Replies;
//import com.ict.eventHomePage.reply.controller.request.UserRequest;
import com.ict.eventHomePage.reply.service.impl.ReplyServiceImpl;
import com.ict.eventHomePage.users.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import static com.ict.eventHomePage.domain.constant.UserRole.ADMIN;
import static com.ict.eventHomePage.domain.constant.UserRole.USER;

@RestController
@RequestMapping("/reply")
@RequiredArgsConstructor
public class ReplyController {

    private final ReplyServiceImpl replyService;
    private final AuthService authService;
    private static String FILE_PATH = null;

    @PostMapping("/addReply")
    public List<Replies> addReply(@RequestBody Replies replies, MultipartFile[] files, HttpServletRequest request) {

        String userId = AuthCheck.getUserId(USER, ADMIN);
        FILE_PATH = request.getServletContext().getRealPath("/uploads");
        List<File> fileList = new ArrayList<File>();

        try {
            Replies resultReplies = replyService.dataInsert(replies);

            for (MultipartFile mf : files) {
                String orgFileName = mf.getOriginalFilename();
                File f = new File(FILE_PATH, orgFileName);
                int point = orgFileName.lastIndexOf(".");
                String fName = orgFileName.substring(0, point);
                String eName = orgFileName.substring(point + 1);

                if (f.exists()) {
                    for (int i = 1; ; i++) {
                        String newFileName = fName + "(" + i + ")." + eName;

                        File newFile = new File(FILE_PATH, newFileName);
                        if (!newFile.exists()) {
                            fName = fName + "(" + i + ").";
                            break;
                        }
                    }
                }

                //ReplyImages replyImages = new ReplyImages(0, 0, );
            }
        } catch (Exception e) {

        }


        return replyService.addReply(authService.getUser(userId).getNo());
    }

    @GetMapping("/getReplies")
    public List<Replies> getReplies(String userId, String content) {
        List<Replies> replies = replyService.getReplies(userId, content);
        return replies;
    }
}



