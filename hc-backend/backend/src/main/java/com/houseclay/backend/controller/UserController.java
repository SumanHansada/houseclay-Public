package com.houseclay.backend.controller;

import com.houseclay.backend.dto.UserEditDTO;
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
import com.houseclay.backend.service.ConnectManagementService;
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

    @Autowired
    private ConnectManagementService connectManagementService;
    

    @RequestMapping (method = RequestMethod.POST, value = "/register",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createUser(@Valid @RequestBody UserPayload payload) {
        try {
            return userService.createUser(payload);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @RequestMapping (method = RequestMethod.POST, value = "/login",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(@Valid @RequestBody LoginPayload payload) {
        try {
           return userService.loginUser(payload);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/check-user")
    public ResponseEntity<Map<String, Object>> checkUserExists(@RequestParam String phoneNo) {
        User user = userService.doesUserExist(phoneNo);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "error", "User not found",
                    "exists", false
            ));
        } else if (user.isBlacklisted()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "error", "User not found",
                    "exists", true
            ));
        }
        return ResponseEntity.ok(Map.of(
                "message", "User exists",
                "exists", true
        ));
    }

    @RequestMapping (method = RequestMethod.POST, value = "/logout",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> logout(@RequestAttribute("token") String authToken) {
        try {
            return userService.logoutUser(authToken); // Returns response with cookie cleared
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
            response.put("user", UserMapper.toUserProfileDTO(user));
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

    @GetMapping("/info")
    public ResponseEntity<?> info(@RequestAttribute("authenticatedUser") User user) {
        UserLoginResponseDTO userLoginResponseDTO = UserMapper.toUserLoginResponseDTO(user);
        return ResponseEntity.ok(userLoginResponseDTO);
    }

    @PostMapping("/generate-otp-email")
    public ResponseEntity<?> generateOTPForEmail(@RequestAttribute("authenticatedUser")User user) {
        try {
            return ResponseEntity.ok().body(userService.generateOTPForEmail(user));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/verifyEmail")
    public ResponseEntity<?> verifyEmail(@RequestAttribute("authenticatedUser") User user, @RequestParam String otp, @RequestParam String token) {
        try {
            userService.verifyEmail(user, otp, token);
            return ResponseEntity.ok().body(Map.of("message", "Email verified successfully"));
        } catch (APIException e) {
            throw new RuntimeException(e);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestAttribute("authenticatedUser") User user, @RequestBody UserEditDTO userEditDTO) {
        try {
            userService.userUpdate(user, userEditDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User updated successfully");
            return ResponseEntity.ok(response);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/verify-corporate-email-init")
    public ResponseEntity<?> initiateCorporateVerification(
            @RequestAttribute("authenticatedUser") User user,
            @RequestParam String corporateEmail) {
        try {
            return ResponseEntity.ok(userService.initiateCorporateVerification(user, corporateEmail));
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/verify-corporate-email-confirm")
    public ResponseEntity<?> confirmCorporateVerification(
            @RequestAttribute("authenticatedUser") User user,
            @RequestParam String otp,
            @RequestParam String token,
            @RequestParam String corporateEmail,
            @RequestParam(required = false) String companyName,
            @RequestParam(required = false) String jobTitle) {
        try {
            boolean verified = userService.confirmCorporateVerification(user, otp, token, corporateEmail, companyName, jobTitle);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Corporate email verified successfully");
            response.put("isCorporateVerified", verified);
            return ResponseEntity.ok(response);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/claim-corporate-benefits")
    public ResponseEntity<?> claimCorporateBenefits(
            @RequestAttribute("authenticatedUser") User user) {
        try {
            connectManagementService.grantCorporateConnects(user);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Corporate benefits granted successfully");
            return ResponseEntity.ok(response);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
