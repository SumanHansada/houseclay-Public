package com.houseclay.backend.security;

import com.houseclay.backend.entity.Admin;
import com.houseclay.backend.entity.AdminLogin;
import com.houseclay.backend.repository.AdminLoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
public class AdminTokenAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private AdminLoginRepository adminLoginRepository;

    private static final String AUTH_HEADER = "Authorization";

    private static final List<String> PUBLIC_URLS = List.of(
            "/api/admin/register",
            "/api/admin/login"
    );

    private static final List<String> PRIVATE_URL_PREFIXES = List.of(
            "/api/admin",
            "/api/property/admin"
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

        // ✅ Ensure this filter only applies to `/api/admin/**`
        if (PRIVATE_URL_PREFIXES.stream().noneMatch(requestURI::startsWith)) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader(AUTH_HEADER);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Missing or invalid token\"}");
            return;
        }

        String token = authHeader.substring(7); // Remove "Bearer " prefix
        Optional<AdminLogin> adminLoginOpt = adminLoginRepository.findByAuthToken(token);

        if (adminLoginOpt.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Invalid or expired token\"}");
            return;
        }

        // Store the admin in request attribute to access in controllers
        Admin admin = adminLoginOpt.get().getAdmin();
        request.setAttribute("authenticatedAdmin", admin);

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(admin, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }
}
