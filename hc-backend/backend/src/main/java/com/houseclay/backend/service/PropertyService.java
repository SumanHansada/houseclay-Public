package com.houseclay.backend.service;

import com.houseclay.backend.dto.PropertyDTO;
import com.houseclay.backend.entity.*;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.PropertyMapper;
import com.houseclay.backend.repository.AdminRepository;
import com.houseclay.backend.repository.PropertyRepository;
import com.houseclay.backend.repository.PropertySearchRepository;
import com.houseclay.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class PropertyService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PropertySearchRepository propertySearchRepository;

    public Property addProperty(User user, Property property) throws APIException {
        Optional<User> userOpt = userRepository.findById(user.getPhoneNo());
        if (userOpt.isPresent()) {
            user = userOpt.get();
            property.setPropertyState(PropertyState.PENDING_VERIFICATION);
            property.setOwner(user);
            user.getOwnedProperties().add(property);
            indexPropertyInElastic(property);
            userRepository.save(user);
            return property;
        }
        throw new APIException("Invalid token", HttpStatus.BAD_REQUEST);
    }

    public Page<PropertyDTO> getPropertiesByVerifyStatus(boolean isVerified, Pageable pageable) {
        return propertyRepository.findByIsVerified(isVerified, pageable)
                .map(PropertyMapper::toDTO);
    }

    public Property getPropertyForUser(String id, User user) throws APIException {
        Property property = getProperty(id);
        if (user.getPhoneNo().equals(property.getOwner().getPhoneNo())) {
            return property;
        }
        throw new APIException("Access denied", HttpStatus.FORBIDDEN);
    }

    public Property getProperty(String id) throws APIException {
        Optional<Property> propertyOpt = propertyRepository.findById(id);
        if (propertyOpt.isPresent()) {
            return propertyOpt.get();
        }
        throw new APIException("Invalid property ID", HttpStatus.BAD_REQUEST);
    }

    public Property verifyProperty(String propertyId, Admin admin) throws APIException {
        Optional<Property> propertyOpt = propertyRepository.findById(propertyId);

        if (propertyOpt.isEmpty()) {
            throw new APIException("Property not found", HttpStatus.BAD_REQUEST);
        }

        Property property = propertyOpt.get();

        property.setVerified(true);
        property.setVerifiedBy(admin);
        property.setVerifiedOn(new Timestamp(System.currentTimeMillis()));
        admin.getVerifiedProperties().add(property);
        adminRepository.save(admin);
        return propertyRepository.save(property);
    }

    public Property reVerifyProperty(String propertyId, Admin admin) throws APIException {
        Optional<Property> propertyOpt = propertyRepository.findById(propertyId);

        if (propertyOpt.isEmpty()) {
            throw new APIException("Property not found", HttpStatus.BAD_REQUEST);
        }

        Property property = propertyOpt.get();

        property.setReverifiedBy(admin);
        property.setReVerified(true);
        property.setReVerifiedOn(new Timestamp(System.currentTimeMillis()));
        admin.getReverifiedProperties().add(property);
        adminRepository.save(admin);
        return propertyRepository.save(property);
    }



    public void indexPropertyInElastic(Property property) {
        PropertyDocument doc = new PropertyDocument();
        doc.setId(property.getPropertyID());
        doc.setTitle(property.getTitle());
        doc.setCity(property.getCity());
        doc.setDescription(property.getDescription());
        doc.setLocation(new PropertyDocument.GeoPoint(property.getLatitude(), property.getLongitude()));
        propertySearchRepository.save(doc);
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
        user.getContactedProperties().add(property);
        property.getContactedUsers().add(user);
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
