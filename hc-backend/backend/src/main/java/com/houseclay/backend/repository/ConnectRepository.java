package com.houseclay.backend.repository;

import com.houseclay.backend.entity.Connect;
import com.houseclay.backend.entity.ConnectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;

@Repository
public interface ConnectRepository extends JpaRepository<Connect, Long> {

    @Modifying
    @Transactional
    @Query("UPDATE Connect c SET c.status = :newStatus WHERE c.status = :oldStatus AND c.createdAt < :expiryDate")
    int expireOldConnects(ConnectStatus newStatus, ConnectStatus oldStatus, Timestamp expiryDate);
}
