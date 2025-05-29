package com.houseclay.backend.controller;

import com.houseclay.backend.dto.PropertyDTO;
import com.houseclay.backend.entity.Admin;
import com.houseclay.backend.entity.Property;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.PropertyMapper;
import com.houseclay.backend.service.PropertyAdminService;
import com.houseclay.backend.service.PropertyService;
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
@RequestMapping("/api/property/admin")
public class PropertyAdminController {

    @Autowired
    private PropertyAdminService propertyAdminService;

    @Autowired
    private PropertyService propertyService;

    @PostMapping("/add")
    public ResponseEntity addProperty(@RequestBody Property property, String phoneNo, @RequestAttribute("authenticatedAdmin") Admin admin) {
        try {
            Property savedProperty = propertyAdminService.addProperty(property, phoneNo, admin);
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
    public ResponseEntity<Object> getPropertyById(@PathVariable String id, @RequestAttribute("authenticatedAdmin") Admin admin) {
        try {
            Property property = propertyService.getProperty(id);
            return ResponseEntity.ok(PropertyMapper.toDTO(property));
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/properties-to-verify")
    public ResponseEntity<Page<PropertyDTO>> getByVerifyStatusPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, @RequestAttribute("authenticatedAdmin") Admin admin) {

        Pageable pageable = PageRequest.of(page, size);
        Page<PropertyDTO> properties = propertyAdminService.getPropertiesByVerifyStatus(false, pageable);
        return ResponseEntity.ok(properties);
    }

    @PostMapping("/verify-property")
    public ResponseEntity verifyProperty(@RequestParam String propertyId, @RequestAttribute("authenticatedAdmin") Admin admin) {
        try {
            Property verifiedProperty = propertyAdminService.verifyProperty(propertyId, admin);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Property verified successfully");
            response.put("propertyId", verifiedProperty.getPropertyID());
            response.put("verifiedBy", verifiedProperty.getVerifiedBy().getUsername());

            return ResponseEntity.ok(response);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/re-verify-property")
    public ResponseEntity reVerifyProperty(@RequestParam String propertyId, @RequestAttribute("authenticatedAdmin") Admin admin) {
        try {
            Property verifiedProperty = propertyAdminService.verifyProperty(propertyId, admin);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Property verified successfully");
            response.put("propertyId", verifiedProperty.getPropertyID());
            response.put("reVerifiedBy", verifiedProperty.getVerifiedBy().getUsername());

            return ResponseEntity.ok(response);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
