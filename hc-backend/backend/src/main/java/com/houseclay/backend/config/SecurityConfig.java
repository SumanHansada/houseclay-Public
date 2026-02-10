package com.houseclay.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.houseclay.backend.security.AdminTokenAuthenticationFilter;
import com.houseclay.backend.security.UserTokenAuthenticationFilter;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Uses BCrypt hashing
    }

    @Bean
    public AdminTokenAuthenticationFilter adminTokenAuthenticationFilter() {
        return new AdminTokenAuthenticationFilter();
    }

    @Bean
    public UserTokenAuthenticationFilter userTokenAuthenticationFilter() {
        return new UserTokenAuthenticationFilter();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults()) // 👈 enable CORS
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // ✅ Allow all OPTIONS requests
                        .requestMatchers("/api/auth/generate-otp").permitAll()
                        .requestMatchers("/api/photo/**").permitAll()
                        .requestMatchers("/api/admin/login", "/api/admin/register").permitAll()
                        .requestMatchers("/api/user/login", "/api/user/register",  "/api/user/check-user").permitAll()
                        .requestMatchers("/api/admin/**").authenticated()
                        .requestMatchers("/api/user/**").authenticated()
                        .anyRequest().permitAll()
                )
                .addFilterBefore(adminTokenAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(userTokenAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
