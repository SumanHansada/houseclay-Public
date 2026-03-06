package com.houseclay.backend.service;

import com.houseclay.backend.config.CookieConfig;
import com.houseclay.backend.dto.AdminDetailDTO;
import com.houseclay.backend.dto.AdminSummaryDTO;
import com.houseclay.backend.dto.AdminRegisterDTO;
import com.houseclay.backend.dto.AdminUserDTO;
import com.houseclay.backend.dto.UserDTO;
import com.houseclay.backend.entity.*;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.AdminMapper;
import com.houseclay.backend.mapper.UserMapper;
import com.houseclay.backend.repository.AdminLoginRepository;
import com.houseclay.backend.repository.AdminRepository;
import com.houseclay.backend.repository.UserRepository;
import com.houseclay.backend.utils.CookieUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Autowired
    private CookieConfig cookieConfig;

    public Admin registerAdmin(AdminRegisterDTO adminRegisterDTO) throws Exception {
        if (adminRepository.findByUsername(adminRegisterDTO.getUsername()).isPresent()) {
            throw new APIException("Username already exists", HttpStatus.BAD_REQUEST);
        }
        Admin admin = new Admin();
        admin.setUsername(adminRegisterDTO.getUsername());
        admin.setPassword(passwordEncoder.encode(adminRegisterDTO.getPassword()));
        admin.setName(adminRegisterDTO.getName());
        admin.setRole(adminRegisterDTO.getRole());
        admin.setPhoneNo(adminRegisterDTO.getPhoneNo());
        admin.setSecondaryPhoneNo(adminRegisterDTO.getSecondaryPhoneNo());
        admin.setPersonalEmail(adminRegisterDTO.getPersonalEmail());
        admin.setAddress(adminRegisterDTO.getAddress());
        admin.setDateOfBirth(adminRegisterDTO.getDateOfBirth());
        admin.setDateOfJoining(adminRegisterDTO.getDateOfJoining());
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

        if (!admin.isActive()) {
            throw new APIException("Account is disabled. Please contact support.", HttpStatus.FORBIDDEN);
        }

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

    public User createUser(UserDTO userDTO) throws Exception {
        Optional<User> userOpt = userRepository.findById(userDTO.getPhoneNo());
        if (userOpt.isPresent()) {
            throw new APIException("User already exists", HttpStatus.BAD_REQUEST);
        }
        User user = new User(userDTO.getPhoneNo(), userDTO.getName(), userDTO.getEmail());
        return userRepository.save(user);
    }

    public Page<AdminUserDTO> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(UserMapper::toAdminUserDTO);
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    private ResponseEntity<?> buildLoginResponse(Admin admin, String token) {
        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from(ADMIN_TOKEN_KEY, token)
            .httpOnly(true)
            .secure(cookieConfig.isSecure())
            .sameSite(cookieConfig.getSameSite())
            .path("/")
            .maxAge(CookieUtils.COOKIE_MAX_AGE);

        // Only set domain if not empty
        if (cookieConfig.getDomain() != null) {
          builder.domain(cookieConfig.getDomain());
        }
        ResponseCookie cookie = builder.build();
        return ResponseEntity.ok()
            .header("Set-Cookie", cookie.toString())
            .body(AdminMapper.toAdminInfoDTO(admin));
    }

    private ResponseEntity<?> buildLogoutResponse() {
        // Clear the cookie by setting maxAge to 0
        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from(ADMIN_TOKEN_KEY, "")
            .httpOnly(true)
            .secure(cookieConfig.isSecure())
            .sameSite(cookieConfig.getSameSite())
            .path("/")
            .maxAge(0); 

        // Only set domain if not empty
        if (cookieConfig.getDomain() != null) {
          builder.domain(cookieConfig.getDomain());
        }
        ResponseCookie cookie = builder.build();
        return ResponseEntity.ok()
            .header("Set-Cookie", cookie.toString())
            .body(Map.of("message", "Logout successful"));
    }

    public Page<AdminSummaryDTO> getAllAdmins(Pageable pageable, Admin requester) throws APIException {
        return adminRepository.findAll(pageable).map(AdminMapper::toAdminSummaryDTO);
    }

    public AdminDetailDTO getAdminDetails(String username, Admin requester) throws APIException {
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new APIException("Admin not found", HttpStatus.NOT_FOUND));
        return AdminMapper.toAdminDetailDTO(admin);
    }

    @Transactional
    public void deactivateAdmin(String username, Admin requester) throws APIException {
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new APIException("Admin not found", HttpStatus.NOT_FOUND));

        if (admin.getUsername().equals(requester.getUsername())) {
             throw new APIException("You cannot deactivate yourself", HttpStatus.BAD_REQUEST);
        }

        admin.setActive(false);
        adminRepository.save(admin);
        
        // Invalidate all sessions
        adminLoginRepository.deleteByAdmin(admin);
    }

    public void activateAdmin(String username, Admin requester) throws APIException {
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new APIException("Admin not found", HttpStatus.NOT_FOUND));

        admin.setActive(true);
        adminRepository.save(admin);
    }

}


