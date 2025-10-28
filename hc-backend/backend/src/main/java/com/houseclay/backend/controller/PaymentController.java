package com.houseclay.backend.controller;

import com.houseclay.backend.dto.CreateOrderResponseDTO;
import com.houseclay.backend.entity.User;
import com.houseclay.backend.payload.CreateOrderRequest;
import com.houseclay.backend.payload.VerifyPaymentRequest;
import com.houseclay.backend.service.PaymentService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request, @RequestAttribute("authenticatedUser") User user) throws Exception {
        CreateOrderResponseDTO order = paymentService.createOrder(user, request);
        return ResponseEntity.ok().body(order);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody VerifyPaymentRequest request, @RequestAttribute("authenticatedUser") User user) {
        return paymentService.verifyPayment(
                request.getPaymentId(),
                request.getOrderId(),
                request.getSignature(),
                user
        );
    }
}
