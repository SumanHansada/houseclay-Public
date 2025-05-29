package com.houseclay.backend.controller;

import com.houseclay.backend.entity.Lead;
import com.houseclay.backend.entity.LeadCategory;
import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.User;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.payload.LoginPayload;
import com.houseclay.backend.payload.UserPayload;

import com.houseclay.backend.service.LeadService;
import com.houseclay.backend.service.ShortlistPropertyService;
import com.houseclay.backend.service.UserService;
import com.houseclay.backend.service.ViewPropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/user")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    private LeadService leadService;


    @RequestMapping (method = RequestMethod.POST, value = "/register",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity createUser(@RequestBody UserPayload payload) {
        try {
            String token = userService.createUser(payload);
            return ResponseEntity.ok().body(token);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @RequestMapping (method = RequestMethod.POST, value = "/login",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity login(@RequestBody LoginPayload payload) {
        try {
            String token = userService.loginUser(payload);
            return ResponseEntity.ok().body(token);
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
    public ResponseEntity logout(@RequestHeader("Authorization") String authToken,
                                 @RequestAttribute("authenticatedUser") User user) {
        try {
            userService.logoutUser(authToken.replace("Bearer ", "")); // Remove "Bearer " prefix
            return ResponseEntity.ok(Map.of("message", "Logout successful"));
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/generate-lead")
    public ResponseEntity generateLead(
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
