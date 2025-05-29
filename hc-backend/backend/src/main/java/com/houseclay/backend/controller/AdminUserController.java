package com.houseclay.backend.controller;

import com.houseclay.backend.entity.Admin;
import com.houseclay.backend.entity.User;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/")
public class AdminUserController {

    @Autowired
    private AdminService adminService;


    @PostMapping("/blacklist-user")
    public ResponseEntity blacklistUser(
            @RequestParam String phoneNo,
            @RequestAttribute("authenticatedAdmin") Admin admin) {
        try {
            User updatedUser = adminService.blacklistUser(phoneNo, admin);

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

    @GetMapping("/search-user")
    public ResponseEntity searchUser(
            @RequestParam String phoneNo,
            @RequestAttribute("authenticatedAdmin") Admin admin) {
        try {
            User user = adminService.searchUser(phoneNo);
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            return ResponseEntity.ok(response);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/users")
    public Page<User> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestAttribute("authenticatedAdmin") Admin admin) {
        Pageable pageable = PageRequest.of(page, size);
        return adminService.getAllUsers(pageable);
    }
    
}
