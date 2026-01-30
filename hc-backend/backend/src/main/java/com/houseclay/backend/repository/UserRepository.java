package com.houseclay.backend.repository;

import com.houseclay.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByCorporateEmailID(String corporateEmailID);
}
