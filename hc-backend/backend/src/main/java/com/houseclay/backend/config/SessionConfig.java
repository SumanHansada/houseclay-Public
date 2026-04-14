package com.houseclay.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class SessionConfig {

    @Value("${app.session.duration-days}")
    private int durationDays;

    @Value("${app.session.max-active}")
    private int maxActive;

    public int getDurationDays() {
        return durationDays;
    }

    public long getDurationMs() {
        return durationDays * 24L * 60 * 60 * 1000;
    }

    public int getMaxActive() {
        return maxActive;
    }
}
