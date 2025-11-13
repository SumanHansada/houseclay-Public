package com.houseclay.backend.repository;

import com.houseclay.backend.entity.ContactEnquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactEnquiryRepository extends JpaRepository<ContactEnquiry, Long> {
}
