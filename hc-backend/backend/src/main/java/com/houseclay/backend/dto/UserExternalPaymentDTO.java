package com.houseclay.backend.dto;

import com.houseclay.backend.entity.Bundle;
import com.houseclay.backend.entity.ExternalPaymentStatus;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class UserExternalPaymentDTO {
    private String paymentId;
    private double amount;
    private int connectQty;
    private Bundle bundle;
    private ExternalPaymentStatus status;
    private Timestamp createdAt;
    private Timestamp completedAt;
}