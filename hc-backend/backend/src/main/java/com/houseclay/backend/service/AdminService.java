package com.houseclay.backend.service;

import com.houseclay.backend.config.CookieConfig;
import com.houseclay.backend.config.SessionConfig;
import com.houseclay.backend.dto.AdminDetailDTO;
import com.houseclay.backend.dto.AdminSummaryDTO;
import com.houseclay.backend.dto.AdminRegisterDTO;
import com.houseclay.backend.dto.AdminUserDTO;
import com.houseclay.backend.dto.AdminUserUpdateDTO;
import com.houseclay.backend.dto.UserDTO;
import com.houseclay.backend.entity.*;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.AdminMapper;
import com.houseclay.backend.mapper.UserMapper;
import com.houseclay.backend.repository.AdminLoginRepository;
import com.houseclay.backend.repository.AdminRepository;
import com.houseclay.backend.repository.UserRepository;
import com.houseclay.backend.repository.CorporateDomainRepository;
import com.houseclay.backend.enums.CorporateBenefitStatus;
import com.houseclay.backend.enums.CorporateDomainStatus;
import com.houseclay.backend.utils.CookieUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Comparator;
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

    @Autowired
    private SessionConfig sessionConfig;

    @Autowired
    private CorporateDomainRepository corporateDomainRepository;

    @Autowired
    private CorporateDomainService corporateDomainService;

    @Autowired
    private ConnectManagementService connectManagementService;

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

        AdminLogin adminLogin = new AdminLogin(admin, authToken, sessionConfig.getDurationMs());
        List<AdminLogin> adminLogins = admin.getAdminLogins();

        // Remove expired sessions (orphanRemoval handles DB deletion)
        adminLogins.removeIf(AdminLogin::isExpired);

        // Evict oldest if at capacity
        if (adminLogins.size() >= sessionConfig.getMaxActive()) {
            adminLogins.sort(Comparator.comparing(AdminLogin::getCreatedAt, Comparator.nullsFirst(Comparator.naturalOrder())));
            int toRemove = adminLogins.size() - sessionConfig.getMaxActive() + 1;
            for (int i = 0; i < toRemove; i++) {
                adminLogins.remove(0);
            }
        }

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

    public User updateUserDetails(String phoneNo, AdminUserUpdateDTO dto, Admin admin) throws Exception {
        Optional<Admin> adminOptional = adminRepository.findByUsername(admin.getUsername());
        if (adminOptional.isEmpty()) {
            throw new APIException("Invalid token", HttpStatus.BAD_REQUEST);
        }
        admin = adminOptional.get();
        User user = searchUser(phoneNo);
        
        boolean updated = false;
        if (dto.getCompanyName() != null) {
            user.setCompanyName(dto.getCompanyName());
            updated = true;
        }
        if (dto.getJobTitle() != null) {
            user.setJobTitle(dto.getJobTitle());
            updated = true;
        }
        if (dto.getEmailID() != null) {
            user.setEmailID(dto.getEmailID());
            updated = true;
        }

        if (updated) {
            admin.getUserUpdateLogs().add(new UserUpdateLog(user, admin, new Timestamp(System.currentTimeMillis()), UserUpdateType.PROFILE_UPDATED, "Admin updated user profile"));
            adminRepository.save(admin);
            userRepository.save(user);
        }
        return user;
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

    public Page<CorporateDomain> getCorporateDomainsByStatus(String status, Pageable pageable, Admin admin) throws APIException {
        if (status.equalsIgnoreCase("all")) {
            return corporateDomainRepository.findAll(pageable);
        }
        try {
            CorporateDomainStatus enumStatus = CorporateDomainStatus.valueOf(status.toUpperCase());
            return corporateDomainRepository.findByStatus(enumStatus, pageable);
        } catch (IllegalArgumentException e) {
            throw new APIException("Invalid status: " + status, HttpStatus.BAD_REQUEST);
        }
    }

    public CorporateDomain approveCorporateDomain(Long id, Admin admin) throws Exception {
        CorporateDomain domain = corporateDomainRepository.findById(id)
                .orElseThrow(() -> new APIException("Corporate Domain not found", HttpStatus.NOT_FOUND));
        if (domain.getStatus() != CorporateDomainStatus.PENDING) {
            throw new APIException("Only pending domains can be approved", HttpStatus.BAD_REQUEST);
        }
        domain.setStatus(CorporateDomainStatus.ALLOWED);
        corporateDomainRepository.save(domain);
        
        // Async update all users
        grantBenefitsToPendingUsersAsync(domain.getDomainName(), admin);
        return domain;
    }

    public CorporateDomain denyCorporateDomain(Long id, Admin admin) throws Exception {
        CorporateDomain domain = corporateDomainRepository.findById(id)
                .orElseThrow(() -> new APIException("Corporate Domain not found", HttpStatus.NOT_FOUND));
        if (domain.getStatus() != CorporateDomainStatus.PENDING) {
            throw new APIException("Only pending domains can be denied", HttpStatus.BAD_REQUEST);
        }
        domain.setStatus(CorporateDomainStatus.DENIED);
        corporateDomainRepository.save(domain);

        // Async update all users
        rejectBenefitsForPendingUsersAsync(domain.getDomainName(), admin);
        return domain;
    }

    @Async
    public void grantBenefitsToPendingUsersAsync(String domainName, Admin admin) {
        List<User> pendingUsers = userRepository.findByCorporateBenefitStatus(CorporateBenefitStatus.PENDING_ADMIN_APPROVAL);
        for (User user : pendingUsers) {
            if (user.getCorporateEmailID() != null && corporateDomainService.extractDomain(user.getCorporateEmailID()).equals(domainName)) {
                user.setCorporateBenefitStatus(CorporateBenefitStatus.APPROVED);
                try {
                    connectManagementService.grantCorporateConnects(user);
                } catch(Exception e) {
                   // Ignore connect grant failures for specific users to not block loop
                }
                user.getUserUpdateLogs().add(new UserUpdateLog(user, admin, new Timestamp(System.currentTimeMillis()), UserUpdateType.CORPORATE_BENEFIT_VERIFIED, "Admin Approved Domain"));
                userRepository.save(user);
            }
        }
    }

    @Async
    public void rejectBenefitsForPendingUsersAsync(String domainName, Admin admin) {
        List<User> pendingUsers = userRepository.findByCorporateBenefitStatus(CorporateBenefitStatus.PENDING_ADMIN_APPROVAL);
        for (User user : pendingUsers) {
            if (user.getCorporateEmailID() != null && corporateDomainService.extractDomain(user.getCorporateEmailID()).equals(domainName)) {
                user.setCorporateBenefitStatus(CorporateBenefitStatus.REJECTED);
                user.getUserUpdateLogs().add(new UserUpdateLog(user, admin, new Timestamp(System.currentTimeMillis()), UserUpdateType.CORPORATE_BENEFIT_REJECTED, "Admin Denied Domain"));
                userRepository.save(user);
            }
        }
    }

}


