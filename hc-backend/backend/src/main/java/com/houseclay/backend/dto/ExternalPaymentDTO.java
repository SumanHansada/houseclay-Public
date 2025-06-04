package com.houseclay.backend.dto;

import com.houseclay.backend.entity.ExternalPaymentStatus;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class ExternalPaymentDTO {
    String paymentId;
    double amount;
    ExternalPaymentStatus status;
    String signature;
    String razorPaymentId;
    Timestamp createdAt;
    Timestamp completedAt;
}
