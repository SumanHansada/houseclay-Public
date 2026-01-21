package com.houseclay.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class CookieConfig {
    
    @Value("${app.cookie.secure}")
    private boolean secure;
    
    @Value("${app.cookie.same-site}")
    private String sameSite;
    
    @Value("${app.cookie.domain}")
    private String domain;

    public boolean isSecure() {
        return secure;
    }

    public String getSameSite() {
        return sameSite;
    }

    public String getDomain() {
        return domain.isEmpty() ? null : domain;
    }
}