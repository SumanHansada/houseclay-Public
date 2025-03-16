package com.houseclay.backend.controller;

import com.houseclay.backend.entity.Admin;
import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.User;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.payload.AdminLoginPayload;
import com.houseclay.backend.payload.AdminLogoutPayload;
import com.houseclay.backend.service.AdminService;
import com.houseclay.backend.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private PropertyService propertyService;

    @PostMapping("/register")
    public ResponseEntity createAdmin(@RequestBody Admin admin) {
        try {
            return ResponseEntity.ok().body(adminService.registerAdmin(admin));
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
    public ResponseEntity logoutAdmin(@RequestParam AdminLogoutPayload adminLogoutPayload) {
        try {
            return ResponseEntity.ok().body(adminService.logoutAdmin(adminLogoutPayload.getToken()));
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/verify-property")
    public ResponseEntity verifyProperty(@RequestParam String propertyId, @RequestAttribute("authenticatedAdmin") Admin admin) {
        try {
            Property verifiedProperty = propertyService.verifyProperty(propertyId, admin);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Property verified successfully");
            response.put("propertyId", verifiedProperty.getPropertyID());
            response.put("verifiedBy", verifiedProperty.getVerifiedBy().getUsername());

            return ResponseEntity.ok(response);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/reVerify-property")
    public ResponseEntity reVerifyProperty(@RequestParam String propertyId, @RequestAttribute("authenticatedAdmin") Admin admin) {
        try {
            Property verifiedProperty = propertyService.verifyProperty(propertyId, admin);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Property verified successfully");
            response.put("propertyId", verifiedProperty.getPropertyID());
            response.put("reVerifiedBy", verifiedProperty.getVerifiedBy().getUsername());

            return ResponseEntity.ok(response);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/blacklist-user")
    public ResponseEntity blacklistUser(
            @RequestParam String userId,
            @RequestAttribute("authenticatedAdmin") Admin admin) {
        try {
            User updatedUser = adminService.blacklistUser(userId, admin);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User blacklisted successfully");
            response.put("userId", updatedUser.getPhoneNo());
            response.put("blacklisted", updatedUser.isBlacklisted());

            return ResponseEntity.ok(response);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}