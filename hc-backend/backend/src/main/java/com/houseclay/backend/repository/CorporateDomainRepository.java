package com.houseclay.backend.repository;

import com.houseclay.backend.entity.CorporateDomain;
import com.houseclay.backend.enums.CorporateDomainStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface CorporateDomainRepository extends JpaRepository<CorporateDomain, Long> {
    Optional<CorporateDomain> findByDomainName(String domainName);
    List<CorporateDomain> findByStatus(CorporateDomainStatus status);
    Page<CorporateDomain> findByStatus(CorporateDomainStatus status, Pageable pageable);
}
