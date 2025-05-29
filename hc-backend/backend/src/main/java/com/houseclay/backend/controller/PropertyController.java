package com.houseclay.backend.controller;

import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.PropertyDocument;
import com.houseclay.backend.entity.User;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.PropertyMapper;
import com.houseclay.backend.service.PropertyService;
import com.houseclay.backend.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/property")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private SearchService searchService;


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
