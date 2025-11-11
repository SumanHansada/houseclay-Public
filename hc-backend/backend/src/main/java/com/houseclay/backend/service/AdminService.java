package com.houseclay.backend.service;

import com.houseclay.backend.dto.AdminRegisterDTO;
import com.houseclay.backend.dto.UserDTO;
import com.houseclay.backend.entity.*;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.AdminMapper;
import com.houseclay.backend.mapper.UserMapper;
import com.houseclay.backend.repository.AdminLoginRepository;
import com.houseclay.backend.repository.AdminRepository;
import com.houseclay.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static com.houseclay.backend.utils.Constants.ADMIN_TOKEN_KEY;

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

    public Admin registerAdmin(AdminRegisterDTO adminRegisterDTO) throws Exception {
        if (adminRepository.findByUsername(adminRegisterDTO.getUsername()).isPresent()) {
            throw new APIException("Username already exists", HttpStatus.BAD_REQUEST);
        }
        Admin admin = new Admin();
        admin.setUsername(adminRegisterDTO.getUsername());
        admin.setPassword(passwordEncoder.encode(adminRegisterDTO.getPassword()));
        admin.setName(adminRegisterDTO.getName());
        adminRepository.save(admin);
        return admin;
    }

    public ResponseEntity<?> loginAdmin(String username, String password) throws Exception {
        Optional<Admin> adminOptional = adminRepository.findByUsername(username);
        if (adminOptional.isEmpty()) {
            throw new APIException("Incorrect username", HttpStatus.BAD_REQUEST);
        }
        if (!passwordEncoder.matches(password, adminOptional.get().getPassword())) {
            throw new APIException("Incorrect password", HttpStatus.BAD_REQUEST);
        }

        Admin admin = adminOptional.get();

        // Generate auth token
        String authToken = UUID.randomUUID().toString();

        AdminLogin adminLogin = new AdminLogin(admin, authToken);
        List<AdminLogin> adminLogins = admin.getAdminLogins();
        adminLogins.add(adminLogin);
        admin.setAdminLogins(adminLogins);

        adminRepository.save(admin);
        return buildLoginResponse(admin, authToken);
    }

    public ResponseEntity<?> logoutAdmin(String authToken) throws Exception {
        Optional<AdminLogin> adminLoginOpt = adminLoginRepository.findByAuthToken(authToken);
        if (adminLoginOpt.isEmpty()) {
            throw new APIException("Invalid or expired auth token", HttpStatus.BAD_REQUEST);
        }
        adminLoginRepository.delete(adminLoginOpt.get());
        return buildLogoutResponse();
    }

    public User blacklistUser(String phoneNo, String comment, Admin admin) throws Exception {
        Optional<Admin> adminOptional = adminRepository.findByUsername(admin.getUsername());
        if (adminOptional.isEmpty()) {
            throw new APIException("Invalid token", HttpStatus.BAD_REQUEST);
        }
        admin = adminOptional.get();
        User user = searchUser(phoneNo);
        user.setBlacklisted(true);
        admin.getUserUpdateLogs().add(new UserUpdateLog(user, admin, new Timestamp(System.currentTimeMillis()), UserUpdateType.BLACKLISTED, comment));
        adminRepository.save(admin);
        return user;
    }

    public User tagBroker(String phoneNo, String comment, Admin admin) throws Exception {
        Optional<Admin> adminOptional = adminRepository.findByUsername(admin.getUsername());
        if (adminOptional.isEmpty()) {
            throw new APIException("Invalid token", HttpStatus.BAD_REQUEST);
        }
        admin = adminOptional.get();
        User user = searchUser(phoneNo);
        user.setBroker(true);
        admin.getUserUpdateLogs().add(new UserUpdateLog(user, admin, new Timestamp(System.currentTimeMillis()), UserUpdateType.BLACKLISTED, comment));
        adminRepository.save(admin);
        return user;
    }

    public User activateUser(String phoneNo, String comment, Admin admin) throws Exception {
        Optional<Admin> adminOptional = adminRepository.findByUsername(admin.getUsername());
        if (adminOptional.isEmpty()) {
            throw new APIException("Invalid token", HttpStatus.BAD_REQUEST);
        }
        admin = adminOptional.get();
        User user = searchUser(phoneNo);
        user.setBlacklisted(false);
        admin.getUserUpdateLogs().add(new UserUpdateLog(user, admin, new Timestamp(System.currentTimeMillis()), UserUpdateType.ACTIVATED, comment));
        adminRepository.save(admin);
        return user;
    }

    public User searchUser(String phoneNo) throws Exception {
        Optional<User> userOpt = userRepository.findById(phoneNo);
        if (userOpt.isEmpty()) {
            throw new APIException("User not found", HttpStatus.NOT_FOUND);
        }
        return userOpt.get();
    }

    public Page<UserDTO> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(UserMapper::toDTO);
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    private ResponseEntity<?> buildLoginResponse(Admin admin, String token) {
        ResponseCookie cookie = ResponseCookie.from(ADMIN_TOKEN_KEY, token)
                .httpOnly(true)
                .secure(true) // Set to true when using HTTPS
                .sameSite("None")
                .domain(".houseclay.com")
                .path("/")
                .maxAge(60 * 60)
                .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(AdminMapper.toAdminInfoDTO(admin));
    }

    private ResponseEntity<?> buildLogoutResponse() {
        // Clear the cookie by setting maxAge to 0
        ResponseCookie cookie = ResponseCookie.from(ADMIN_TOKEN_KEY, "")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .domain(".houseclay.com")
                .path("/")
                .maxAge(0)
                .build();
        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(Map.of("message", "Logout successful"));
    }

}


