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
    private PropertySearchRepository propertySearchRepository;



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
