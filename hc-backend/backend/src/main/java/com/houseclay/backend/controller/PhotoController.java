package com.houseclay.backend.controller;

import com.houseclay.backend.service.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/photo")
public class PhotoController {

    @Autowired
    private PhotoService photoService;


    @GetMapping("/presigned-url")
    public ResponseEntity<String> getPresignedUrl(@RequestParam String filename) {
        String url = photoService.generatePresignedUrl(filename);
        return ResponseEntity.ok(url);
    }
}
