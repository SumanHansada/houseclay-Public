package com.houseclay.backend.payload;

import lombok.Data;

import java.util.Map;

@Data
public class PresignedURLResponse {
    private Map<String, String> fileURLMap;

    public PresignedURLResponse(Map<String, String> fileURLs) {
        this.fileURLMap = fileURLs;
    }
}
