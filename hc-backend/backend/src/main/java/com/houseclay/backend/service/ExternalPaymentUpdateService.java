package com.houseclay.backend.service;

import com.houseclay.backend.entity.ExternalPaymentStatus;
import com.houseclay.backend.entity.ExternalPayments;
import com.houseclay.backend.repository.ExternalPaymentsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ExternalPaymentUpdateService {

    @Autowired
    private ExternalPaymentsRepository externalPaymentsRepository;

    @Transactional
    public void markStalePaymentsAsFailed() {
        Timestamp cutoffTime = Timestamp.from(Instant.now().minus(24, ChronoUnit.HOURS));

        List<ExternalPayments> stalePayments = externalPaymentsRepository.findByStatusAndCreatedAtBefore(
                ExternalPaymentStatus.IN_PROGRESS,
                cutoffTime
        );

        for (ExternalPayments payment : stalePayments) {
            payment.setStatus(ExternalPaymentStatus.FAILED);
            payment.setCompletedAt(Timestamp.from(Instant.now()));
        }

        externalPaymentsRepository.saveAll(stalePayments);
    }
}
