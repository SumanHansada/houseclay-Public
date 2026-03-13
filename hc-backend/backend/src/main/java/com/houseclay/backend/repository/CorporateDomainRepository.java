package com.houseclay.backend.repository;

import com.houseclay.backend.entity.CorporateDomain;
import com.houseclay.backend.enums.CorporateDomainStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CorporateDomainRepository extends JpaRepository<CorporateDomain, Long> {
    Optional<CorporateDomain> findByDomainName(String domainName);
    List<CorporateDomain> findByStatus(CorporateDomainStatus status);
}
