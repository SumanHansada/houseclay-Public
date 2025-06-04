package com.houseclay.backend.dto;

import com.houseclay.backend.entity.ExternalPaymentStatus;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class ExternalPaymentDTO {
    private String paymentId;
    private double amount;
    private ExternalPaymentStatus status;
    private String signature;
    private String razorPaymentId;
    private Timestamp createdAt;
    private Timestamp completedAt;
}
