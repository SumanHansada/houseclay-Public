package com.houseclay.backend.repository;

import com.houseclay.backend.entity.Neighbourhood;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NeighbourhoodRepository extends JpaRepository<Neighbourhood, String> {
    List<Neighbourhood> findByPropertyCountGreaterThan(Long propertyCount);
}
