package com.ict.eventHomePage.common.config;

import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.domain.constant.StatusInfo;
import com.ict.eventHomePage.domain.constant.UserRole;
import com.ict.eventHomePage.users.repository.UsersRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ServerInit {

    private final UsersRepository usersRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @PostConstruct
    public void generateAdminUser() {

        String adminId = "admin";

        Users admin = usersRepository.findByUserId(adminId).orElse(null);
        if (admin == null) {
            usersRepository.save(
                    Users.builder()
                            .userId(adminId)
                            .addr(adminId)
                            .postalCode("00000")
                            .pw(bCryptPasswordEncoder.encode("admin123"))
                            .name(adminId)
                            .email("admin@test.com")
                            .role(UserRole.ADMIN)
                            .tel("010-0000-0000")
                            .birth("1996.10.19")
                            .status(StatusInfo.ACTIVE).build());
        }
    }
}
