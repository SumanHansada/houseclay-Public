package com.houseclay.backend.repository;


import com.houseclay.backend.entity.Admin;
import com.houseclay.backend.entity.AdminLogin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public interface AdminLoginRepository extends JpaRepository<AdminLogin, Long> {
    Optional<AdminLogin> findByAuthToken(String authToken);
    @Transactional
    void deleteByAdmin(Admin admin);

    List<AdminLogin> findByAdminOrderByCreatedAtAsc(Admin admin);

    @Modifying
    @Transactional
    @Query("DELETE FROM AdminLogin al WHERE al.expiresAt < :now OR al.expiresAt IS NULL")
    int deleteExpiredTokens(@Param("now") Timestamp now);
}
