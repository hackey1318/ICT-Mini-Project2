package com.ict.eventHomePage.users.controller;

import com.ict.eventHomePage.common.exception.custom.UserAuthenticationException;
import com.ict.eventHomePage.common.response.SuccessOfFailResponse;
import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.users.controller.request.LoginRequest;
import com.ict.eventHomePage.users.service.LoginService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/member")
@RequiredArgsConstructor
public class LoginController {

    private final LoginService loginService;

    @PostMapping("/loginOk")
    public SuccessOfFailResponse loginOk(@RequestBody LoginRequest request, HttpServletResponse response, HttpServletRequest requestHttp){
        try {
            System.out.println("로그인 정보====> " + request);

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
    public String idFindOk(@RequestBody Users usersVO){
        System.out.println("id찾기 정보====> " + usersVO);

        Users result = loginService.idFind(usersVO);
        if(result==null){
            // System.out.println("id 찾기 실패: 해당하는 사용자가 없습니다.");
            return "idFindFail";
        }else{
            // System.out.println("id 찾기 정상적으로 되나요? " + result.getUserId());
            return result.getUserId();
        }

    }

    @PostMapping("/pwFindOk")
    public String pwFindOk(@RequestBody Users usersVO){
        System.out.println("pw찾기 정보====> " + usersVO);
        return null;
    }


}
