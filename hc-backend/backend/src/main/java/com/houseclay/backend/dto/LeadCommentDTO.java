package com.houseclay.backend.dto;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class LeadCommentDTO {
    private String comment;
    private Timestamp date;
    private String author;
}
