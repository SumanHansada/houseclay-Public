package com.houseclay.backend.controller;

import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.PropertyDocument;
import com.houseclay.backend.entity.User;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.service.PropertyService;
import com.houseclay.backend.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @Autowired
    private SearchService searchService;

    @PostMapping("/add")
    public ResponseEntity addProperty(@RequestBody Property property, @RequestAttribute("authenticatedUser") User user) {
        try {
            Property savedProperty = propertyService.addProperty(user, property);
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

    @GetMapping("/list")
    public ResponseEntity<List<Property>> getAllProperties() {
        return ResponseEntity.ok(propertyService.getAllProperties());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getPropertyById(@PathVariable Long id) {
        Optional<Property> property = propertyService.getPropertyById(id);
        if (property.isPresent()) {
            return ResponseEntity.ok(property.get());
        } else {
            return ResponseEntity.status(404).body(Map.of("error", "Property not found"));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProperty(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "5km") String distance,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String bhkType,
            @RequestParam(required = false) String propertyCategory) {

        List<PropertyDocument> results = searchService.searchNearbyWithFilters(
                lat, lon, distance, city, bhkType, propertyCategory
        );

        return ResponseEntity.ok(results);
    }
}
