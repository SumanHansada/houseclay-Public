package com.houseclay.backend.repository;


import com.houseclay.backend.entity.Admin;
import com.houseclay.backend.entity.AdminLogin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface AdminLoginRepository extends JpaRepository<AdminLogin, Long> {
    Optional<AdminLogin> findByAuthToken(String authToken);
    @Transactional
    void deleteByAdmin(Admin admin);
}
