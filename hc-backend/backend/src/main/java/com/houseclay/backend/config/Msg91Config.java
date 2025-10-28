package com.houseclay.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Msg91Config {
    @Value("${msg91.base-url}")
    private String baseUrl;

    @Value("${msg91.auth-key}")
    private String authKey;

    @Value("${msg91.template-id}")
    private String templateId;

    public String getBaseUrl() { return baseUrl; }
    public String getAuthKey() { return authKey; }
    public String getTemplateId() { return templateId; }
}
