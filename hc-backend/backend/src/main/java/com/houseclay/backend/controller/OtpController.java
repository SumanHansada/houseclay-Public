package com.houseclay.backend.controller;

import com.houseclay.backend.service.OtpService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @PostMapping("/generate-otp")
    public ResponseEntity<Map<String, Object>> generateOtp(@RequestParam String phoneNo, HttpSession session) {
        otpService.generateOtp(phoneNo, session);
        return ResponseEntity.ok(Map.of(
                "message", "OTP generated successfully"
        ));
    }
}
