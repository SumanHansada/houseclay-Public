package com.houseclay.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.bundle")
@Data
public class BundleConfig {
    private final String id = "ACCESS_PASS";
    private final String title = "Access Pass";
    private final String subTitle = "Best Value";
    private int connects;
    private double standardPrice;
}
