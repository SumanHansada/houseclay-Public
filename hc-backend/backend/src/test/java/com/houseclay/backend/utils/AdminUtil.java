package com.houseclay.backend.utils;

import com.houseclay.backend.entity.Admin;
import com.houseclay.backend.entity.AdminLogin;
import com.houseclay.backend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;

@Component
public class AdminUtil {

    public static final String TEST_ADMIN_USERNAME = "test_admin";
    public static final String TEST_ADMIN_PASSWORD = "test_password";
    public static final String TEST_ADMIN_NAME = "test_name";
    public static final String TEST_ADMIN_AUTH_TOKEN = "test_auth_token";

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Admin createAdmin() {
        Admin admin = new Admin();
        admin.setUsername(TEST_ADMIN_USERNAME);
        admin.setPassword(passwordEncoder.encode(TEST_ADMIN_PASSWORD));
        admin.setName(TEST_ADMIN_NAME);
        adminRepository.save(admin);
        return admin;
    }

    public Admin createAdminLogin() {
        Admin admin = createAdmin();
        AdminLogin adminLogin = new AdminLogin();
        adminLogin.setAuthToken(TEST_ADMIN_AUTH_TOKEN);
        adminLogin.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        adminLogin.setAdmin(admin);
        admin.getAdminLogins().add(adminLogin);
        adminRepository.save(admin);
        return admin;
    }

    public void deleteAdmin(Admin admin) {
        admin = adminRepository.findByUsername(admin.getUsername()).orElseThrow();
        adminRepository.delete(admin);
    }
}
