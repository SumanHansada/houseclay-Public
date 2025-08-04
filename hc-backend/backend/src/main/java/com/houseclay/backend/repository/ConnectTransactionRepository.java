package com.houseclay.backend.repository;

import com.houseclay.backend.entity.Connect;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConnectTransactionRepository extends JpaRepository<Connect, String> {
}
