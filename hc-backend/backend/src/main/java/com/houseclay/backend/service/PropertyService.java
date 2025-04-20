package com.houseclay.backend.service;

import com.houseclay.backend.entity.Admin;
import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.PropertyDocument;
import com.houseclay.backend.entity.User;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.repository.AdminRepository;
import com.houseclay.backend.repository.PropertyRepository;
import com.houseclay.backend.repository.PropertySearchRepository;
import com.houseclay.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
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
            property.setOwner(user);
            user.getOwnedProperties().add(property);
            indexPropertyInElastic(property);
            return propertyRepository.save(property);
        }
        throw new APIException("Invalid token", HttpStatus.BAD_REQUEST);
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



    public void indexPropertyInElastic(Property property) {
        PropertyDocument doc = new PropertyDocument();
        doc.setId(property.getPropertyID());
        doc.setTitle(property.getTitle());
        doc.setCity(property.getCity());
        doc.setDescription(property.getDescription());
        doc.setLocation(new PropertyDocument.GeoPoint(property.getLatitude(), property.getLongitude()));
        propertySearchRepository.save(doc);
    }

}
