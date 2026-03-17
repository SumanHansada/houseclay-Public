package com.houseclay.backend.service;

import com.houseclay.backend.config.CookieConfig;
import com.houseclay.backend.dto.UserEditDTO;
import com.houseclay.backend.entity.*;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.UserMapper;
import com.houseclay.backend.payload.LoginPayload;
import com.houseclay.backend.payload.UserPayload;
import com.houseclay.backend.repository.UserLoginRepository;
import com.houseclay.backend.repository.UserRepository;
import com.houseclay.backend.utils.CookieUtils;
import com.houseclay.backend.utils.EmailOTPUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static com.houseclay.backend.utils.Constants.TOKEN_KEY;
import java.sql.Timestamp;
import com.houseclay.backend.enums.CorporateDomainStatus;
import com.houseclay.backend.enums.CorporateBenefitStatus;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserLoginRepository userLoginRepository;

    @Autowired
    private OTPService otpService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ConnectManagementService connectManagementService;

    @Autowired
    private CorporateDomainService corporateDomainService;

    @Autowired
    private CookieConfig cookieConfig;

    public ResponseEntity<?> createUser(UserPayload userPayload) throws Exception {
        if(!otpService.validateOTP(userPayload.getPhoneNo(), userPayload.getOtpCode())) {
            throw new APIException("Invalid OTP Code", HttpStatus.UNAUTHORIZED);
        }
        User user = new User(userPayload.getPhoneNo(), userPayload.getName(), userPayload.getEmailID());
        String token = UUID.randomUUID().toString();
        UserLogin userLogin = new UserLogin(token, user);
        List<UserLogin> userLogins = user.getUserLogins();
        userLogins.add(userLogin);
        user.setUserLogins(userLogins);
        userRepository.save(user);
        user = connectManagementService.addNewUserConnect(user.getPhoneNo());
        return buildLoginResponse(user, token);
    }

    public ResponseEntity<?> loginUser(LoginPayload loginPayload) throws Exception {
        if(!otpService.validateOTP(loginPayload.getPhoneNo(), loginPayload.getOtpCode())) {
            throw new APIException("Invalid OTP Code", HttpStatus.UNAUTHORIZED);
        }
        Optional<User> optionalUser = userRepository.findById(loginPayload.getPhoneNo());
        if(optionalUser.isEmpty()) {
            throw new APIException("Invalid user login", HttpStatus.BAD_REQUEST);
        }
        if(optionalUser.get().isBlacklisted()) {
            throw new APIException("User is blacklisted", HttpStatus.FORBIDDEN);
        }
        String token = UUID.randomUUID().toString();
        User user = optionalUser.get();
        UserLogin userLogin = new UserLogin(token, user);
        List<UserLogin> userLogins = user.getUserLogins();
        userLogins.add(userLogin);
        user.setUserLogins(userLogins);
        userRepository.save(user);
        return buildLoginResponse(user, token);
    }

    public ResponseEntity<?> logoutUser(String authToken) throws Exception {
        List<UserLogin> userLogins = userLoginRepository.findByToken(authToken);
        if (userLogins.isEmpty()) {
            throw new APIException("Invalid token", HttpStatus.BAD_REQUEST);
        }
        userLoginRepository.delete(userLogins.get(0));
        return buildLogoutResponse();
    }

    public String generateOTPForEmail(User user) throws Exception {
        Map<String, String> otpMap = EmailOTPUtils.generateOTP(user.getEmailID());
        String otp = otpMap.get(EmailOTPUtils.OTP_MAP_KEY);
        emailService.sendOTPEmail(user.getEmailID(), user.getName(), otp);
        return otpMap.get(EmailOTPUtils.TOKEN_MAP_KEY);
    }

    public void verifyEmail(User user, String otp, String token) throws Exception {
        if(!EmailOTPUtils.verifyOTP(token, otp)) {
            throw new APIException("Invalid OTP Code", HttpStatus.UNAUTHORIZED);
        }
        Optional<User> optionalUser = userRepository.findById(user.getPhoneNo());
        if(optionalUser.isEmpty()) {
            throw new APIException("Invalid user token", HttpStatus.BAD_REQUEST);
        }
        user = optionalUser.get();
        user.setEmailVerified(true);
        userRepository.save(user);
        connectManagementService.addEmailVerificationConnect(user.getPhoneNo());
    }

    public void userUpdate(User user, UserEditDTO userEditDTO) throws Exception {
        Optional<User> optionalUser = userRepository.findById(user.getPhoneNo());
        if(optionalUser.isEmpty()) {
            throw new APIException("Invalid user", HttpStatus.BAD_REQUEST);
        }
        user = optionalUser.get();
        user.setName(userEditDTO.getName());
        user.setEmailID(userEditDTO.getEmail());
        userRepository.save(user);
    }

    public User doesUserExist(String phoneNo) {
        Optional<User> userOpt = userRepository.findById(phoneNo);
        return userOpt.orElse(null);
    }

    public ResponseEntity<?> buildLoginResponse(User user, String token) {
        // ⚠️ For cross-origin HTTP: Don't set sameSite (legacy browser behavior)
        // ✅ For HTTPS production: Use .secure(true).sameSite("None")
        // Don't set sameSite for HTTP cross-origin (allows cookies to work)
        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from(TOKEN_KEY, token)
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
                .body(UserMapper.toUserLoginResponseDTO(user));
    }

    public String initiateCorporateVerification(User user, String corporateEmail) throws Exception {
        if (user.isCorporateEmailVerified() || (user.getCorporateEmailID() != null && !user.getCorporateEmailID().isEmpty())) {
            throw new APIException("You have already claimed your corporate benefits", HttpStatus.BAD_REQUEST);
        }

        // Check Uniqueness
        if (userRepository.existsByCorporateEmailID(corporateEmail)) {
            throw new APIException("This corporate email is already in use", HttpStatus.CONFLICT);
        }
        
        String domain = corporateDomainService.extractDomain(corporateEmail);
        if (domain == null) {
            throw new APIException("Invalid corporate email format", HttpStatus.BAD_REQUEST);
        }

        // 1. Instant rejection on match with the disposable list
        if (corporateDomainService.isDisposable(domain)) {
            throw new APIException("Email domain not allowed for corporate verification", HttpStatus.BAD_REQUEST);
        }

        // 2. Query DB
        Optional<CorporateDomainStatus> dbStatus = corporateDomainService.getDomainStatusFromDb(domain);
        if (dbStatus.isPresent() && dbStatus.get() == CorporateDomainStatus.DENIED) {
            throw new APIException("Email domain not allowed for corporate verification", HttpStatus.BAD_REQUEST);
        }

        // 3. DNS check Fail-open if NOT already allowed/pending
        if (dbStatus.isEmpty()) {
            boolean hasMx = corporateDomainService.checkMxRecordsFailOpen(domain);
            if (!hasMx) {
                throw new APIException("Email domain is invalid or does not have mail servers", HttpStatus.BAD_REQUEST);
            }
        }

        // 4. Generate OTP
        Map<String, String> otpMap = EmailOTPUtils.generateOTP(corporateEmail);
        String otp = otpMap.get(EmailOTPUtils.OTP_MAP_KEY);
        emailService.sendOTPEmail(corporateEmail, user.getName(), otp);

        return otpMap.get(EmailOTPUtils.TOKEN_MAP_KEY);
    }

    public CorporateBenefitStatus confirmCorporateVerification(User user, String otp, String token, String corporateEmail, String companyName, String jobTitle) throws Exception {
        if(!EmailOTPUtils.verifyOTP(token, otp)) {
            throw new APIException("Invalid OTP Code", HttpStatus.UNAUTHORIZED);
        }

        Optional<User> optionalUser = userRepository.findById(user.getPhoneNo());
        if(optionalUser.isEmpty()) {
            throw new APIException("Invalid user", HttpStatus.BAD_REQUEST);
        }
        user = optionalUser.get();
        user.setCorporateEmailID(corporateEmail);
        user.setCorporateEmailVerified(true);
        user.setCorporateEmailVerifiedAt(new Timestamp(System.currentTimeMillis()));
        user.setCompanyName(companyName);
        user.setJobTitle(jobTitle);

        String domain = corporateDomainService.extractDomain(corporateEmail);
        CorporateDomainStatus domainStatus = corporateDomainService.getDomainStatusFromDb(domain)
                .orElseGet(() -> {
                    corporateDomainService.fetchMetadataAndSavePendingAsync(domain);
                    return CorporateDomainStatus.PENDING;
                });

        CorporateBenefitStatus newBenefitStatus;
        UserUpdateLog log = new UserUpdateLog();
        log.setUser(user);
        log.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        if (domainStatus == CorporateDomainStatus.ALLOWED) {
            newBenefitStatus = CorporateBenefitStatus.APPROVED;
            user.setCorporateBenefitStatus(newBenefitStatus);
            // Grant Connects since the domain is already verified
            connectManagementService.grantCorporateConnects(user);
            log.setUserUpdateType(UserUpdateType.CORPORATE_BENEFIT_VERIFIED);
            log.setComment("Corporate Domain " + domain + " ALLOWED - automatically verifying benefits");
        } else {
            // Wait for DB Admin approval
            newBenefitStatus = CorporateBenefitStatus.PENDING_ADMIN_APPROVAL;
            user.setCorporateBenefitStatus(newBenefitStatus);
            log.setUserUpdateType(UserUpdateType.CORPORATE_BENEFIT_PENDING);
            log.setComment("Corporate Domain " + domain + " PENDING - awaiting admin approval");
        }

        user.getUserUpdateLogs().add(log);
        userRepository.save(user);
        
        return newBenefitStatus;
    }


    public ResponseEntity<?> buildLogoutResponse() {
        // Clear the cookie by setting maxAge to 0
        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from(TOKEN_KEY, "")
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
}
