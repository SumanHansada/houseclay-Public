package com.houseclay.backend.controller;

import com.houseclay.backend.service.TestOnlyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Profile("test")
@RestController
@RequestMapping("/test-utils")
public class TestOnlyController {

    @Autowired
    private TestOnlyService testOnlyService;

    @DeleteMapping("/delete-user")
    public ResponseEntity<?> deleteUser(@RequestParam String phoneNo) {
        testOnlyService.deleteUser(phoneNo);
        return ResponseEntity.ok("User deleted successfully");
    }

    @DeleteMapping("/delete-admin")
    public ResponseEntity<?> deleteAdmin(@RequestParam String username) {
        testOnlyService.deleteAdmin(username);
        return ResponseEntity.ok("Admin deleted successfully");
    }
}
