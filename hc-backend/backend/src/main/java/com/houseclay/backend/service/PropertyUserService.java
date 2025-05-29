package com.houseclay.backend.service;

import com.houseclay.backend.entity.*;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.repository.PropertyRepository;
import com.houseclay.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class PropertyUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PropertyService propertyService;

    public Property addProperty(User user, Property property) throws APIException {
        Optional<User> userOpt = userRepository.findById(user.getPhoneNo());
        if (userOpt.isPresent()) {
            user = userOpt.get();
            property.setPropertyState(PropertyState.PENDING_VERIFICATION);
            property.setOwner(user);
            user.getOwnedProperties().add(property);
            propertyService.indexPropertyInElastic(property);
            userRepository.save(user);
            return property;
        }
        throw new APIException("Invalid token", HttpStatus.BAD_REQUEST);
    }

    public Property getPropertyForUser(String id, User user) throws APIException {
        Property property = propertyService.getProperty(id);
        if (user.getPhoneNo().equals(property.getOwner().getPhoneNo())) {
            return property;
        }
        throw new APIException("Access denied", HttpStatus.FORBIDDEN);
    }

    @Transactional
    public Map<String, String> getOwnerContact(String propertyId, User user) throws Exception {
        Optional<Property> propertyOpt = propertyRepository.findById(propertyId);
        if (propertyOpt.isEmpty()) {
            throw new APIException("Property not found", HttpStatus.BAD_REQUEST);
        }
        Optional<User> userOpt = userRepository.findById(user.getPhoneNo());
        if (userOpt.isEmpty()) {
            throw new APIException("User not found", HttpStatus.BAD_REQUEST);
        }
        user = userOpt.get();
        Property property = propertyOpt.get();
        int cost = calculateContactCost(property, user);
        if (user.getConnectBal() < cost) {
            throw new APIException("User doesn't have enough connect", HttpStatus.BAD_REQUEST);
        }
        user.setConnectBal(user.getConnectBal() - cost);
        PropertyAction propertyAction = new PropertyAction();
        propertyAction.setProperty(property);
        propertyAction.setUser(user);
        propertyAction.setCreatedAt(LocalDateTime.now());
        propertyAction.setActionType(ActionType.CONTACT);
        user.getPropertyActions().add(propertyAction);
        userRepository.save(user);
        User owner = property.getOwner();
        Map<String, String> contact = new HashMap<>();
        contact.put("phone", owner.getPhoneNo());
        contact.put("name", owner.getName());
        return contact;
    }

    public int calculateContactCost(Property property, User user) {
        return 2;
    }
}
