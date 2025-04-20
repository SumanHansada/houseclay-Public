package com.houseclay.backend.payload;

import lombok.Data;

import java.util.Map;

@Data
public class PresignedURLResponse {
    private String propertyID;
    private Map<String, String> fileURLMap;

    public PresignedURLResponse(String propertyID, Map<String, String> fileURLs) {
        this.propertyID = propertyID;
        this.fileURLMap = fileURLs;
    }
}
