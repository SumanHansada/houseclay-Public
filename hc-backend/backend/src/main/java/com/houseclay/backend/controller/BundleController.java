package com.houseclay.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.houseclay.backend.dto.BundleDTO;
import com.houseclay.backend.utils.Constants;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bundle")
public class BundleController {

    @GetMapping("/info")
    public ResponseEntity<?> getBundle() {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return ResponseEntity.ok(objectMapper.readValue(
                    Constants.BUNDLE_DATA,
                    new TypeReference<List<BundleDTO>>() {}
            ));
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
