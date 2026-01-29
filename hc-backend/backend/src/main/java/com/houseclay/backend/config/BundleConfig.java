package com.houseclay.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.bundle")
@Data
public class BundleConfig {
    private final String id = "STANDARD_BUNDLE";
    private final String title = "Standard";
    private final String subTitle = "Best Value";
    private int connects;
    private double standardPrice;
}
