package com.houseclay.backend.repository;

import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.PropertyState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, String> {
    Page<Property> findByPropertyState(PropertyState propertyState, Pageable pageable);
    List<Property> findTop10ByPropertyStateOrderByScoreDesc(PropertyState propertyState);
}

