package com.houseclay.backend.repository;

import com.houseclay.backend.entity.ExternalPaymentStatus;
import com.houseclay.backend.entity.ExternalPayments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface ExternalPaymentsRepository extends JpaRepository<ExternalPayments, String> {
    List<ExternalPayments> findByStatusAndCreatedAtBefore(ExternalPaymentStatus status, Timestamp time);
}
