package com.houseclay.backend.repository;

import com.houseclay.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.houseclay.backend.enums.CorporateBenefitStatus;
import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByCorporateEmailID(String corporateEmailID);
    
    List<User> findByCorporateBenefitStatus(CorporateBenefitStatus corporateBenefitStatus);
    
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.connectBal = u.connectBal - :amount WHERE u.phoneNo = :phoneNo AND u.connectBal >= :amount")
    int decrementConnectBalance(String phoneNo, int amount);
}
