package com.houseclay.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // ✅ Add all frontend origins that need cookie access
        config.setAllowedOrigins(List.of(
            "http://localhost:3000",
            "http://localhost:3001",
            "http://ec2-52-66-218-187.ap-south-1.compute.amazonaws.com:3000",
            "http://ec2-3-110-206-137.ap-south-1.compute.amazonaws.com:3001",
            "http://ec2-13-201-0-200.ap-south-1.compute.amazonaws.com:3000",
            "https://localhost:3000", // HTTPS variants for production
            "https://localhost.houseclay.com:3000",
            "https://localhost:3001",
            "https://ec2-52-66-218-187.ap-south-1.compute.amazonaws.com:3000",
            "https://ec2-3-110-206-137.ap-south-1.compute.amazonaws.com:3001",
            "https://ec2-13-201-0-200.ap-south-1.compute.amazonaws.com:3000"
        ));
        
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // ✅ Required for HTTP-only cookies
        config.setMaxAge(3600L); // Cache preflight requests for 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
