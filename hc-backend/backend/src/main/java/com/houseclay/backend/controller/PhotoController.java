package com.houseclay.backend.controller;

import com.houseclay.backend.entity.User;
import com.houseclay.backend.payload.PresignedURLRequest;
import com.houseclay.backend.payload.PresignedURLResponse;
import com.houseclay.backend.service.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/photo")
public class PhotoController {

    @Autowired
    private PhotoService photoService;


    @PostMapping("/user/presigned-urls")
    public ResponseEntity<PresignedURLResponse> getPresignedUrlForUser(@RequestBody PresignedURLRequest request) {
        return ResponseEntity.ok(photoService.getURLs(request));
    }

    @PostMapping("/admin/presigned-urls")
    public ResponseEntity<PresignedURLResponse> getPresignedUrlForAdmin(@RequestBody PresignedURLRequest request) {
        return ResponseEntity.ok(photoService.getURLs(request));
    }
}
