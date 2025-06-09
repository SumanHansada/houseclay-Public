package com.houseclay.backend.controller;

import com.houseclay.backend.dto.AdminRegisterDTO;
import com.houseclay.backend.entity.Admin;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.payload.AdminLoginPayload;
import com.houseclay.backend.service.AdminService;
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
    public ResponseEntity<?> createAdmin(@RequestBody AdminRegisterDTO adminRegisterDTO) {
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
    public ResponseEntity<String> loginAdmin(@RequestBody AdminLoginPayload adminLoginPayload) {
        try {
            return ResponseEntity.ok().body(adminService.loginAdmin(adminLoginPayload.getUsername(), adminLoginPayload.getPassword()));
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutAdmin(@RequestHeader("Authorization") String authToken, @RequestAttribute("authenticatedAdmin") Admin admin) {
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