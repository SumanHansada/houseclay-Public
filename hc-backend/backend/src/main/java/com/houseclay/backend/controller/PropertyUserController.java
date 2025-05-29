package com.houseclay.backend.controller;

import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.User;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.PropertyMapper;
import com.houseclay.backend.service.PropertyService;
import com.houseclay.backend.service.PropertyUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/property/user")
public class PropertyUserController {

    @Autowired
    private PropertyUserService propertyUserService;

    @PostMapping("/add")
    public ResponseEntity addProperty(@RequestBody Property property, @RequestAttribute("authenticatedUser") User user) {
        try {
            Property savedProperty = propertyUserService.addProperty(user, property);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Property added successfully");
            response.put("propertyId", savedProperty.getPropertyID());
            return ResponseEntity.ok(response);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getPropertyById(@PathVariable String id, @RequestAttribute("authenticatedUser") User user) {
        try {
            Property property = propertyUserService.getPropertyForUser(id, user);
            return ResponseEntity.ok(PropertyMapper.toDTO(property));
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/contact/{id}")
    public ResponseEntity getPropertyOwnerContact(@PathVariable String id, @RequestAttribute("authenticatedUser") User user) {
        try {
            return ResponseEntity.ok(propertyUserService.getOwnerContact(id, user));
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
