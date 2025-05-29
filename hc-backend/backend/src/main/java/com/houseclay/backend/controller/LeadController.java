package com.houseclay.backend.controller;

import com.houseclay.backend.dto.LeadDTO;
import com.houseclay.backend.entity.Admin;
import com.houseclay.backend.entity.LeadCategory;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.service.LeadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leads")
public class LeadController {

    @Autowired
    private LeadService leadService;

    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable Long id, @RequestBody String comment, @RequestAttribute("authenticatedAdmin") Admin admin) {
        try {
            leadService.addComment(id, comment, admin);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<Page<LeadDTO>> getLeads(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam LeadCategory leadCategory
            , @RequestAttribute("authenticatedAdmin") Admin admin) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(leadService.getLeads(leadCategory, pageable));
    }

    @PutMapping("/{id}/category")
    public ResponseEntity<String> updateLeadCategory(
            @PathVariable Long id,
            @RequestBody LeadCategory leadCategory) {
        try {
            leadService.updateLeadCategory(id, leadCategory);
            return ResponseEntity.ok("Lead category updated.");
        } catch (APIException e) {
            return ResponseEntity.status(e.getCode()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


}