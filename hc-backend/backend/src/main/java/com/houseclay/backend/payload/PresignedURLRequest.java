package com.houseclay.backend.payload;

import lombok.Data;

import java.util.Map;

@Data
public class PresignedURLRequest {
    private Map<String, String> fileMap;
}
