package com.houseclay.backend.security;

import com.houseclay.backend.entity.User;
import com.houseclay.backend.entity.UserLogin;
import com.houseclay.backend.repository.UserLoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Component
public class UserTokenAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private UserLoginRepository userLoginRepository;

    private static final String AUTH_HEADER = "Authorization";

    private static final List<String> PUBLIC_URLS = List.of(
            "/api/user/register",
            "/api/user/login",
            "/api/user/check-user"
    );

    private static final List<String> PRIVATE_URLS = List.of(
            "/api/property/add",
            "/api/payment/create-order",
            "/api/payment/verify"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestURI = request.getRequestURI();

        // ✅ Allow public APIs
        if (PUBLIC_URLS.contains(requestURI)) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ Ensure this filter only applies to `/api/user/**`
        if (!requestURI.startsWith("/api/user/") && !PRIVATE_URLS.contains(requestURI)) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader(AUTH_HEADER);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Missing or invalid token\"}");
            return;
        }

        String token = authHeader.substring(7);
        List<UserLogin> userLoginOpt = userLoginRepository.findByToken(token);

        if (userLoginOpt.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Invalid or expired token\"}");
            return;
        }

        // Block blacklisted users
        User user = userLoginOpt.get(0).getUser();
        if (user.isBlacklisted()) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("{\"error\": \"User is blacklisted\"}");
            return;
        }

        request.setAttribute("authenticatedUser", user);

        // ✅ Set authentication in Spring Security's context (Fixes 403 Forbidden)
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(user, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }
}
