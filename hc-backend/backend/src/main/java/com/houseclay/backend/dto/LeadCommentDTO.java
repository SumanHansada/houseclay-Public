package com.houseclay.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LeadCommentDTO {
    private String comment;
    private LocalDateTime date;
    private String author;
}
