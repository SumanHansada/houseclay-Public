package com.houseclay.backend.service;

import com.houseclay.backend.entity.*;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.repository.PropertyRepository;
import com.houseclay.backend.repository.UserRepository;
import com.houseclay.backend.utils.PropertyUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
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

    @Autowired
    private PropertyElasticService propertyElasticService;

    public Property addProperty(User user, Property property) throws APIException {
        Optional<User> userOpt = userRepository.findById(user.getPhoneNo());
        if (userOpt.isPresent()) {
            user = userOpt.get();
            property.setOwner(user);
            property.setTitle(PropertyUtils.getTitle(property));
            property.setPropertyState(PropertyState.PENDING_VERIFICATION);
            property.getPropertyUpdateLogs().add(new PropertyUpdateLog(property, user, "added by user", PropertyUpdateType.CREATE));
            user.getOwnedProperties().add(property);
            userRepository.save(user);
            return property;
        }
        throw new APIException("Invalid token", HttpStatus.BAD_REQUEST);
    }

    public Property updateProperty(User user, Property property) throws APIException {
        Optional<Property> propertyOpt = propertyRepository.findById(property.getPropertyID());
        if (propertyOpt.isEmpty()) {
            throw new APIException("Invalid property", HttpStatus.BAD_REQUEST);
        }
        if (!propertyOpt.get().getOwner().getPhoneNo().equals(user.getPhoneNo())) {
            throw new APIException("user not allowed", HttpStatus.FORBIDDEN);
        }
        property.getPropertyUpdateLogs().add(new PropertyUpdateLog(property, user,"updated by user", PropertyUpdateType.UPDATE));
        return propertyRepository.save(property);
    }

    public void deactivateProperty(User user, String propertyID) throws APIException {
        Optional<Property> propertyOpt = propertyRepository.findById(propertyID);
        if (propertyOpt.isEmpty()) {
            throw new APIException("Invalid property", HttpStatus.BAD_REQUEST);
        }
        if (!propertyOpt.get().getOwner().getPhoneNo().equals(user.getPhoneNo())) {
            throw new APIException("user not allowed", HttpStatus.FORBIDDEN);
        }
        Property property = propertyOpt.get();
        property.setPropertyState(PropertyState.INACTIVE);
        property.getPropertyUpdateLogs().add(new PropertyUpdateLog(property, user, "deactivated by user", PropertyUpdateType.DEACTIVATE));
        propertyRepository.save(property);
        propertyElasticService.deletePropertyInElastic(property);
    }

    public Property getPropertyForUser(String id, User user) throws APIException {
        Property property = propertyService.getProperty(id);
        if (user.getPhoneNo().equals(property.getOwner().getPhoneNo())) {
            return property;
        }
        throw new APIException("Access denied", HttpStatus.FORBIDDEN);
    }

    public void reportProperty(User user, String propertyId, ReportType reportType) throws APIException {
        Optional<Property> propertyOpt = propertyRepository.findById(propertyId);
        if (propertyOpt.isEmpty()) {
            throw new APIException("Invalid property", HttpStatus.BAD_REQUEST);
        }
        Property property = propertyOpt.get();
        ReportProperty reportProperty = new ReportProperty();
        reportProperty.setReportType(reportType);
        reportProperty.setReportTime(new Timestamp(System.currentTimeMillis()));
        reportProperty.setProperty(property);
        reportProperty.setUser(user);
        if (property.getReportedProperties().size() >= 2) {
            property.setPropertyState(PropertyState.PENDING_VERIFICATION);
        }
        propertyRepository.save(property);
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
        propertyAction.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        propertyAction.setUserActionType(UserActionType.CONTACT);
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
