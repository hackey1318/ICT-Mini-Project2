package com.ict.eventHomePage.common.filter;

import com.ict.eventHomePage.common.config.JwtTokenProvider;
import com.ict.eventHomePage.domain.Users;
import com.ict.eventHomePage.users.repository.UsersRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UsersRepository usersRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        final String token = request.getHeader("Authorization");

        String userId = null;
        if(token != null && !token.isEmpty()) {
            String jwtToken = token.substring(7);

            userId = jwtTokenProvider.getUserNameFromToken(jwtToken);
        }

        if (userId != null && !userId.isEmpty() && SecurityContextHolder.getContext().getAuthentication() == null) {
            SecurityContextHolder.getContext().setAuthentication(getUserAuth(userId));
        }
        filterChain.doFilter(request, response);
    }

    private UsernamePasswordAuthenticationToken getUserAuth(String userId) {
        Users userInfo = usersRepository.findByUserId(userId).orElseThrow(() -> new IllegalArgumentException("없는 사용자입니다."));

        return new UsernamePasswordAuthenticationToken(userInfo.getEmail(), userInfo.getPw(),
                Collections.singleton(new SimpleGrantedAuthority(userInfo.getRole().name())));
    }
}
