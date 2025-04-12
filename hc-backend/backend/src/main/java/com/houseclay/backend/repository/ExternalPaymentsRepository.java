package com.houseclay.backend.repository;

import com.houseclay.backend.entity.ExternalPayments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExternalPaymentsRepository extends JpaRepository<ExternalPayments, String> {
}
