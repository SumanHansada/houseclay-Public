package com.houseclay.backend.controller;

import com.houseclay.backend.dto.PropertyCardDTO;
import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.PropertyCategory;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.PropertyBasicMapper;
import com.houseclay.backend.service.PropertyService;
import com.houseclay.backend.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/property")
public class PropertyController {

    @Autowired
    private SearchService searchService;

    @Autowired
    private PropertyService propertyService;

    @GetMapping("/{id}")
    public ResponseEntity<Object> getPropertyById(@PathVariable String id) {
        try {
            Property property = propertyService.getProperty(id);
            return ResponseEntity.ok(PropertyBasicMapper.toBasicDTO(property));
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @GetMapping("/search")
    public ResponseEntity<?> searchProperty(
            @RequestParam PropertyCategory propertyCategory,
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "5km") String distance,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String bhkType,
            @RequestParam(required = false) String furnishing,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) String parking,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String preferredTenant,
            @RequestParam(required = false) List<String> amenities) {

        List<PropertyCardDTO> results = searchService.searchNearbyWithFilters(
                lat, lon, distance, city, bhkType, minPrice, maxPrice, propertyCategory, furnishing, propertyType, parking, preferredTenant, amenities
        );

        return ResponseEntity.ok(results);
    }
}
