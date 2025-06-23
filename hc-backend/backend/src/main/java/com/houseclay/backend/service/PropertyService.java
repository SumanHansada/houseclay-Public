package com.houseclay.backend.service;

import com.houseclay.backend.entity.*;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.repository.PropertyRepository;
import com.houseclay.backend.repository.PropertySearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PropertySearchRepository propertySearchRepository;

    @Autowired
    private PhotoService photoService;

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
            Property property = propertyOpt.get();
            property.setImages(
                    property.getImages().stream()
                            .map(photoService::getObjectPresignedUrl)
                            .collect(Collectors.toList())
            );
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
