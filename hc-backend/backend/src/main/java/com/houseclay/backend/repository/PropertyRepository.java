package com.houseclay.backend.repository;

import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.PropertyState;
import com.houseclay.backend.entity.PropertyUpdateType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, String> {
    Page<Property> findByPropertyState(PropertyState propertyState, Pageable pageable);
    List<Property> findTop10ByPropertyStateOrderByScoreDesc(PropertyState propertyState);

    @Query("SELECT p FROM Property p WHERE p.propertyState = :state AND " +
           "(SELECT MAX(l.updatedAt) FROM PropertyUpdateLog l WHERE l.property = p AND l.updateType IN :types) < :thresholdDate")
    List<Property> findPropertiesForReverification(
            @Param("state") PropertyState state,
            @Param("types") List<PropertyUpdateType> types,
            @Param("thresholdDate") Timestamp thresholdDate
    );
}

