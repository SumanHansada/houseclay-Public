package com.houseclay.backend.repository;

import com.houseclay.backend.entity.User;
import com.houseclay.backend.entity.UserLogin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserLoginRepository extends JpaRepository<UserLogin,String> {
    List<UserLogin> findByToken(String token);
}
