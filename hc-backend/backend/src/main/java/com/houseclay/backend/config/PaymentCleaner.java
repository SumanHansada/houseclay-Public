package com.houseclay.backend.config;

import com.houseclay.backend.service.ExternalPaymentUpdateService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PaymentCleaner {

    @Autowired
    private ExternalPaymentUpdateService externalPaymentUpdateService;

    @Scheduled(fixedRate = 24 * 60 * 60 * 1000)
    public void callLocalEndpoint() {
        externalPaymentUpdateService.markStalePaymentsAsFailed();
        System.out.println("Marked stale payments successfully");
    }
}
