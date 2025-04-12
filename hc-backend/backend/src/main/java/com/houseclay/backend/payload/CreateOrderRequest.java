package com.houseclay.backend.payload;

import lombok.Data;

@Data
public class CreateOrderRequest {
    private Long userId;
    private int amount;
}
