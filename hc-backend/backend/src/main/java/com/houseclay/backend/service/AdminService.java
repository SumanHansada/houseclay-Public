package com.houseclay.backend.service;

import com.houseclay.backend.entity.Admin;
import com.houseclay.backend.entity.AdminLogin;
import com.houseclay.backend.entity.User;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.repository.AdminLoginRepository;
import com.houseclay.backend.repository.AdminRepository;
import com.houseclay.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private AdminLoginRepository adminLoginRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    public Admin registerAdmin(Admin admin) throws Exception {
        if (adminRepository.findByUsername(admin.getUsername()).isPresent()) {
            throw new APIException("Username already exists", HttpStatus.BAD_REQUEST);
        }
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        adminRepository.save(admin);
        return admin;
    }

    public String loginAdmin(String username, String password) throws Exception {
        Optional<Admin> adminOptional = adminRepository.findByUsername(username);
        if (adminOptional.isEmpty() || !passwordEncoder.matches(password, adminOptional.get().getPassword())) {
            throw new APIException("Invalid username or password", HttpStatus.BAD_REQUEST);
        }

        Admin admin = adminOptional.get();

        // Generate auth token
        String authToken = UUID.randomUUID().toString();

        AdminLogin adminLogin = new AdminLogin(admin, authToken);
        List<AdminLogin> adminLogins = admin.getAdminLogins();
        adminLogins.add(adminLogin);
        admin.setAdminLogins(adminLogins);

        adminRepository.save(admin);
        return authToken;
    }

    public boolean logoutAdmin(String authToken) throws Exception {
        Optional<AdminLogin> adminLogin = adminLoginRepository.findByAuthToken(authToken);
        if (adminLogin.isPresent()) {
            adminLoginRepository.deleteByAuthToken(authToken);
        } else {
            throw new APIException("Invalid or expired auth token", HttpStatus.BAD_REQUEST);
        }
        return true;
    }

    public User blacklistUser(String userId, Admin admin) throws Exception {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new APIException("User not found", HttpStatus.NOT_FOUND);
        }
        User user = userOpt.get();
        user.setBlacklisted(true);
        user.setBlacklistedAt(new Timestamp(System.currentTimeMillis()));
        admin.getBlacklistedUsers().add(user);
        adminRepository.save(admin);
        userRepository.save(user);
        return user;
    }

}


