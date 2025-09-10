package com.houseclay.backend.controller;

import com.houseclay.backend.dto.UserLoginResponseDTO;
import com.houseclay.backend.entity.LeadCategory;
import com.houseclay.backend.entity.User;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.UserMapper;
import com.houseclay.backend.payload.LoginPayload;
import com.houseclay.backend.payload.UserPayload;

import com.houseclay.backend.service.AdminService;
import com.houseclay.backend.service.LeadService;
import com.houseclay.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/user")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    private LeadService leadService;

    @Autowired
    private AdminService adminService;


    @RequestMapping (method = RequestMethod.POST, value = "/register",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createUser(@Valid @RequestBody UserPayload payload) {
        try {
            UserLoginResponseDTO userLoginResponseDTO = userService.createUser(payload);
            return ResponseEntity.ok().body(userLoginResponseDTO);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @RequestMapping (method = RequestMethod.POST, value = "/login",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(@Valid @RequestBody LoginPayload payload) {
        try {
            UserLoginResponseDTO userLoginResponseDTO = userService.loginUser(payload);
            return ResponseEntity.ok().body(userLoginResponseDTO);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/check-user")
    public ResponseEntity<Map<String, Object>> checkUserExists(@RequestParam String phoneNo) {

        if (userService.doesUserExist(phoneNo)) {
            return ResponseEntity.ok(Map.of(
                    "message", "User exists",
                    "exists", true
            ));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "error", "User not found",
                    "exists", false
            ));
        }
    }

    @RequestMapping (method = RequestMethod.POST, value = "/logout",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authToken) {
        try {
            userService.logoutUser(authToken.replace("Bearer ", "")); // Remove "Bearer " prefix
            return ResponseEntity.ok(Map.of("message", "Logout successful"));
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/detail")
    public ResponseEntity<?> getUser(@RequestAttribute("authenticatedUser") User user) {
        try {
            user = adminService.searchUser(user.getPhoneNo());
            Map<String, Object> response = new HashMap<>();
            response.put("user", UserMapper.toDetailDTO(user));
            return ResponseEntity.ok(response);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/generate-lead")
    public ResponseEntity<?> generateLead(
            @RequestParam LeadCategory leadCategory,
            @RequestAttribute("authenticatedUser") User user) {
        try {
            leadService.createLead(leadCategory, user);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Lead generated successfully");
            return ResponseEntity.ok(response);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
