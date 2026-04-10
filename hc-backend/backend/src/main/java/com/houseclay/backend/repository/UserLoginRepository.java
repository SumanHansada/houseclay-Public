package com.houseclay.backend.repository;

import com.houseclay.backend.entity.User;
import com.houseclay.backend.entity.UserLogin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface UserLoginRepository extends JpaRepository<UserLogin,String> {
    List<UserLogin> findByToken(String token);

    List<UserLogin> findByUserOrderByCreatedAtAsc(User user);

    @Modifying
    @Transactional
    @Query("DELETE FROM UserLogin ul WHERE ul.expiresAt < :now OR ul.expiresAt IS NULL")
    int deleteExpiredTokens(@Param("now") Timestamp now);
}
