package com.houseclay.backend.repository;

import com.houseclay.backend.entity.Lead;
import com.houseclay.backend.entity.LeadCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {
    Page<Lead> findByLeadCategory(LeadCategory leadCategory, Pageable pageable);
}
