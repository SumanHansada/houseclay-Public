package com.houseclay.backend.service;

import com.houseclay.backend.entity.Admin;
import com.houseclay.backend.entity.Property;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.repository.AdminRepository;
import com.houseclay.backend.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private AdminRepository adminRepository;

    public Property addProperty(Property property) {
        return propertyRepository.save(property);
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public Optional<Property> getPropertyById(String id) {
        return propertyRepository.findById(id);
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
