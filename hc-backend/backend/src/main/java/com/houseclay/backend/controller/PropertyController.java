package com.houseclay.backend.controller;

import com.houseclay.backend.dto.PaginatedResponse;
import com.houseclay.backend.dto.PropertyCardDTO;
import com.houseclay.backend.dto.PropertySearchRequestDTO;
import com.houseclay.backend.entity.Property;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.PropertySearchMapper;
import com.houseclay.backend.service.CloudFrontCookieService;
import com.houseclay.backend.service.PropertyService;
import com.houseclay.backend.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/property")
public class PropertyController {

    @Autowired
    private SearchService searchService;

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private CloudFrontCookieService cookieService;

    public static final String DEFAULT_DISTANCE_LIMIT = "15km";

    @GetMapping("/{id}")
    public ResponseEntity<Object> getPropertyById(@PathVariable String id) {
        try {
            Property property = propertyService.getProperty(id);
            return ResponseEntity.ok(PropertySearchMapper.toPropertySearchDTO(property));
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/standout")
    public ResponseEntity<Object> getStandouts() {
        return ResponseEntity.ok().body(propertyService.getStandout());
    }

    @GetMapping("/neighbourhood")
    public ResponseEntity<Object> getPopularNeighbourhood() {
        return ResponseEntity.ok().body(propertyService.getPopularNeighbourhood());
    }


    @GetMapping("/search")
    public ResponseEntity<PaginatedResponse<PropertyCardDTO>> searchProperty(
            @ModelAttribute PropertySearchRequestDTO propertySearchRequestDTO,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        if(propertySearchRequestDTO.getDistance() == null || propertySearchRequestDTO.getDistance().isEmpty()) {
            propertySearchRequestDTO.setDistance(DEFAULT_DISTANCE_LIMIT);
        }
        PaginatedResponse<PropertyCardDTO> results = searchService.searchNearbyWithFilters(
                propertySearchRequestDTO, page, size
        );
        Map<String, ResponseCookie> cookies;
        try {
            cookies = cookieService.generateSignedCookies();
            return ResponseEntity.ok()
                    .header("Set-Cookie", cookies.get("CloudFront-Policy").toString())
                    .header("Set-Cookie", cookies.get("CloudFront-Signature").toString())
                    .header("Set-Cookie", cookies.get("CloudFront-Key-Pair-Id").toString())
                    .body(results);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok(results);
    }
}
