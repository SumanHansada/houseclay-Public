package com.houseclay.backend.service;

import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.User;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.repository.PropertyRepository;
import com.houseclay.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShortlistPropertyService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    public List<Property> shortlistProperty(User user, String propertyId) throws Exception {
        Optional<Property> propertyOpt = propertyRepository.findById(propertyId);
        if (propertyOpt.isEmpty()) {
            throw new APIException("Property not found", HttpStatus.BAD_REQUEST);
        }

        Property property = propertyOpt.get();
        user.getShortlistedProperties().add(property);
        userRepository.save(user); // Save updated shortlist
        return user.getShortlistedProperties();
    }

    public List<Property> removeShortlistedProperty(User user, String propertyId) throws Exception {
        Optional<Property> propertyOpt = propertyRepository.findById(propertyId);
        if (propertyOpt.isEmpty()) {
            throw new APIException("Property not found", HttpStatus.BAD_REQUEST);
        }

        Property property = propertyOpt.get();
        user.getShortlistedProperties().remove(property);
        userRepository.save(user); // Save updated shortlist
        return user.getShortlistedProperties();
    }

    public List<Property> getShortlistedProperties(User user) {
        return user.getShortlistedProperties();
    }
}
