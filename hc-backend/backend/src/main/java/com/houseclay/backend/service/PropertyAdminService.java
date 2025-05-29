package com.houseclay.backend.service;

import com.houseclay.backend.dto.PropertyDTO;
import com.houseclay.backend.entity.Admin;
import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.PropertyState;
import com.houseclay.backend.entity.User;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.PropertyMapper;
import com.houseclay.backend.repository.AdminRepository;
import com.houseclay.backend.repository.PropertyRepository;
import com.houseclay.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Optional;

@Service
public class PropertyAdminService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private AdminRepository adminRepository;

    public Property addProperty(Property property, String phoneNo, Admin admin) throws APIException {
        Optional<User> userOpt = userRepository.findById(phoneNo);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            property.setPropertyState(PropertyState.PENDING_VERIFICATION);
            property.setOwner(user);
            user.getOwnedProperties().add(property);
            propertyService.indexPropertyInElastic(property);
            userRepository.save(user);
            return property;
        }
        throw new APIException("Invalid user", HttpStatus.BAD_REQUEST);
    }


    public Page<PropertyDTO> getPropertiesByVerifyStatus(boolean isVerified, Pageable pageable) {
        return propertyRepository.findByIsVerified(isVerified, pageable)
                .map(PropertyMapper::toDTO);
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
}
