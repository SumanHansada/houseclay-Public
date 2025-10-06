package com.houseclay.backend.service;

import com.houseclay.backend.dto.UserLoginResponseDTO;
import com.houseclay.backend.entity.*;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.UserMapper;
import com.houseclay.backend.payload.LoginPayload;
import com.houseclay.backend.payload.UserPayload;
import com.houseclay.backend.repository.UserLoginRepository;
import com.houseclay.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

    public UserLoginResponseDTO createUser(UserPayload userPayload) throws Exception {
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
        return UserMapper.toUserLoginResponseDTO(user, token);
    }

    public UserLoginResponseDTO loginUser(LoginPayload loginPayload) throws Exception {
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
        return UserMapper.toUserLoginResponseDTO(user, token);
    }

    public boolean logoutUser(String authToken) throws Exception {
        List<UserLogin> userLogins = userLoginRepository.findByToken(authToken);
        if (userLogins.isEmpty()) {
            throw new APIException("Invalid token", HttpStatus.BAD_REQUEST);
        }
        userLoginRepository.delete(userLogins.get(0));
        return true;
    }

    public boolean doesUserExist(String phoneNo) {
        Optional<User> userOpt = userRepository.findById(phoneNo);
        return userOpt.isPresent();
    }
}
