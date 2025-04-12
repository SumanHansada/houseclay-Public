package com.houseclay.backend.payload;

import lombok.Data;

@Data
public class VerifyPaymentRequest {
    private String paymentId;
    private String orderId;
    private String signature;
    private Long userId;
    private int amount;
    private int connects;
}
