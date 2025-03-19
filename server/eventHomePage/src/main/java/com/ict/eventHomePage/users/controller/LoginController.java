package com.ict.eventHomePage.users.controller;

import com.ict.eventHomePage.common.exception.custom.UserAuthenticationException;
import com.ict.eventHomePage.common.response.SuccessOfFailResponse;
import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.users.controller.request.LoginRequest;
import com.ict.eventHomePage.users.service.LoginService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/member")
@RequiredArgsConstructor
public class LoginController {

    private final LoginService loginService;

    @PostMapping("/loginOk")
    public SuccessOfFailResponse loginOk(@RequestBody LoginRequest request, HttpServletResponse response, HttpServletRequest requestHttp){
        try {
            // System.out.println("로그인 정보====> " + request);

            String accessToken = loginService.loginSelect(request);
            if (accessToken == null || accessToken.trim().isEmpty()) {
                throw new UserAuthenticationException("로그인에 실패하였습니다.");
            }

            // 헤더에 accessToken 저장 (클라이언트가 쉽게 사용할 수 있도록)
            response.setHeader("accessToken", accessToken);

            return SuccessOfFailResponse.builder().result(true).build();

        } catch (UserAuthenticationException e) {
            // 로그인 실패 시 적절한 응답을 반환
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 Unauthorized
            response.setHeader("Error-Message", e.getMessage());  // 오류 메시지를 헤더로 전달
            return SuccessOfFailResponse.builder().result(false).build();
        } catch (Exception e) {
            // 다른 예기치 않은 오류에 대한 처리
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500 Internal Server Error
            return SuccessOfFailResponse.builder().result(false).build();
        }
    }

    @PostMapping("/idFindOk")
    public ResponseEntity<Map<String, Object>> idFindOk(@RequestBody Users usersVO){
        // System.out.println("id찾기 정보====> " + usersVO);

        Users result = loginService.idFind(usersVO);
        Map<String, Object> response = new HashMap<>();

        if (result == null) {
            response.put("result", "idFindFail");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            response.put("result", "idFindSuccess");
            response.put("userId", result.getUserId());
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }

    }

    @PostMapping("/pwFindOk")
    public ResponseEntity<Map<String, Object>> pwFindOk(@RequestBody Users usersVO){
        // System.out.println("pw찾기 정보====> " + usersVO);

        Users result = loginService.pwFind(usersVO);
        System.out.println("result=========>" + result);

        Map<String, Object> response = new HashMap<>();

        if (result == null) {
            response.put("result", "pwFindFail");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            response.put("result", "pwFindSuccess");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }
    }

    @PostMapping("/pwResetOk")
    public ResponseEntity<Map<String, Object>> pwResetOk(@RequestBody Users usersVO){
        // System.out.println("pw재설정 정보====> " + usersVO);

        // 기존 회원정보를 가져와서 pw정보를 재설정한다.
        Users selectUserInfo = loginService.pwFind(usersVO);
        //System.out.println("선택한 회원정보 ====> " + selectUserInfo);
        usersVO.setNo(selectUserInfo.getNo());
        usersVO.setAddr(selectUserInfo.getAddr());
        usersVO.setBirth(selectUserInfo.getBirth());
        usersVO.setCreatedAt(selectUserInfo.getCreatedAt());
        usersVO.setName(selectUserInfo.getName());
        usersVO.setRole(selectUserInfo.getRole());
        usersVO.setStatus(selectUserInfo.getStatus());
        usersVO.setTel(selectUserInfo.getTel());
        usersVO.setUpdatedAt(LocalDateTime.now());
        usersVO.setPostalCode(selectUserInfo.getPostalCode());
        //System.out.println("넣을 회원정보 ====> " + usersVO);

        Users result = loginService.usersUpdate(usersVO);

        Map<String, Object> response = new HashMap<>();

        if (result == null) {
            response.put("result", "pwResetFail");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            response.put("result", "pwResetSuccess");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }
    }


}
