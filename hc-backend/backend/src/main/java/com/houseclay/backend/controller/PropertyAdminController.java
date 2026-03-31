package com.houseclay.backend.controller;

import com.houseclay.backend.dto.PropertyDTO;
import com.houseclay.backend.dto.UserPropertyDTO;
import com.houseclay.backend.entity.Admin;
import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.PropertyState;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.PropertyDetailMapper;
import com.houseclay.backend.service.PropertyAdminService;
import com.houseclay.backend.service.PropertyElasticService;
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

    @Autowired
    private PropertyElasticService propertyElasticService;

    @PostMapping("/add")
    public ResponseEntity<?> addProperty(@RequestBody PropertyDTO propertyDTO, String phoneNo, @RequestAttribute("authenticatedAdmin") Admin admin) {
        try {
            Property savedProperty = propertyAdminService.addProperty(propertyDTO, phoneNo, admin);
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
    public ResponseEntity<?> updateProperty(@RequestBody PropertyDTO propertyDTO, String phoneNo, @RequestAttribute("authenticatedAdmin") Admin admin) {
        try {
            Property savedProperty = propertyAdminService.updateProperty(admin, propertyDTO, phoneNo);
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
    public ResponseEntity<?> deactivateProperty(@RequestParam String propertyID, @RequestParam String comment, @RequestAttribute("authenticatedAdmin") Admin admin) {
        try {
            propertyAdminService.deactivateProperty(admin, propertyID, comment);
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
    public ResponseEntity<Object> getPropertyById(@PathVariable String id) {
        try {
            Property property = propertyService.getProperty(id);
            return ResponseEntity.ok(PropertyDetailMapper.toAdminPropertyDetailDTO(property));
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/exclusive")
    public ResponseEntity<?> updatePropertyExclusive(@RequestParam String propertyID, @RequestParam boolean isExclusive, @RequestAttribute("authenticatedAdmin") Admin admin) {
        try {
            Property property = propertyAdminService.updateExclusiveTag(propertyID, isExclusive, admin);
            return ResponseEntity.ok(PropertyDetailMapper.toAdminPropertyDetailDTO(property));
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @GetMapping("/properties")
    public ResponseEntity<Page<UserPropertyDTO>> getPropertiesByState(
            @RequestParam(required = false) PropertyState state,
            @RequestParam(defaultValue = "desc") String sortOrder, // Frontend passes "asc" or "desc"
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        // Note: We don't pass Sort into PageRequest here because the JPQL query handles the complex sorting
        Pageable pageable = PageRequest.of(page, size); 
        
        Page<UserPropertyDTO> properties = propertyAdminService.getPropertiesByState(state, sortOrder, pageable);
        return ResponseEntity.ok(properties);
    }

    @PostMapping("/verify-property")
    public ResponseEntity<?> verifyProperty(@RequestParam String propertyId,
                                            @RequestParam String comment,
                                            @RequestParam Long score,
                                            @RequestAttribute("authenticatedAdmin") Admin admin) {
        try {
            Property verifiedProperty = propertyAdminService.verifyProperty(propertyId, comment, score, admin);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Property verified successfully");
            response.put("propertyId", verifiedProperty.getPropertyID());
            response.put("verifiedBy", admin.getName());

            return ResponseEntity.ok(response);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/re-verify-property")
    public ResponseEntity<?> reVerifyProperty(@RequestParam String propertyId,
                                              @RequestParam String comment,
                                              @RequestAttribute("authenticatedAdmin") Admin admin) {
        try {
            Property reVerifyProperty = propertyAdminService.reVerifyProperty(propertyId, comment, admin);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Property verified successfully");
            response.put("propertyId", reVerifyProperty.getPropertyID());
            response.put("reVerifiedBy", admin.getName());
            return ResponseEntity.ok(response);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    /**
     * Triggers a full re-index of all properties from Postgres into Elasticsearch.
     * Use this whenever a field is added or changed on any PropertyDocument subclass.
     * See PropertyElasticService#reindexAllProperties() for implementation details.
     *
     * Usage:
     *   POST https://apis.houseclay.com/api/property/admin/reindex
     *   Authorization: Bearer <admin token>
     *
     * Returns "Re-index complete" when done.
     */
    @PostMapping("/reindex")
    public ResponseEntity<?> reindexAllProperties(@RequestAttribute("authenticatedAdmin") Admin admin) {
        try {
            propertyElasticService.reindexAllProperties();
            return ResponseEntity.ok("Re-index complete");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
