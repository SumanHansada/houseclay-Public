package com.houseclay.backend.controller;

import com.houseclay.backend.entity.Property;
import com.houseclay.backend.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/property")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addProperty(@RequestBody Property property) {
        try {
            Property savedProperty = propertyService.addProperty(property);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Property added successfully");
            response.put("propertyId", savedProperty.getPropertyID());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<Property>> getAllProperties() {
        return ResponseEntity.ok(propertyService.getAllProperties());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getPropertyById(@PathVariable String id) {
        Optional<Property> property = propertyService.getPropertyById(id);
        if (property.isPresent()) {
            return ResponseEntity.ok(property.get());
        } else {
            return ResponseEntity.status(404).body(Map.of("error", "Property not found"));
        }
    }
}
