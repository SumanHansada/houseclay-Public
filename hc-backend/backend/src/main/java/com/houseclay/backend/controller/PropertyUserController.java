package com.houseclay.backend.controller;

import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.ReportType;
import com.houseclay.backend.entity.User;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.PropertyDetailMapper;
import com.houseclay.backend.service.PropertyUserService;
import com.houseclay.backend.service.ShortlistPropertyService;
import com.houseclay.backend.service.ViewPropertyService;
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

    @Autowired
    private ShortlistPropertyService shortlistPropertyService;

    @Autowired
    private ViewPropertyService viewPropertyService;

    @PostMapping("/add")
    public ResponseEntity<?> addProperty(@RequestBody Property property, @RequestAttribute("authenticatedUser") User user) {
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

    @PutMapping("/update")
    public ResponseEntity<?> updateProperty(@RequestBody Property property, @RequestAttribute("authenticatedUser") User user) {
        try {
            Property savedProperty = propertyUserService.updateProperty(user, property);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Property updated successfully");
            response.put("propertyId", savedProperty.getPropertyID());
            return ResponseEntity.ok(response);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/deactivate")
    public ResponseEntity<?> deactivateProperty(@RequestBody String propertyID, @RequestAttribute("authenticatedUser") User user) {
        try {
            propertyUserService.deactivateProperty(user, propertyID);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Property deactivated successfully");
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
            return ResponseEntity.ok(PropertyDetailMapper.toPropertyDetailDTO(property));
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/contact/{id}")
    public ResponseEntity<?> getPropertyOwnerContact(@PathVariable String id, @RequestAttribute("authenticatedUser") User user) {
        try {
            return ResponseEntity.ok(propertyUserService.getOwnerContact(id, user));
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/shortlist-property/{propertyId}")
    public ResponseEntity<?> shortlistProperty(
            @PathVariable String propertyId,
            @RequestAttribute("authenticatedUser") User user) {
        try {
            Property shortlistedProperty = shortlistPropertyService.shortlistProperty(user, propertyId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Property shortlisted successfully");
            response.put("shortlistedProperty", PropertyDetailMapper.toPropertyDetailDTO(shortlistedProperty));
            return ResponseEntity.ok(response);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/remove-shortlisted-property/{propertyId}")
    public ResponseEntity<?> removeShortlistedProperty(
            @PathVariable String propertyId,
            @RequestAttribute("authenticatedUser") User user) {
        try {
            shortlistPropertyService.removeShortlistedProperty(user, propertyId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Property removed from shortlist");
            return ResponseEntity.ok(response);
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

    @PostMapping("/get-property/{propertyId}")
    public ResponseEntity<?> viewProperty(
            @PathVariable String propertyId,
            @RequestAttribute("authenticatedUser") User user) {
        try {
            Property property = viewPropertyService.getProperty(user, propertyId);
            return ResponseEntity.ok(PropertyDetailMapper.toPropertyDetailDTO(property));
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

    @PostMapping("/report-property/{propertyId}")
    public ResponseEntity<?> reportProperty(
            @PathVariable String propertyId,
            @RequestBody ReportType reportType,
            @RequestAttribute("authenticatedUser") User user) {
        try {
            propertyUserService.reportProperty(user, propertyId, reportType);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Reported property successfully");
            return ResponseEntity.ok(response);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


}
