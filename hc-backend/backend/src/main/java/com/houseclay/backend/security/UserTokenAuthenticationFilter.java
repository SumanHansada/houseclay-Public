package com.houseclay.backend.security;

import com.houseclay.backend.entity.User;
import com.houseclay.backend.entity.UserLogin;
import com.houseclay.backend.repository.UserLoginRepository;
import com.houseclay.backend.utils.Constants;
import com.houseclay.backend.utils.CookieUtils;
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
            "/api/payment/create-order",
            "/api/payment/verify",
            "/api/photo/user/presigned-urls",
            "/api/photo/user/delete-presigned-urls"
    );

    private static final List<String> PRIVATE_URL_PREFIXES = List.of(
            "/api/user",
            "/api/property/user"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        String method = request.getMethod();

        // ✅ Skip OPTIONS requests (CORS preflight) immediately
        if ("OPTIONS".equalsIgnoreCase(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ Allow public APIs
        if (PUBLIC_URLS.contains(requestURI)) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ Apply only to private prefixes/URLs
        if (PRIVATE_URL_PREFIXES.stream().noneMatch(requestURI::startsWith)
                && !PRIVATE_URLS.contains(requestURI)) {
            filterChain.doFilter(request, response);
            return;
        }

        // ---- Extract token ONLY from cookie ----
        String token = CookieUtils.extractTokenFromCookie(request, Constants.TOKEN_KEY);
        if (token == null || token.isBlank()) {
            CookieUtils.unauthorized(response, "Missing authentication cookie");
            return;
        }

        // ---- Validate against DB ----
        List<UserLogin> userLoginOpt = userLoginRepository.findByToken(token);
        if (userLoginOpt.isEmpty()) {
            CookieUtils.unauthorized(response, "Invalid or expired token");
            return;
        }

        User user = userLoginOpt.get(0).getUser();
        if (user.isBlacklisted()) {
            forbidden(response, "User is blacklisted");
            return;
        }

        // ---- Attach user & authenticate ----
        request.setAttribute("authenticatedUser", user);
        request.setAttribute("token", token);
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        filterChain.doFilter(request, response);
    }

    private void forbidden(HttpServletResponse response, String msg) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\":\"" + msg + "\"}");
    }

}
