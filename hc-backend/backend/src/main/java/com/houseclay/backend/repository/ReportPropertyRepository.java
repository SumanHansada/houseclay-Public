package com.houseclay.backend.repository;

import com.houseclay.backend.entity.ReportProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportPropertyRepository extends JpaRepository<ReportProperty, String> {
}
