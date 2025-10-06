package com.houseclay.backend.controller;

import com.houseclay.backend.dto.AdminLoginDTO;
import com.houseclay.backend.dto.AdminRegisterDTO;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/register")
    public ResponseEntity<?> createAdmin(@Valid @RequestBody AdminRegisterDTO adminRegisterDTO) {
        try {
            adminService.registerAdmin(adminRegisterDTO);
            return ResponseEntity.ok().body("Admin registered successfully");
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginAdmin(@Valid @RequestBody AdminLoginDTO adminLoginDTO) {
        try {
            String token = adminService.loginAdmin(adminLoginDTO.getUsername(), adminLoginDTO.getPassword());
            return ResponseEntity.ok().header("token", token).body("Admin logged in successfully");
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutAdmin(@RequestHeader("Authorization") String authToken) {
        try {
            adminService.logoutAdmin(authToken.replace("Bearer ", ""));
            return ResponseEntity.ok(Map.of("message", "Logout successful"));
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

}