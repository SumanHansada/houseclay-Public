package com.houseclay.backend.controller;

import com.houseclay.backend.dto.UserDTO;
import com.houseclay.backend.entity.Admin;
import com.houseclay.backend.entity.User;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.UserMapper;
import com.houseclay.backend.service.AdminService;
import com.houseclay.backend.service.ConnectManagementService;
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

    @Autowired
    private ConnectManagementService connectManagementService;


    @PostMapping("/blacklist-user")
    public ResponseEntity<?> blacklistUser(
            @RequestParam String phoneNo,
            @RequestParam String comment,
            @RequestAttribute("authenticatedAdmin") Admin admin) {
        try {
            User updatedUser = adminService.blacklistUser(phoneNo, comment, admin);

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

    @PostMapping("/tag-broker")
    public ResponseEntity<?> markBroker(
            @RequestParam String phoneNo,
            @RequestParam String comment,
            @RequestAttribute("authenticatedAdmin") Admin admin) {
        try {
            User updatedUser = adminService.tagBroker(phoneNo, comment, admin);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User tagged as broker");
            response.put("userId", updatedUser.getPhoneNo());
            response.put("blacklisted", updatedUser.isBlacklisted());

            return ResponseEntity.ok(response);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }



    @PostMapping("/activate-user")
    public ResponseEntity<?> activateUser(
            @RequestParam String phoneNo,
            @RequestParam String comment,
            @RequestAttribute("authenticatedAdmin") Admin admin) {
        try {
            User updatedUser = adminService.activateUser(phoneNo, comment, admin);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User activated successfully");
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
    public ResponseEntity<?> searchUser(
            @RequestParam String phoneNo,
            @RequestAttribute("authenticatedAdmin") Admin admin) {
        try {
            User user = adminService.searchUser(phoneNo);
            Map<String, Object> response = new HashMap<>();
            response.put("user", UserMapper.toDetailDTO(user));
            return ResponseEntity.ok(response);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/add-connects")
    public ResponseEntity<?> addConnects(@RequestParam int connectCount, @RequestParam String phoneNo,
                                         @RequestAttribute("authenticatedAdmin") Admin admin) {
        try {
            int connectBal = connectManagementService.addConnect(phoneNo, connectCount, admin);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Connect balance updated");
            response.put("balance", connectBal);
            return ResponseEntity.ok(response);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/users")
    public Page<UserDTO> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestAttribute("authenticatedAdmin") Admin admin) {
        Pageable pageable = PageRequest.of(page, size);
        return adminService.getAllUsers(pageable);
    }
    
}
