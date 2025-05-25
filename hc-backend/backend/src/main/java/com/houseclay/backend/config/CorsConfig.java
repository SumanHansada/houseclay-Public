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
        config.setAllowedOrigins(List.of("http://localhost:3000", "http://ec2-54-79-199-42.ap-southeast-2.compute.amazonaws.com:3000", "http://ec2-54-79-199-42.ap-southeast-2.compute.amazonaws.com:3001")); // ✅ Allow frontend domains
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // ✅ Allowed HTTP methods
        config.setAllowedHeaders(List.of("*")); // ✅ Allow all headers
        config.setAllowCredentials(true); // ✅ Allow cookies (if needed)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
