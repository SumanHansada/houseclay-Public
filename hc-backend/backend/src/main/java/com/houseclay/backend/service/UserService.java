package com.houseclay.backend.service;

import com.houseclay.backend.entity.*;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.UserMapper;
import com.houseclay.backend.payload.LoginPayload;
import com.houseclay.backend.payload.UserPayload;
import com.houseclay.backend.repository.UserLoginRepository;
import com.houseclay.backend.repository.UserRepository;
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

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserLoginRepository userLoginRepository;

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ConnectManagementService connectManagementService;

    public ResponseEntity<?> createUser(UserPayload userPayload) throws Exception {
        if(!otpService.validateOtp(userPayload.getPhoneNo(), userPayload.getOtpCode())) {
            throw new APIException("Invalid OTP Code", HttpStatus.BAD_REQUEST);
        }
        User user = new User(userPayload.getPhoneNo(), userPayload.getName(), userPayload.getEmailID());
        String token = UUID.randomUUID().toString();
        UserLogin userLogin = new UserLogin(token, user);
        List<UserLogin> userLogins = user.getUserLogins();
        userLogins.add(userLogin);
        user.setUserLogins(userLogins);
        userRepository.save(user);
        connectManagementService.addNewUserConnect(user.getPhoneNo());
        return buildLoginResponse(user, token);
    }

    public ResponseEntity<?> loginUser(LoginPayload loginPayload) throws Exception {
        if(!otpService.validateOtp(loginPayload.getPhoneNo(), loginPayload.getOtpCode())) {
            throw new APIException("Invalid OTP Code", HttpStatus.BAD_REQUEST);
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
    
    public ResponseEntity<?> buildLogoutResponse() {
        // Clear the cookie by setting maxAge to 0
        ResponseCookie cookie = ResponseCookie.from(TOKEN_KEY, "")
                .httpOnly(true)
                .secure(true) // Set to true when using HTTPS
                .sameSite("None")
                .path("/")
                .maxAge(0) // Clear the cookie
                .build();
        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(Map.of("message", "Logout successful"));
    }

    public boolean doesUserExist(String phoneNo) {
        Optional<User> userOpt = userRepository.findById(phoneNo);
        return userOpt.isPresent();
    }

    public ResponseEntity<?> buildLoginResponse(User user, String token) {
        // ⚠️ For cross-origin HTTP: Don't set sameSite (legacy browser behavior)
        // ✅ For HTTPS production: Use .secure(true).sameSite("None")
        // Don't set sameSite for HTTP cross-origin (allows cookies to work)
        // Uncomment below for HTTPS: .sameSite("None")

        ResponseCookie cookie = ResponseCookie.from(TOKEN_KEY, token)
                .httpOnly(true)
                .secure(true) // Set to true when using HTTPS
                .sameSite("None")
                .path("/")
                .maxAge(60 * 60)
                .build();
                
        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(UserMapper.toUserLoginResponseDTO(user));
    }
}
