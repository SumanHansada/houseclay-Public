package com.houseclay.backend.payload;

import com.houseclay.backend.entity.Bundle;
import lombok.Data;

@Data
public class CreateOrderRequest {
    private Bundle bundle;
    private int connects;
}

