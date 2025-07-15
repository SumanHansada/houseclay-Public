package com.houseclay.backend.service;

import com.houseclay.backend.repository.AdminRepository;
import com.houseclay.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TestOnlyService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Transactional
    public void deleteUser(String phoneNo) {
        userRepository.deleteById(phoneNo);
    }

    @Transactional
    public void deleteAdmin(String username) {
        adminRepository.deleteByUsername(username);
    }
}
