package com.houseclay.backend.controller;

import com.houseclay.backend.entity.User;
import com.houseclay.backend.payload.CreateOrderRequest;
import com.houseclay.backend.payload.VerifyPaymentRequest;
import com.houseclay.backend.service.PaymentService;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<String> createOrder(@RequestBody CreateOrderRequest request, @RequestAttribute("authenticatedUser") User user) throws Exception {
        JSONObject order = paymentService.createOrder(user, request.getAmount());
        return ResponseEntity.ok().body(order.toString());
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(@RequestBody VerifyPaymentRequest request, @RequestAttribute("authenticatedUser") User user) {
        return paymentService.verifyPayment(
                request.getPaymentId(),
                request.getOrderId(),
                request.getSignature(),
                user
        );
    }
}
