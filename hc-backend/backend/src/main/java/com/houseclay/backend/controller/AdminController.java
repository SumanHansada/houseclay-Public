package com.houseclay.backend.controller;

import com.houseclay.backend.dto.AdminInfoDTO;
import com.houseclay.backend.dto.AdminLoginDTO;
import com.houseclay.backend.dto.AdminRegisterDTO;
import com.houseclay.backend.entity.Admin;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.AdminMapper;
import com.houseclay.backend.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> loginAdmin(@Valid @RequestBody AdminLoginDTO adminLoginDTO) {
        try {
            return adminService.loginAdmin(adminLoginDTO.getUsername(), adminLoginDTO.getPassword());
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutAdmin(@RequestAttribute("token") String authToken) {
        try {
            return adminService.logoutAdmin(authToken);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/info")
    public ResponseEntity<?> info(@RequestAttribute("authenticatedAdmin") Admin admin) {
        AdminInfoDTO adminInfoDTO = AdminMapper.toAdminInfoDTO(admin);
        return ResponseEntity.ok(adminInfoDTO);
    }

}