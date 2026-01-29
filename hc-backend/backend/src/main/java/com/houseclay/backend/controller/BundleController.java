package com.houseclay.backend.controller;

import com.houseclay.backend.dto.BundleDTO;
import com.houseclay.backend.config.BundleConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bundle")
public class BundleController {

    @Autowired
    private BundleConfig bundleConfig;

    @GetMapping("/info")
    public ResponseEntity<?> getBundle() {
        try {
            BundleDTO bundleDTO = new BundleDTO();
            bundleDTO.setId(bundleConfig.getId());
            bundleDTO.setTitle(bundleConfig.getTitle());
            bundleDTO.setSubTitle(bundleConfig.getSubTitle());
            bundleDTO.setConnects(bundleConfig.getConnects());
            bundleDTO.setStandardPrice(bundleConfig.getStandardPrice());

            return ResponseEntity.ok(List.of(bundleDTO));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
