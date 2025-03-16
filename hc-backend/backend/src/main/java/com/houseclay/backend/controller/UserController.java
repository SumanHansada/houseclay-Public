package com.houseclay.backend.controller;

import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.User;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.payload.LoginPayload;
import com.houseclay.backend.payload.UserPayload;

import com.houseclay.backend.service.ShortlistPropertyService;
import com.houseclay.backend.service.UserService;
import com.houseclay.backend.service.ViewPropertyService;
import jakarta.servlet.http.HttpSession;
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
    private ShortlistPropertyService shortlistPropertyService;

    @Autowired
    private ViewPropertyService viewPropertyService;


    @RequestMapping (method = RequestMethod.POST, value = "/register",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity createUser(@RequestBody UserPayload payload, HttpSession session) {
        try {
            User user = userService.createUser(payload, session);
            return ResponseEntity.ok().body(user);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @RequestMapping (method = RequestMethod.POST, value = "/login",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity login(@RequestBody LoginPayload payload, HttpSession session) {
        try {
            String token = userService.loginUser(payload, session);
            return ResponseEntity.ok().body(token);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
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

    @PostMapping("/shortlist-property")
    public ResponseEntity shortlistProperty(
            @RequestParam String propertyId,
            @RequestAttribute("authenticatedUser") User user) {
        try {
            List<Property> shortlistedProperties = shortlistPropertyService.shortlistProperty(user, propertyId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Property shortlisted successfully");
            response.put("shortlistedProperties", shortlistedProperties);
            return ResponseEntity.ok(response);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/remove-shortlisted-property")
    public ResponseEntity removeShortlistedProperty(
            @RequestParam String propertyId,
            @RequestAttribute("authenticatedUser") User user) {
        try {
            List<Property> shortlistedProperties = shortlistPropertyService.removeShortlistedProperty(user, propertyId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Property removed from shortlist");
            response.put("shortlistedProperties", shortlistedProperties);
            return ResponseEntity.ok(response);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/shortlisted-properties")
    public ResponseEntity<Map<String, Object>> getShortlistedProperties(
            @RequestAttribute("authenticatedUser") User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("shortlistedProperties", shortlistPropertyService.getShortlistedProperties(user));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/view-property")
    public ResponseEntity viewProperty(
            @RequestParam String propertyId,
            @RequestAttribute("authenticatedUser") User user) {
        try {
            List<Property> viewedProperties = viewPropertyService.markPropertyAsViewed(user, propertyId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Property marked as viewed");
            response.put("viewedProperties", viewedProperties);
            return ResponseEntity.ok(response);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/viewed-properties")
    public ResponseEntity<Map<String, Object>> getViewedProperties(
            @RequestAttribute("authenticatedUser") User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("viewedProperties", viewPropertyService.getViewedProperties(user));
        return ResponseEntity.ok(response);
    }
}
