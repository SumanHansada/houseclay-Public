package com.houseclay.backend.service;

import com.houseclay.backend.entity.*;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ConnectManagementService {

    @Autowired
    private UserRepository userRepository;

    final static int NEW_USER_CONNECT_GRANT = 2;
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
}
