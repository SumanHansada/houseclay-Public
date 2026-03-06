package com.houseclay.backend.service;

import com.houseclay.backend.entity.*;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.repository.UserRepository;
import com.houseclay.backend.repository.ConnectRepository;
import com.houseclay.backend.config.BundleConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class ConnectManagementService {

    private static final Logger logger = LoggerFactory.getLogger(ConnectManagementService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConnectRepository connectRepository;

    @Autowired
    private BundleConfig bundleConfig;

    final static int NEW_USER_CONNECT_GRANT = 1;
    final static int EMAIL_VERIFICATION_GRANT = 1;

    final static String SYSTEM_ACTOR = "SYSTEM";

    @Transactional
    public User addNewUserConnect(String phoneNo) throws Exception {
        Optional<User> optionalUser = userRepository.findById(phoneNo);
        if(optionalUser.isEmpty()) {
            throw new APIException("Invalid user login", HttpStatus.BAD_REQUEST);
        }
        User user = optionalUser.get();
        for (int i = 0; i < NEW_USER_CONNECT_GRANT; i++) {
            ConnectEvent connectEvent = new ConnectEvent();
            connectEvent.setEventType(ConnectEventType.CREATED);
            connectEvent.setActorType(ActorType.SYSTEM);
            connectEvent.setActorId(SYSTEM_ACTOR);
            Connect connect = new Connect();
            connect.setSourceType(ConnectSourceType.NEW_USER_GRANT);
            connect.setSourceId(SYSTEM_ACTOR);
            connect.setUser(user);
            connect.setStatus(ConnectStatus.ACTIVE);
            connect.getEvents().add(connectEvent);
            connectEvent.setConnect(connect);
            user.getConnects().add(connect);
        }
        user.setConnectBal(user.getConnectBal() + NEW_USER_CONNECT_GRANT);
        userRepository.save(user);
        return user;
    }

    @Transactional
    public int addConnect(String phoneNo, int connectCount, Admin admin) throws Exception {
        Optional<User> optionalUser = userRepository.findById(phoneNo);
        if(optionalUser.isEmpty()) {
            throw new APIException(String.format("user with %s doesn't exist", phoneNo), HttpStatus.BAD_REQUEST);
        }
        User user = optionalUser.get();
        for (int i = 0; i < connectCount; i++) {
            ConnectEvent connectEvent = new ConnectEvent();
            connectEvent.setEventType(ConnectEventType.CREATED);
            connectEvent.setActorType(ActorType.ADMIN);
            connectEvent.setActorId(admin.getUsername());
            Connect connect = new Connect();
            connect.setSourceType(ConnectSourceType.ADMIN_GRANT);
            connect.setSourceId(admin.getUsername());
            connect.setUser(user);
            connect.setStatus(ConnectStatus.ACTIVE);
            connect.getEvents().add(connectEvent);
            connectEvent.setConnect(connect);
            user.getConnects().add(connect);
        }
        user.setConnectBal(user.getConnectBal() + connectCount);
        userRepository.save(user);
        return user.getConnectBal();
    }

    @Transactional
    public void addEmailVerificationConnect(String phoneNo) throws Exception {
        Optional<User> optionalUser = userRepository.findById(phoneNo);
        if(optionalUser.isEmpty()) {
            throw new APIException("Invalid user login", HttpStatus.BAD_REQUEST);
        }
        User user = optionalUser.get();
        for (int i = 0; i < EMAIL_VERIFICATION_GRANT; i++) {
            ConnectEvent connectEvent = new ConnectEvent();
            connectEvent.setEventType(ConnectEventType.CREATED);
            connectEvent.setActorType(ActorType.SYSTEM);
            connectEvent.setActorId(SYSTEM_ACTOR);
            Connect connect = new Connect();
            connect.setSourceType(ConnectSourceType.EMAIL_VERIFICATION_GRANT);
            connect.setSourceId(SYSTEM_ACTOR);
            connect.setUser(user);
            connect.setStatus(ConnectStatus.ACTIVE);
            connect.getEvents().add(connectEvent);
            connectEvent.setConnect(connect);
            user.getConnects().add(connect);
        }
        user.setConnectBal(user.getConnectBal() + EMAIL_VERIFICATION_GRANT);
        userRepository.save(user);
    }

    @Transactional
    public void grantCorporateConnects(User user) throws Exception {
        Optional<User> optionalUser = userRepository.findById(user.getPhoneNo());
        if (optionalUser.isEmpty()) {
             throw new APIException("User not found", HttpStatus.BAD_REQUEST);
        }
        user = optionalUser.get();

        // Check if verified
        if (!user.isCorporateEmailVerified()) {
            throw new APIException("User corporate email not verified", HttpStatus.BAD_REQUEST);
        }

        // Check 30 days validity
        if (user.getCorporateEmailVerifiedAt() == null) {
             throw new APIException("Corporate verification timestamp missing", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        long diff = System.currentTimeMillis() - user.getCorporateEmailVerifiedAt().getTime();
        long days = diff / (1000 * 60 * 60 * 24);
        if (days > 30) {
           throw new APIException("Corporate grant offer expired (must satisfy within 30 days of verification)", HttpStatus.BAD_REQUEST);
        }

        // Check for existing grant
        boolean alreadyGranted = user.getConnects().stream()
                .anyMatch(c -> c.getSourceType() == ConnectSourceType.CORPORATE_VERIFICATION_GRANT);
        if (alreadyGranted) {
             throw new APIException("Corporate benefits already claimed", HttpStatus.CONFLICT);
        }

        // Grant Connects
        int grantAmount = bundleConfig.getConnects();
        for (int i = 0; i < grantAmount; i++) {
            ConnectEvent connectEvent = new ConnectEvent();
            connectEvent.setEventType(ConnectEventType.CREATED);
            connectEvent.setActorType(ActorType.SYSTEM);
            connectEvent.setActorId(SYSTEM_ACTOR);
            
            Connect connect = new Connect();
            connect.setSourceType(ConnectSourceType.CORPORATE_VERIFICATION_GRANT);
            connect.setSourceId(SYSTEM_ACTOR);
            connect.setUser(user);
            connect.setStatus(ConnectStatus.ACTIVE);
            connect.getEvents().add(connectEvent);
            connectEvent.setConnect(connect);
            
            user.getConnects().add(connect);
        }
        
        user.setConnectBal(user.getConnectBal() + grantAmount);
        userRepository.save(user);
    }

    @Transactional
    public int expireOldConnects(int expirationDays) {
        LocalDateTime cutoff = LocalDateTime.now().minus(expirationDays, ChronoUnit.DAYS);
        Timestamp expiryDate = Timestamp.valueOf(cutoff);

        // Fetch aggregation of expiring connects per user
        List<Object[]> aggregatedExpiringConnects = connectRepository.countConnectsToExpirePerUser(ConnectStatus.ACTIVE, expiryDate);
        int totalExpiredConnects = 0;

        for (Object[] result : aggregatedExpiringConnects) {
            String phoneNo = (String) result[0];
            Long countToDeductLong = (Long) result[1];
            int countToDeduct = countToDeductLong.intValue();
            
            // Bulk decrement user balance directly in the database
            userRepository.decrementConnectBalance(phoneNo, countToDeduct);
            totalExpiredConnects += countToDeduct;
        }

        if (totalExpiredConnects > 0) {
            // Bulk update the old connects to EXPIRED status directly in DB
            connectRepository.expireOldConnects(ConnectStatus.EXPIRED, ConnectStatus.ACTIVE, expiryDate);
            logger.info("Successfully expired {} connects in bulk and updated respective users' balances.", totalExpiredConnects);
        }

        return totalExpiredConnects;
    }
}
