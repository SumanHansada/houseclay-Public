package com.houseclay.backend.dto;

import lombok.Data;

@Data
public class CreateOrderResponseDTO {

    String orderId;
    Double displayAmount;
    Double razorPayAmount;
}
