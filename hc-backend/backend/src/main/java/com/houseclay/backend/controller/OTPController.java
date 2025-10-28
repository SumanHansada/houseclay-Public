package com.houseclay.backend.controller;

import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.service.OTPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class OTPController {

    @Autowired
    private OTPService otpService;

    @PostMapping("/generate-otp")
    public ResponseEntity<?> generateOTP(@RequestParam String phoneNo) {
        try {
            otpService.generateOTP(phoneNo);
            return ResponseEntity.ok("OTP generated successfully");
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/regenerate-otp")
    public ResponseEntity<?> regenerateOTP(@ RequestParam String phoneNo) {
        try {
            otpService.regenerateOTP(phoneNo);
            return ResponseEntity.ok("OTP generated successfully");
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
